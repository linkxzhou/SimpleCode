// Same-origin rustc files. The toolchain is committed under wasm/rust/.
// A missing file is reported here. There is no remote host to try next.
import { fetchPinned, PinnedMismatch, PinnedMissing } from "../core/pinned-fetch.ts";
import { t } from "../i18n/index.ts";

export async function fetchRustAsset(opts: {
  kind: string;
  url: string;
  /** Full sha256. The request URL gets `?v=` plus the first 12 hex characters. */
  version?: string;
  bytes: number;
  sha256: string;
  wasm?: boolean;
  signal?: AbortSignal;
  onBytes?: (n: number) => void;
  fetchImpl?: typeof fetch;
  hash?: (bytes: Uint8Array) => Promise<string>;
}): Promise<Uint8Array> {
  try {
    return await fetchPinned({
      url: opts.url,
      version: opts.version,
      expectBytes: opts.bytes,
      expectedSha256: opts.sha256,
      wasm: opts.wasm,
      signal: opts.signal,
      onBytes: opts.onBytes,
      fetchImpl: opts.fetchImpl,
      hash: opts.hash,
    });
  } catch (e) {
    if (opts.signal?.aborted || (e as Error).name === "AbortError") throw e;
    if (e instanceof PinnedMissing) throw new Error(t("rustMissing", { kind: opts.kind, file: opts.url }));
    if (e instanceof PinnedMismatch) {
      const sha = e.sha256 || "-";
      const vars = { kind: opts.kind, expected: opts.bytes, got: e.got, sha };
      throw new Error(e.got === opts.bytes ? t("rustDigest", vars) : t("rustShort", vars));
    }
    const detail = e instanceof Error ? e.message : String(e);
    throw new Error(t("rustDownload", { detail }));
  }
}
