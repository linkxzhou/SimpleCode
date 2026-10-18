// Lazy weblings toolchain. The two files are committed under wasm/rust/ and
// are not part of the default wasm/ manifest. The page loads only those
// same-origin copies. `./build.sh vendor --rust --refresh` re-downloads the
// pinned GitHub archives into that directory.
import { sha256Hex } from "@/core/pinned-fetch";
import lock from "../../scripts/sources.lock.json";
import { fetchRustAsset } from "./fallback";

export const RUST_CACHE = "simplecode-rustc-v1";

interface UnpackedPin {
  bytes: number;
  sha256: string;
  sameOrigin: string;
}

const rust = lock.rust;
const pins: Record<"rustc" | "bundle", UnpackedPin> = {
  rustc: {
    bytes: rust.unpacked["rustc.wasm"].bytes,
    sha256: rust.unpacked["rustc.wasm"].sha256,
    sameOrigin: rust.unpacked["rustc.wasm"].sameOrigin,
  },
  bundle: {
    bytes: rust.unpacked["sysroot-wasip1.bundle"].bytes,
    sha256: rust.unpacked["sysroot-wasip1.bundle"].sha256,
    sameOrigin: rust.unpacked["sysroot-wasip1.bundle"].sameOrigin,
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
let inflight: { promise: Promise<RustParts>; signal?: AbortSignal } | undefined;

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
  const bytes = await fetchRustAsset({
    kind,
    url: `${import.meta.env.BASE_URL}${pin.sameOrigin}`,
    version: pin.sha256,
    bytes: pin.bytes,
    sha256: pin.sha256,
    wasm: kind === "rustc",
    signal,
    onBytes,
  });
  await writeCache(kind, bytes);
  return bytes;
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
  // A language switch aborts the previous signal. Joining that promise would
  // fail the new selection with the same AbortError.
  if (inflight && !inflight.signal?.aborted) return inflight.promise;
  const total = rustDownloadBytes();
  const owned = signal;
  const promise = (async () => {
    let loaded = 0;
    const bump = (n: number) => {
      loaded += n;
      onProgress(Math.min(loaded, total), total);
    };
    const [rustcBytes, bundle] = await Promise.all([loadOne("rustc", bump, owned), loadOne("bundle", bump, owned)]);
    const module = await WebAssembly.compile(rustcBytes);
    parts = { module, bundle };
    onProgress(total, total);
    return parts;
  })().finally(() => {
    if (inflight?.promise === promise) inflight = undefined;
  });
  inflight = { promise, signal: owned };
  return promise;
}
