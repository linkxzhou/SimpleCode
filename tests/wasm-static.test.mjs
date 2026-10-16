import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { resolveWasmFile, wasmPathname } from "../scripts/wasm-static.mjs";

describe("wasm static paths", () => {
  it("recognizes /wasm paths and ignores other routes", () => {
    assert.equal(wasmPathname("/wasm/java/compiler.wasm?v=7f3828e4b7bd"), "/wasm/java/compiler.wasm");
    assert.equal(wasmPathname("/assets/index.js"), null);
    assert.equal(wasmPathname("/wasm/%2e%2e/secret"), "/wasm/../secret");
  });

  it("resolves a real file and rejects missing or escaping paths", () => {
    const root = mkdtempSync(join(tmpdir(), "wasm-static-"));
    mkdirSync(join(root, "java"));
    writeFileSync(join(root, "java/compiler.wasm"), "wasm");
    assert.equal(resolveWasmFile(root, "/wasm/java/compiler.wasm?v=abc"), join(root, "java/compiler.wasm"));
    assert.equal(resolveWasmFile(root, "/java/compiler.wasm"), join(root, "java/compiler.wasm"));
    assert.equal(resolveWasmFile(root, "/wasm/java/missing.wasm"), null);
    assert.equal(resolveWasmFile(root, "/wasm/../etc/passwd"), null);
    assert.equal(resolveWasmFile(root, "/wasm/%2e%2e/secret"), null);
    assert.equal(resolveWasmFile(root, "/wasm/"), null);
    assert.equal(resolveWasmFile(root, "/"), null);
  });
});
