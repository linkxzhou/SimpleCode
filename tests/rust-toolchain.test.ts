import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fetchRustAsset } from "../src/rustc/fallback.ts";

const SHA = "41412081eefc3e08ec5664ed0748902a7e575e1f267898dcc64d412702df7e83";
const LOCAL = "/wasm/rust/rustc.wasm";

function responseFor(body: Uint8Array | string, status: number, contentType: string) {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

describe("fetchRustAsset", () => {
  it("loads the same-origin file once", async () => {
    const good = new Uint8Array([9, 8, 7, 6]);
    const calls: string[] = [];
    const deltas: number[] = [];
    const bytes = await fetchRustAsset({
      kind: "rustc",
      url: LOCAL,
      version: SHA,
      bytes: good.byteLength,
      sha256: SHA,
      hash: async () => SHA,
      onBytes: (n) => deltas.push(n),
      fetchImpl: (async (input: RequestInfo | URL) => {
        calls.push(String(input));
        return responseFor(good, 200, "application/wasm");
      }) as typeof fetch,
    });
    assert.deepEqual(bytes, good);
    assert.deepEqual(calls, [`${LOCAL}?v=${SHA.slice(0, 12)}`]);
    assert.equal(deltas.reduce((n, d) => n + d, 0), good.byteLength);
  });

  it("reports a missing local file after one reload and does not try another host", async () => {
    const calls: string[] = [];
    await assert.rejects(
      () =>
        fetchRustAsset({
          kind: "rustc",
          url: LOCAL,
          version: SHA,
          bytes: 4,
          sha256: SHA,
          fetchImpl: (async (input: RequestInfo | URL) => {
            calls.push(String(input));
            return responseFor("missing", 404, "text/plain");
          }) as typeof fetch,
        }),
      (err: unknown) => {
        const message = (err as Error).message;
        return message.includes(LOCAL) && message.includes("wasm/rust");
      },
    );
    assert.deepEqual(calls, [`${LOCAL}?v=${SHA.slice(0, 12)}`, `${LOCAL}?v=${SHA.slice(0, 12)}`]);
  });

  it("does not issue another request when the caller aborts", async () => {
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
            url: LOCAL,
            version: SHA,
            bytes: 4,
            sha256: SHA,
            signal: ctrl.signal,
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
