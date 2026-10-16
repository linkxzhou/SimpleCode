import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  PinnedMismatch,
  PinnedMissing,
  bodyLooksLikeHtml,
  classifyPinned,
  contentTypeIsHtml,
  fetchPinned,
  hasWasmMagic,
  sha256Hex,
  versionedUrl,
} from "../src/core/pinned-fetch.ts";

const SHA = "7f3828e4b7bddf5504dadebfc4016e40f4441e15ee0519071781813ba2ed3a4c";

function wasmBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);
  bytes.set([0x00, 0x61, 0x73, 0x6d]);
  return bytes;
}

function responseFor(body: string | Uint8Array, status = 200, contentType = "application/octet-stream"): Response {
  return new Response(body, { status, headers: { "content-type": contentType } });
}

describe("versionedUrl", () => {
  it("appends a 12-character sha256 prefix", () => {
    assert.equal(versionedUrl("/wasm/java/compiler.wasm", SHA), "/wasm/java/compiler.wasm?v=7f3828e4b7bd");
    assert.equal(versionedUrl("/wasm/a.bin?x=1", SHA), "/wasm/a.bin?x=1&v=7f3828e4b7bd");
    assert.equal(versionedUrl("/wasm/a.wasm?v=old&x=1#h", SHA), "/wasm/a.wasm?v=7f3828e4b7bd&x=1#h");
    assert.equal(versionedUrl("/wasm/a.wasm", undefined), "/wasm/a.wasm");
  });
});

describe("classifyPinned", () => {
  it("treats HTTP errors, HTML content types, and doctype bytes as missing", () => {
    const html = new TextEncoder().encode("<!DOCTYPE html><html></html>");
    assert.equal(contentTypeIsHtml("text/html; charset=utf-8"), true);
    assert.equal(bodyLooksLikeHtml(html), true);
    assert.equal(bodyLooksLikeHtml(new Uint8Array([0xef, 0xbb, 0xbf, 0x3c, 0x68, 0x74, 0x6d, 0x6c])), true);
    assert.equal(classifyPinned({ status: 404, contentType: "text/plain", bytes: new Uint8Array() }), "missing");
    assert.equal(
      classifyPinned({ status: 200, contentType: "text/html", bytes: html, expectBytes: 4294850, wasm: true }),
      "missing",
    );
    assert.equal(
      classifyPinned({ status: 200, contentType: "application/wasm", bytes: html, expectBytes: 4, wasm: true }),
      "missing",
    );
  });

  it("keeps a real size or magic mismatch distinct from a missing file", () => {
    const bytes = wasmBytes(8);
    assert.equal(hasWasmMagic(bytes), true);
    assert.equal(
      classifyPinned({ status: 200, contentType: "application/wasm", bytes, expectBytes: 16, wasm: true }),
      "mismatch",
    );
    const junk = new TextEncoder().encode("not wasm");
    assert.equal(
      classifyPinned({ status: 200, contentType: "application/octet-stream", bytes: junk, expectBytes: junk.byteLength, wasm: true }),
      "mismatch",
    );
    assert.equal(
      classifyPinned({ status: 200, contentType: "application/wasm", bytes, expectBytes: 8, wasm: true, sha256: "aa", expectedSha256: "bb" }),
      "mismatch",
    );
    assert.equal(
      classifyPinned({ status: 200, contentType: "application/wasm", bytes, expectBytes: 8, wasm: true, sha256: "aa", expectedSha256: "aa" }),
      "ok",
    );
  });
});

