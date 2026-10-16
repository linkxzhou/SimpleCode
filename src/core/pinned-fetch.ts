// Same-origin pinned downloads. A missing /wasm file must not be cached as the SPA
// index.html: that 200 used to stick for a day and then fail the sha256 check.

export type CacheMode = "no-cache" | "reload";

export class PinnedMissing extends Error {
  readonly reason: string;
  constructor(reason: string) {
    super(reason);
    this.name = "PinnedMissing";
    this.reason = reason;
  }
}

export class PinnedMismatch extends Error {
  readonly got: number;
  readonly expected: number;
  readonly sha256: string;
  constructor(got: number, expected: number, sha256 = "") {
    super(`size ${got} != ${expected}`);
    this.name = "PinnedMismatch";
    this.got = got;
    this.expected = expected;
    this.sha256 = sha256;
  }
}

export function versionedUrl(url: string, version: string | undefined): string {
  if (!version) return url;
  const v = version.slice(0, 12);
  const hash = url.indexOf("#");
  const base = hash >= 0 ? url.slice(0, hash) : url;
  const frag = hash >= 0 ? url.slice(hash) : "";
  if (/[?&]v=/.test(base)) return base.replace(/([?&])v=[^&#]*/, `$1v=${v}`) + frag;
  return `${base}${base.includes("?") ? "&" : "?"}v=${v}${frag}`;
}

export function contentTypeIsHtml(contentType: string | null): boolean {
  return /text\/html/i.test(contentType ?? "");
}

export function bodyLooksLikeHtml(bytes: Uint8Array): boolean {
  let i = 0;
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) i = 3;
  const n = Math.min(bytes.length, i + 64);
  while (i < n && (bytes[i] === 9 || bytes[i] === 10 || bytes[i] === 13 || bytes[i] === 32)) i++;
  let head = "";
  const end = Math.min(bytes.length, i + 15);
  for (let j = i; j < end; j++) {
    const b = bytes[j];
    if (b > 127) return false;
    head += String.fromCharCode(b);
  }
  const lower = head.toLowerCase();
  return lower.startsWith("<!doctype") || lower.startsWith("<html");
}

export function hasWasmMagic(bytes: Uint8Array): boolean {
  return bytes.length >= 4 && bytes[0] === 0x00 && bytes[1] === 0x61 && bytes[2] === 0x73 && bytes[3] === 0x6d;
}

export function classifyPinned(opts: {
  status: number;
  contentType: string | null;
  bytes: Uint8Array;
  expectBytes?: number;
  sha256?: string;
  expectedSha256?: string;
  wasm?: boolean;
}): "ok" | "missing" | "mismatch" {
  if (opts.status < 200 || opts.status >= 300) return "missing";
  if (contentTypeIsHtml(opts.contentType) || bodyLooksLikeHtml(opts.bytes)) return "missing";
  if (opts.wasm && !hasWasmMagic(opts.bytes)) return "mismatch";
  if (opts.expectBytes !== undefined && opts.bytes.byteLength !== opts.expectBytes) return "mismatch";
  if (opts.expectedSha256 !== undefined && opts.sha256 !== undefined && opts.sha256 !== opts.expectedSha256) return "mismatch";
  return "ok";
}

export interface FetchPinnedOptions {
  url: string;
  /** Full sha256. The request URL gets `?v=` plus the first 12 hex characters. */
  version?: string;
  expectBytes?: number;
  expectedSha256?: string;
  wasm?: boolean;
  signal?: AbortSignal;
  /** Byte deltas. A failed attempt is rolled back with a negative count. */
  onBytes?: (n: number) => void;
  fetchImpl?: typeof fetch;
  hash?: (bytes: Uint8Array) => Promise<string>;
}

async function readBody(res: Response, onBytes?: (n: number) => void): Promise<{ bytes: Uint8Array; counted: number }> {
  if (!res.body) {
    const bytes = new Uint8Array(await res.arrayBuffer());
    onBytes?.(bytes.byteLength);
    return { bytes, counted: bytes.byteLength };
  }
  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value?.byteLength) continue;
    // Copy now. A later read may reuse this view's buffer, and Buffer#slice shares memory.
    const copy = new Uint8Array(value);
    chunks.push(copy);
    received += copy.byteLength;
    onBytes?.(copy.byteLength);
  }
  const bytes = new Uint8Array(received);
  let off = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, off);
    off += chunk.byteLength;
  }
  return { bytes, counted: received };
}

/**
 * Fetch a pinned file. The first try revalidates (`no-cache`). A missing file
 * (non-OK, HTML, or `<!doctype`), an empty or short body, or a size/hash
 * mismatch retries once with `reload`. DevTools "0 kB transferred" is often a
 * memory-cache or service-worker hit; a body that is actually empty fails here
 * with got/expected sizes instead of being treated as success.
 */
export async function fetchPinned(opts: FetchPinnedOptions): Promise<Uint8Array> {
  const fetchImpl = opts.fetchImpl ?? fetch;
  const url = versionedUrl(opts.url, opts.version);
  const modes: CacheMode[] = ["no-cache", "reload"];
  let lastBytes = new Uint8Array();
  let lastVerdict: "missing" | "mismatch" = "missing";
  let lastReason = "HTTP 0";
  let networkError: unknown;
  for (const cache of modes) {
    let counted = 0;
    try {
      const res = await fetchImpl(url, { cache, signal: opts.signal });
      const { bytes, counted: n } = await readBody(res, (delta) => {
        counted += delta;
        opts.onBytes?.(delta);
      });
      void n;
      let verdict = classifyPinned({
        status: res.status,
        contentType: res.headers.get("content-type"),
        bytes,
        expectBytes: opts.expectBytes,
        wasm: opts.wasm,
      });
      if (verdict === "ok" && opts.expectedSha256 !== undefined) {
        const digest = await (opts.hash ?? sha256Hex)(bytes);
        if (digest !== opts.expectedSha256) verdict = "mismatch";
      }
      if (verdict === "ok") return bytes;
      if (counted) opts.onBytes?.(-counted);
      lastBytes = bytes;
      lastVerdict = verdict;
      lastReason = verdict === "missing" ? (res.ok ? "html" : `HTTP ${res.status}`) : "mismatch";
      networkError = undefined;
    } catch (e) {
      if (counted) opts.onBytes?.(-counted);
      if ((e as Error).name === "AbortError" || opts.signal?.aborted) throw e;
      networkError = e;
    }
  }
  if (networkError && lastReason === "HTTP 0") throw networkError;
  if (lastVerdict === "missing") throw new PinnedMissing(lastReason);
  const sha256 = await (opts.hash ?? sha256Hex)(lastBytes);
  throw new PinnedMismatch(lastBytes.byteLength, opts.expectBytes ?? 0, sha256);
}

export async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
