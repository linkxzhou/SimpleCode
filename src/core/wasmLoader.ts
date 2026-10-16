import type { BinaryWASIFS } from "@runno/wasi";
import { t } from "@/i18n";
import { WASM_BASE, type Asset } from "./manifest";
import { extractTarGz } from "./tar";

export const CACHE_NAME = "simplecode-wasm-v1";

export type Progress = (loaded: number, total: number) => void;

export interface LoadedAsset {
  id: string;
  /** Blob URL (wasm, or a bin such as libv86.mjs) */
  url?: string;
  /** Extracted filesystem (fs assets) */
  fs?: BinaryWASIFS;
  /** Raw bytes for kind "bin" (BIOS, bzImage, snapshot, lib) */
  bytes?: Uint8Array;
}

const loaded = new Map<string, LoadedAsset>();
const inflight = new Map<string, Promise<LoadedAsset>>();

function assetMime(asset: Asset) {
  if (asset.kind === "wasm" || asset.file.endsWith(".wasm")) return "application/wasm";
  if (asset.file.endsWith(".mjs") || asset.file.endsWith(".js")) return "text/javascript";
  if (asset.kind === "fs") return "application/gzip";
  return "application/octet-stream";
}

function cacheKey(asset: Asset) {
  return `${WASM_BASE}${asset.file}?v=${asset.sha256.slice(0, 12)}`;
}

function cacheAvailable() {
  return typeof caches !== "undefined";
}

export async function isCached(asset: Asset): Promise<boolean> {
  if (!cacheAvailable()) return false;
  try {
    const cache = await caches.open(CACHE_NAME);
    return !!(await cache.match(cacheKey(asset)));
  } catch {
    return false;
  }
}

/** Remove cache entries that are not in the current manifest. */
export async function pruneCache(assets: Asset[]) {
  if (!cacheAvailable()) return;
  const keep = new Set(assets.map((a) => new URL(cacheKey(a), location.href).href));
  const cache = await caches.open(CACHE_NAME);
  for (const req of await cache.keys()) if (!keep.has(req.url)) await cache.delete(req);
}

export async function clearCache() {
  loaded.forEach((a) => a.url && URL.revokeObjectURL(a.url));
  loaded.clear();
  if (cacheAvailable()) await caches.delete(CACHE_NAME);
}

export async function cacheUsage(): Promise<number> {
  if (!cacheAvailable()) return 0;
  const cache = await caches.open(CACHE_NAME);
  let total = 0;
  for (const req of await cache.keys()) {
    const res = await cache.match(req);
    const len = Number(res?.headers.get("x-size") ?? 0);
    total += len;
  }
  return total;
}

async function download(asset: Asset, onProgress: Progress, signal?: AbortSignal): Promise<Uint8Array> {
  const res = await fetch(`${WASM_BASE}${asset.file}`, { signal });
  if (!res.ok) throw new Error(t("downloadHttp", { file: asset.file, status: res.status }));
  const total = asset.size || Number(res.headers.get("content-length") ?? 0);
  if (!res.body) {
    const buf = new Uint8Array(await res.arrayBuffer());
    onProgress(buf.byteLength, total);
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
    onProgress(Math.min(received, total), total);
  }
  const out = new Uint8Array(received);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  // .tar.gz may be transparently decoded when served with Content-Encoding: gzip,
  // so only enforce the exact size for wasm binaries.
  if ((asset.kind === "wasm" || asset.kind === "bin") && asset.size && out.byteLength !== asset.size) {
    throw new Error(t("sizeMismatch", { file: asset.file, expected: asset.size, actual: out.byteLength }));
  }
  return out;
}

async function fetchBytes(asset: Asset, onProgress: Progress, signal?: AbortSignal): Promise<Uint8Array> {
  const key = cacheKey(asset);
  if (cacheAvailable()) {
    try {
      const cache = await caches.open(CACHE_NAME);
      const hit = await cache.match(key);
      if (hit) {
        const buf = new Uint8Array(await hit.arrayBuffer());
        onProgress(buf.byteLength, buf.byteLength);
        return buf;
      }
    } catch {
      /* ignore cache errors */
    }
  }
  const bytes = await download(asset, onProgress, signal);
  if (cacheAvailable()) {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(
        key,
        new Response(new Blob([bytes]), {
          headers: { "content-type": assetMime(asset), "x-size": String(bytes.byteLength) },
        }),
      );
    } catch (e) {
      console.warn("[SimpleCode] cache write failed, using in-memory only", e);
    }
  }
  return bytes;
}

export function getLoaded(id: string) {
  return loaded.get(id);
}

export function ensureAsset(id: string, asset: Asset, onProgress: Progress, signal?: AbortSignal): Promise<LoadedAsset> {
  const done = loaded.get(id);
  if (done) {
    onProgress(asset.size, asset.size);
    return Promise.resolve(done);
  }
  let p = inflight.get(id);
  if (!p) {
    p = (async () => {
      const bytes = await fetchBytes(asset, onProgress, signal);
      const result: LoadedAsset =
        asset.kind === "wasm"
          ? { id, url: URL.createObjectURL(new Blob([bytes], { type: "application/wasm" })) }
          : asset.kind === "bin"
            ? { id, bytes, url: URL.createObjectURL(new Blob([bytes], { type: assetMime(asset) })) }
            : { id, fs: extractTarGz(bytes) };
      loaded.set(id, result);
      return result;
    })().finally(() => inflight.delete(id));
    inflight.set(id, p);
  }
  return p;
}
