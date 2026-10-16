// Lazy TeaVM playground toolchain. Not part of the default wasm/ manifest.
// teavm.org sends no CORS headers, so a COEP page cannot fetch it.
// `./build.sh vendor --java` checks the pins and writes wasm/java/.
import { fetchPinned, PinnedMismatch, PinnedMissing, sha256Hex } from "@/core/pinned-fetch";
import { t } from "@/i18n";
import lock from "../../scripts/sources.lock.json";

export const JAVA_CACHE = "simplecode-teavm-v1";

export type JavaFileName =
  | "compiler.wasm"
  | "compiler.wasm-runtime.js"
  | "compile-classlib-teavm.bin"
  | "runtime-classlib-teavm.bin";

interface FilePin {
  bytes: number;
  sha256: string;
  sameOrigin: string;
  upstream: string;
}

const files = lock.java.files;
const ORDER: JavaFileName[] = [
  "compiler.wasm",
  "compiler.wasm-runtime.js",
  "compile-classlib-teavm.bin",
  "runtime-classlib-teavm.bin",
];

const pins: Record<JavaFileName, FilePin> = {
  "compiler.wasm": files["compiler.wasm"],
  "compiler.wasm-runtime.js": files["compiler.wasm-runtime.js"],
  "compile-classlib-teavm.bin": files["compile-classlib-teavm.bin"],
  "runtime-classlib-teavm.bin": files["runtime-classlib-teavm.bin"],
};

export interface JavaParts {
  compilerWasm: Uint8Array;
  runtimeJs: string;
  compileClasslib: Uint8Array;
  runtimeClasslib: Uint8Array;
}

let parts: JavaParts | undefined;
let inflight: Promise<JavaParts> | undefined;

export function javaDownloadBytes(): number {
  return ORDER.reduce((n, name) => n + pins[name].bytes, 0);
}

/** Struct type from the Wasm GC proposal. Older engines reject this module. */
export function javaWasmGcSupported(): boolean {
  try {
    return WebAssembly.validate(
      new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x05, 0x01, 0x5f, 0x01, 0x7b, 0x00]),
    );
  } catch {
    return false;
  }
}

function cacheAvailable() {
  return typeof caches !== "undefined";
}

function cacheUrl(name: JavaFileName) {
  return new URL(`simplecode-teavm/${name}?v=${pins[name].sha256.slice(0, 12)}`, location.origin).href;
}


async function readCache(name: JavaFileName): Promise<Uint8Array | undefined> {
  if (!cacheAvailable()) return undefined;
  try {
    const cache = await caches.open(JAVA_CACHE);
    const hit = await cache.match(cacheUrl(name));
    if (!hit) return undefined;
    const bytes = new Uint8Array(await hit.arrayBuffer());
    if (bytes.byteLength !== pins[name].bytes) return undefined;
    if ((await sha256Hex(bytes)) !== pins[name].sha256) return undefined;
    return bytes;
  } catch {
    return undefined;
  }
}

async function writeCache(name: JavaFileName, bytes: Uint8Array) {
  if (!cacheAvailable()) return;
  try {
    const cache = await caches.open(JAVA_CACHE);
    const type = name.endsWith(".js") ? "text/javascript" : name.endsWith(".wasm") ? "application/wasm" : "application/octet-stream";
    await cache.put(
      cacheUrl(name),
      new Response(new Blob([bytes]), {
        headers: { "content-type": type, "x-size": String(bytes.byteLength) },
      }),
    );
  } catch (e) {
    console.warn("[SimpleCode] java toolchain cache write failed", e);
  }
}

async function loadOne(name: JavaFileName, onBytes: (n: number) => void, signal?: AbortSignal): Promise<Uint8Array> {
  const cached = await readCache(name);
  if (cached) {
    onBytes(cached.byteLength);
    return cached;
  }
  const pin = pins[name];
  try {
    const bytes = await fetchPinned({
      url: `${import.meta.env.BASE_URL}${pin.sameOrigin}`,
      version: pin.sha256,
      expectBytes: pin.bytes,
      expectedSha256: pin.sha256,
      wasm: name.endsWith(".wasm"),
      signal,
      onBytes,
    });
    await writeCache(name, bytes);
    return bytes;
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    if (e instanceof PinnedMissing) throw new Error(t("javaMissing", { file: name }));
    if (e instanceof PinnedMismatch) {
      const sha = e.sha256 || "-";
      const vars = { file: name, expected: pin.bytes, got: e.got, sha };
      throw new Error(e.got === pin.bytes ? t("javaDigest", vars) : t("javaShort", vars));
    }
    const detail = e instanceof Error ? e.message : String(e);
    throw new Error(t("javaDownload", { detail }));
  }
}

export function javaReady(): boolean {
  return !!parts;
}

export async function javaIsCached(): Promise<boolean> {
  if (parts) return true;
  const hits = await Promise.all(ORDER.map((name) => readCache(name)));
  return hits.every(Boolean);
}

export async function javaCacheBytes(): Promise<number> {
  if (!cacheAvailable()) return 0;
  try {
    const cache = await caches.open(JAVA_CACHE);
    let total = 0;
    for (const req of await cache.keys()) {
      const res = await cache.match(req);
      total += Number(res?.headers.get("x-size") ?? 0);
    }
    return total;
  } catch {
    return 0;
  }
}

export async function clearJavaCache() {
  parts = undefined;
  inflight = undefined;
  if (cacheAvailable()) await caches.delete(JAVA_CACHE);
}

export function javaParts(): JavaParts | undefined {
  return parts;
}

export function ensureJavaToolchain(onProgress: (loaded: number, total: number) => void, signal?: AbortSignal): Promise<JavaParts> {
  if (!javaWasmGcSupported()) return Promise.reject(new Error(t("javaWasmGc")));
  if (parts) {
    onProgress(javaDownloadBytes(), javaDownloadBytes());
    return Promise.resolve(parts);
  }
  if (inflight) return inflight;
  const total = javaDownloadBytes();
  inflight = (async () => {
    let loaded = 0;
    const bump = (n: number) => {
      loaded += n;
      onProgress(Math.max(0, Math.min(loaded, total)), total);
    };
    const [compilerWasm, runtimeBytes, compileClasslib, runtimeClasslib] = await Promise.all(
      ORDER.map((name) => loadOne(name, bump, signal)),
    );
    const next: JavaParts = {
      compilerWasm,
      runtimeJs: new TextDecoder().decode(runtimeBytes),
      compileClasslib,
      runtimeClasslib,
    };
    parts = next;
    onProgress(total, total);
    return next;
  })().finally(() => {
    inflight = undefined;
  });
  return inflight;
}