describe("fetchPinned", () => {
  it("reloads once after a cached HTML 200 and then returns the wasm bytes", async () => {
    const good = wasmBytes(16);
    const calls: { url: string; cache?: RequestCache }[] = [];
    const queue = [
      responseFor("<!doctype html><html><body>spa</body></html>", 200, "text/html; charset=utf-8"),
      responseFor(good, 200, "application/wasm"),
    ];
    const deltas: number[] = [];
    const bytes = await fetchPinned({
      url: "/wasm/java/compiler.wasm",
      version: SHA,
      expectBytes: 16,
      expectedSha256: SHA,
      wasm: true,
      hash: async () => SHA,
      onBytes: (n) => deltas.push(n),
      fetchImpl: (async (input: RequestInfo | URL, init?: RequestInit) => {
        calls.push({ url: String(input), cache: init?.cache });
        const next = queue.shift();
        if (!next) throw new Error("no queued response");
        return next;
      }) as typeof fetch,
    });
    assert.deepEqual(bytes, good);
    assert.equal(calls.length, 2);
    assert.equal(calls[0].cache, "no-cache");
    assert.equal(calls[1].cache, "reload");
    assert.ok(calls.every((c) => c.url === "/wasm/java/compiler.wasm?v=7f3828e4b7bd"));
    assert.equal(deltas.reduce((n, d) => n + d, 0), 16);
  });

  it("fails with PinnedMissing when both attempts are the homepage", async () => {
    let calls = 0;
    await assert.rejects(
      () =>
        fetchPinned({
          url: "/wasm/java/compiler.wasm",
          version: SHA,
          expectBytes: 4294850,
          wasm: true,
          fetchImpl: (async () => {
            calls += 1;
            return responseFor("<!doctype html>", 200, "text/html");
          }) as typeof fetch,
        }),
      (err: unknown) => {
        assert.ok(err instanceof PinnedMissing);
        assert.equal(err.reason, "html");
        assert.equal(err.name, "PinnedMissing");
        assert.doesNotMatch(err.message, /!=/);
        return true;
      },
    );
    assert.equal(calls, 2);
  });

  it("reports got and expected sizes for a real wasm mismatch", async () => {
    await assert.rejects(
      () =>
        fetchPinned({
          url: "/wasm/java/compiler.wasm",
          version: SHA,
          expectBytes: 32,
          wasm: true,
          fetchImpl: (async () => responseFor(wasmBytes(8), 200, "application/wasm")) as typeof fetch,
        }),
      (err: unknown) => {
        assert.ok(err instanceof PinnedMismatch);
        assert.equal(err.got, 8);
        assert.equal(err.expected, 32);
        assert.match(err.sha256, /^[0-9a-f]{64}$/);
        return true;
      },
    );
  });

  it("retries an empty 200 and reports got, expected, and sha256", async () => {
    const caches: Array<RequestCache | undefined> = [];
    const emptySha = await sha256Hex(new Uint8Array());
    await assert.rejects(
      () =>
        fetchPinned({
          url: "/wasm/java/compiler.wasm",
          version: SHA,
          expectBytes: 4294850,
          wasm: true,
          fetchImpl: (async (_input: RequestInfo | URL, init?: RequestInit) => {
            caches.push(init?.cache);
            return responseFor(new Uint8Array(), 200, "application/wasm");
          }) as typeof fetch,
        }),
      (err: unknown) => {
        assert.ok(err instanceof PinnedMismatch);
        assert.equal(err.got, 0);
        assert.equal(err.expected, 4294850);
        assert.equal(err.sha256, emptySha);
        return true;
      },
    );
    assert.deepEqual(caches, ["no-cache", "reload"]);
  });

  it("reloads when the first body is empty and the second is the wasm file", async () => {
    const good = wasmBytes(16);
    const queue = [responseFor(new Uint8Array(), 200, "application/wasm"), responseFor(good, 200, "application/wasm")];
    const bytes = await fetchPinned({
      url: "/wasm/java/compiler.wasm",
      version: SHA,
      expectBytes: 16,
      wasm: true,
      fetchImpl: (async () => {
        const next = queue.shift();
        if (!next) throw new Error("empty queue");
        return next;
      }) as typeof fetch,
    });
    assert.deepEqual(bytes, good);
  });

  it("accepts a file when the first response is 404 and the reload is valid", async () => {
    const good = wasmBytes(4);
    const queue = [responseFor("not found\n", 404, "text/plain"), responseFor(good, 200, "application/wasm")];
    const bytes = await fetchPinned({
      url: "/wasm/a.wasm",
      version: SHA,
      expectBytes: 4,
      wasm: true,
      fetchImpl: (async () => {
        const next = queue.shift();
        if (!next) throw new Error("empty");
        return next;
      }) as typeof fetch,
    });
    assert.deepEqual(bytes, good);
  });

  it("does not retry an abort", async () => {
    let calls = 0;
    const aborted = new Error("aborted");
    aborted.name = "AbortError";
    await assert.rejects(
      () =>
        fetchPinned({
          url: "/wasm/a.wasm",
          fetchImpl: (async () => {
            calls += 1;
            throw aborted;
          }) as typeof fetch,
        }),
      (err: unknown) => err === aborted,
    );
    assert.equal(calls, 1);
  });

  it("rethrows a network failure that never received a response", async () => {
    const failure = new TypeError("network down");
    await assert.rejects(
      () =>
        fetchPinned({
          url: "/wasm/a.wasm",
          fetchImpl: (async () => {
            throw failure;
          }) as typeof fetch,
        }),
      (err: unknown) => err === failure,
    );
  });

  it("hashes with sha256 after the body checks pass", async () => {
    const bytes = wasmBytes(4);
    const digest = await sha256Hex(bytes);
    const got = await fetchPinned({
      url: "/wasm/a.wasm",
      expectBytes: 4,
      expectedSha256: digest,
      wasm: true,
      fetchImpl: (async () => responseFor(bytes, 200, "application/wasm")) as typeof fetch,
    });
    assert.deepEqual(got, bytes);
  });
});
