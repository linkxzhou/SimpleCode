// Lazy weblings toolchain. Not part of the default wasm/ manifest.
// GitHub Release assets do not send CORS, so a COEP page cannot read them.
// `./build.sh vendor --rust` verifies those archives and writes the unpacked
// files under wasm/rust/. Otherwise the page fetches the same bytes from the
// weblings demo, which does send Access-Control-Allow-Origin.
import { fetchPinned, PinnedMismatch, sha256Hex } from "@/core/pinned-fetch";
import { t } from "@/i18n";
import lock from "../../scripts/sources.lock.json";

export const RUST_CACHE = "simplecode-rustc-v1";

interface UnpackedPin {
  bytes: number;
  sha256: string;
  sameOrigin: string;
  upstream: string;
}

const rust = lock.rust;
const pins: Record<"rustc" | "bundle", UnpackedPin> = {
  rustc: {
    bytes: rust.unpacked["rustc.wasm"].bytes,
    sha256: rust.unpacked["rustc.wasm"].sha256,
    sameOrigin: rust.unpacked["rustc.wasm"].sameOrigin,
    upstream: rust.unpacked["rustc.wasm"].upstream,
  },
  bundle: {
    bytes: rust.unpacked["sysroot-wasip1.bundle"].bytes,
    sha256: rust.unpacked["sysroot-wasip1.bundle"].sha256,
    sameOrigin: rust.unpacked["sysroot-wasip1.bundle"].sameOrigin,
    upstream: rust.unpacked["sysroot-wasip1.bundle"].upstream,
  },
};

export function rustDownloadBytes(): number {
  return pins.rustc.bytes + pins.bundle.bytes;
}

export interface RustParts {
  module: WebAssembly.Module;
  bundle: Uint8Array;
}

let parts: RustParts | undefined;
let inflight: Promise<RustParts> | undefined;

function cacheAvailable() {
  return typeof caches !== "undefined";
}

function cacheUrl(kind: "rustc" | "bundle") {
  return new URL(`simplecode-rustc/${kind}?v=${pins[kind].sha256.slice(0, 12)}`, location.origin).href;
}


async function readCache(kind: "rustc" | "bundle"): Promise<Uint8Array | undefined> {
  if (!cacheAvailable()) return undefined;
  try {
    const cache = await caches.open(RUST_CACHE);
    const hit = await cache.match(cacheUrl(kind));
    if (!hit) return undefined;
    const bytes = new Uint8Array(await hit.arrayBuffer());
    if (bytes.byteLength !== pins[kind].bytes) return undefined;
    if ((await sha256Hex(bytes)) !== pins[kind].sha256) return undefined;
    return bytes;
  } catch {
    return undefined;
  }
}

async function writeCache(kind: "rustc" | "bundle", bytes: Uint8Array) {
  if (!cacheAvailable()) return;
  try {
    const cache = await caches.open(RUST_CACHE);
    await cache.put(
      cacheUrl(kind),
      new Response(new Blob([bytes]), {
        headers: {
          "content-type": kind === "rustc" ? "application/wasm" : "application/octet-stream",
          "x-size": String(bytes.byteLength),
        },
      }),
    );
  } catch (e) {
    console.warn("[SimpleCode] rust toolchain cache write failed", e);
  }
}

async function loadOne(
  kind: "rustc" | "bundle",
  onBytes: (n: number) => void,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  const cached = await readCache(kind);
  if (cached) {
    onBytes(cached.byteLength);
    return cached;
  }
  const pin = pins[kind];
  const wasm = kind === "rustc";
  // Upstream URLs stay unversioned. A `?v=` query can miss a CDN that does not expect it.
  const attempts: { url: string; version?: string }[] = [
    { url: `${import.meta.env.BASE_URL}${pin.sameOrigin}`, version: pin.sha256 },
    { url: pin.upstream },
  ];
  let last = "";
  for (const attempt of attempts) {
    try {
      const bytes = await fetchPinned({
        url: attempt.url,
        version: attempt.version,
        expectBytes: pin.bytes,
        expectedSha256: pin.sha256,
        wasm,
        signal,
        onBytes,
      });
      await writeCache(kind, bytes);
      return bytes;
    } catch (e) {
      if ((e as Error).name === "AbortError") throw e;
      if (e instanceof PinnedMismatch) {
        const sha = e.sha256 || "-";
        const vars = { kind, expected: pin.bytes, got: e.got, sha };
        last = e.got === pin.bytes ? t("rustDigest", vars) : t("rustShort", vars);
      } else {
        last = e instanceof Error ? e.message : String(e);
      }
    }
  }
  throw new Error(t("rustDownload", { detail: last, upstream: pin.upstream }));
}

export function rustReady(): boolean {
  return !!parts;
}

export async function rustIsCached(): Promise<boolean> {
  if (parts) return true;
  const [a, b] = await Promise.all([readCache("rustc"), readCache("bundle")]);
  return !!a && !!b;
}

export async function rustCacheBytes(): Promise<number> {
  if (!cacheAvailable()) return 0;
  try {
    const cache = await caches.open(RUST_CACHE);
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

export async function clearRustCache() {
  parts = undefined;
  inflight = undefined;
  if (cacheAvailable()) await caches.delete(RUST_CACHE);
}

export function rustParts(): RustParts | undefined {
  return parts;
}

export function ensureRustToolchain(onProgress: (loaded: number, total: number) => void, signal?: AbortSignal): Promise<RustParts> {
  if (parts) {
    onProgress(rustDownloadBytes(), rustDownloadBytes());
    return Promise.resolve(parts);
  }
  if (inflight) return inflight;
  const total = rustDownloadBytes();
  inflight = (async () => {
    let loaded = 0;
    const bump = (n: number) => {
      loaded += n;
      onProgress(Math.min(loaded, total), total);
    };
    const [rustcBytes, bundle] = await Promise.all([loadOne("rustc", bump, signal), loadOne("bundle", bump, signal)]);
    const module = await WebAssembly.compile(rustcBytes);
    parts = { module, bundle };
    onProgress(total, total);
    return parts;
  })().finally(() => {
    inflight = undefined;
  });
  return inflight;
}
