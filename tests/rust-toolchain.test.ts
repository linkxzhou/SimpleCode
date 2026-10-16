import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchRustAsset } from "../src/rustc/fallback.ts";

const SHA = "41412081eefc3e08ec5664ed0748902a7e575e1f267898dcc64d412702df7e83";
const LOCAL = "/wasm/rust/rustc.wasm";
const UPSTREAM = "https://weblings.forest-anderson.ca/rustc/rustc.wasm";

function responseFor(body: Uint8Array | string, status: number, contentType: string) {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

function attempts() {
  return [
    { url: LOCAL, version: SHA },
    { url: UPSTREAM },
  ];
}

describe("fetchRustAsset", () => {
  it("falls back to upstream after a single local 404", async () => {
    const good = new Uint8Array([9, 8, 7, 6]);
    const calls: string[] = [];
    const deltas: number[] = [];
    const bytes = await fetchRustAsset({
      kind: "rustc",
      attempts: attempts(),
      bytes: good.byteLength,
      sha256: SHA,
      upstream: UPSTREAM,
      hash: async () => SHA,
      onBytes: (n) => deltas.push(n),
      fetchImpl: (async (input: RequestInfo | URL) => {
        const url = String(input);
        calls.push(url);
        if (url.startsWith(UPSTREAM)) return responseFor(good, 200, "application/octet-stream");
        return responseFor("missing", 404, "text/plain");
      }) as typeof fetch,
    });
    assert.deepEqual(bytes, good);
    assert.deepEqual(
      calls,
      [`${LOCAL}?v=${SHA.slice(0, 12)}`, UPSTREAM],
    );
    assert.equal(deltas.reduce((n, d) => n + d, 0), good.byteLength);
  });

  it("tries upstream once when a live signal still sees AbortError", async () => {
    const good = new Uint8Array([1, 2, 3, 4]);
    const calls: string[] = [];
    const ctrl = new AbortController();
    const bytes = await fetchRustAsset({
      kind: "rustc",
      attempts: attempts(),
      bytes: good.byteLength,
      sha256: SHA,
      signal: ctrl.signal,
      upstream: UPSTREAM,
      hash: async () => SHA,
      fetchImpl: (async (input: RequestInfo | URL) => {
        const url = String(input);
        calls.push(url);
        if (url.startsWith(UPSTREAM)) return responseFor(good, 200, "application/octet-stream");
        const aborted = new Error("signal is aborted without reason");
        aborted.name = "AbortError";
        throw aborted;
      }) as typeof fetch,
    });
    assert.equal(ctrl.signal.aborted, false);
    assert.deepEqual(bytes, good);
    assert.deepEqual(calls, [`${LOCAL}?v=${SHA.slice(0, 12)}`, UPSTREAM]);
  });

  it("does not request upstream when the caller aborts", async () => {
    const unhandled: unknown[] = [];
    const onUnhandled = (err: unknown) => unhandled.push(err);
    process.on("unhandledRejection", onUnhandled);
    const ctrl = new AbortController();
    const calls: string[] = [];
    try {
      await assert.rejects(
        () =>
          fetchRustAsset({
            kind: "bundle",
            attempts: attempts(),
            bytes: 4,
            sha256: SHA,
            signal: ctrl.signal,
            upstream: UPSTREAM,
            fetchImpl: (async (input: RequestInfo | URL) => {
              calls.push(String(input));
              ctrl.abort();
              const aborted = new Error("signal is aborted without reason");
              aborted.name = "AbortError";
              throw aborted;
            }) as typeof fetch,
          }),
        (err: unknown) => (err as Error).name === "AbortError",
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
      assert.deepEqual(calls, [`${LOCAL}?v=${SHA.slice(0, 12)}`]);
      assert.equal(unhandled.length, 0);
    } finally {
      process.off("unhandledRejection", onUnhandled);
    }
  });
});
