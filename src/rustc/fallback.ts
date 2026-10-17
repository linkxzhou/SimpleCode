// Same-origin rustc files are optional. A 404 tries the pinned upstream URL
// once. fetchPinned would otherwise reload that 404, and a body read can
// reject with AbortError even though the caller's signal is still live.
import { fetchPinned, PinnedMismatch } from "../core/pinned-fetch.ts";
import { t } from "../i18n/index.ts";

export interface RustFetchAttempt {
  url: string;
  /** Full sha256. Same-origin requests get `?v=`. Upstream stays unversioned. */
  version?: string;
}

function isAbortError(e: unknown): boolean {
  return (e as Error).name === "AbortError";
}

export async function fetchRustAsset(opts: {
  kind: string;
  attempts: RustFetchAttempt[];
  bytes: number;
  sha256: string;
  wasm?: boolean;
  signal?: AbortSignal;
  onBytes?: (n: number) => void;
  fetchImpl?: typeof fetch;
  hash?: (bytes: Uint8Array) => Promise<string>;
  upstream: string;
}): Promise<Uint8Array> {
  let last = "";
  for (const attempt of opts.attempts) {
    if (opts.signal?.aborted) throw new DOMException("The operation was aborted.", "AbortError");
    try {
      return await fetchPinned({
        url: attempt.url,
        version: attempt.version,
        expectBytes: opts.bytes,
        expectedSha256: opts.sha256,
        wasm: opts.wasm,
        signal: opts.signal,
        onBytes: opts.onBytes,
        fetchImpl: opts.fetchImpl,
        hash: opts.hash,
        // One local 404, then the next attempt. Empty and HTML bodies still reload.
        retryNotFound: false,
      });
    } catch (e) {
      // A language switch aborts the signal. A fetch that fails with
      // AbortError while that signal is still live is this URL, not the user.
      if (opts.signal?.aborted || (isAbortError(e) && !opts.signal)) throw e;
      if (e instanceof PinnedMismatch) {
        const sha = e.sha256 || "-";
        const vars = { kind: opts.kind, expected: opts.bytes, got: e.got, sha };
        last = e.got === opts.bytes ? t("rustDigest", vars) : t("rustShort", vars);
      } else {
        last = e instanceof Error ? e.message : String(e);
      }
    }
  }
  throw new Error(t("rustDownload", { detail: last, upstream: opts.upstream }));
}
