// Lazy TeaVM playground toolchain. Not part of the default wasm/ manifest.
// teavm.org sends no CORS headers, so a COEP page cannot fetch it.
// `./build.sh vendor --java` checks the pins and writes wasm/java/.
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

async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function readCache(name: JavaFileName): Promise<Uint8Array | undefined> {
  if (!cacheAvailable()) return undefined;
  try {
    const cache = await caches.open(JAVA_CACHE);
    const hit = await cache.match(cacheUrl(name));
    if (!hit) return undefined;
    const bytes = new Uint8Array(await hit.arrayBuffer());
    if (bytes.byteLength !== pins[name].bytes) return undefined;
    if ((await sha256(bytes)) !== pins[name].sha256) return undefined;
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

async function fetchCounted(url: string, onBytes: (n: number) => void, signal?: AbortSignal): Promise<Uint8Array> {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (!res.body) {
    const buf = new Uint8Array(await res.arrayBuffer());
    onBytes(buf.byteLength);
    return buf;
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.byteLength;
    onBytes(value.byteLength);
  }
  const out = new Uint8Array(received);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return out;
}

class PinError extends Error {}

async function loadOne(name: JavaFileName, onBytes: (n: number) => void, signal?: AbortSignal): Promise<Uint8Array> {
  const cached = await readCache(name);
  if (cached) {
    onBytes(cached.byteLength);
    return cached;
  }
  const pin = pins[name];
  const url = `${import.meta.env.BASE_URL}${pin.sameOrigin}`;
  let counted = 0;
  try {
    const bytes = await fetchCounted(
      url,
      (n) => {
        counted += n;
        onBytes(n);
      },
      signal,
    );
    if (bytes.byteLength !== pin.bytes || (await sha256(bytes)) !== pin.sha256) {
      throw new PinError(t("javaDigest", { file: name }));
    }
    await writeCache(name, bytes);
    return bytes;
  } catch (e) {
    if (counted) onBytes(-counted);
    if (e instanceof PinError || (e as Error).name === "AbortError") throw e;
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
