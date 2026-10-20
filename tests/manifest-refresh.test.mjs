import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { assets } from "../scripts/languages.config.mjs";
import { fingerprint, manifestFromDir, refreshManifest } from "../scripts/write-manifest.mjs";

const WASM = Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]);
const GZIP = Buffer.from([0x1f, 0x8b, 0x08, 0x00]);

function plant(dir, extra = 0) {
  mkdirSync(dir, { recursive: true });
  for (const spec of Object.values(assets)) {
    mkdirSync(dirname(join(dir, spec.file)), { recursive: true });
    const head = spec.kind === "bin" ? Buffer.from([0x7f]) : spec.file.endsWith(".wasm") ? WASM : GZIP;
    const body = Buffer.alloc(extra + spec.file.length, spec.file.charCodeAt(0));
    writeFileSync(join(dir, spec.file), Buffer.concat([head, body]));
  }
}

describe("manifest refresh", () => {
  it("fingerprints the bytes that will be served", () => {
    const buf = Buffer.concat([WASM, Buffer.from("lua-local")]);
    const record = fingerprint("lua-5.4.9.wasm", buf);
    assert.equal(record.size, buf.length);
    assert.equal(record.kind, "wasm");
    assert.equal(record.sha256, createHash("sha256").update(buf).digest("hex"));
  });

  it("rewrites a stale manifest so size matches the file on disk", () => {
    const root = mkdtempSync(join(tmpdir(), "simplecode-manifest-"));
    const wasmDir = join(root, "wasm");
    plant(wasmDir, 17);
    writeFileSync(
      join(wasmDir, "manifest.json"),
      JSON.stringify({ version: 1, assets: { "lua-wasm": { file: "lua-5.4.9.wasm", size: 720144, sha256: "deadbeef", kind: "wasm" } } }) + "\n",
    );
    const manifest = refreshManifest(root);
    const lua = manifest.assets["lua-wasm"];
    const bytes = readFileSync(join(wasmDir, "lua-5.4.9.wasm"));
    assert.equal(lua.size, bytes.length);
    assert.notEqual(lua.size, 720144);
    assert.equal(lua.sha256, createHash("sha256").update(bytes).digest("hex"));
    const written = JSON.parse(readFileSync(join(wasmDir, "manifest.json"), "utf8"));
    assert.equal(written.assets["lua-wasm"].size, bytes.length);
    assert.equal(Object.keys(written.assets).length, Object.keys(assets).length);
    rmSync(root, { recursive: true, force: true });
  });

  it("accepts raw guest files that are neither wasm nor gzip", () => {
    const buf = Buffer.from("bios-bytes");
    const record = fingerprint("seabios.bin", buf, "bin");
    assert.equal(record.kind, "bin");
    assert.equal(record.size, buf.length);
    assert.equal(record.sha256, createHash("sha256").update(buf).digest("hex"));
  });

  it("refuses to describe a file with a bad header", () => {
    assert.throws(() => fingerprint("lua-5.4.9.wasm", Buffer.from("not wasm")), /bad magic/);
  });

  it("reports missing assets instead of keeping an old manifest", () => {
    const root = mkdtempSync(join(tmpdir(), "simplecode-manifest-"));
    mkdirSync(join(root, "wasm"), { recursive: true });
    assert.throws(() => manifestFromDir(join(root, "wasm")), (err) => err.code === "MISSING_WASM");
    rmSync(root, { recursive: true, force: true });
  });

  it("is not a tracked file, so pull cannot restore a foreign digest", () => {
    const ignore = readFileSync(".gitignore", "utf8");
    assert.match(ignore, /^wasm\/\*$/m);
    assert.doesNotMatch(ignore, /!wasm\/manifest\.json/);
    assert.match(ignore, /!wasm\/rust\/rustc\.wasm/);
    const listed = spawnSync("git", ["ls-files", "--", "wasm/manifest.json"], { encoding: "utf8" });
    assert.equal(listed.status, 0);
    assert.equal(listed.stdout.trim(), "");
    const check = spawnSync("git", ["check-ignore", "-q", "wasm/manifest.json"]);
    assert.equal(check.status, 0);
    const rustc = spawnSync("git", ["check-ignore", "-q", "wasm/rust/rustc.wasm"]);
    assert.notEqual(rustc.status, 0);
    const bundle = spawnSync("git", ["check-ignore", "-q", "wasm/rust/sysroot-wasip1.bundle"]);
    assert.notEqual(bundle.status, 0);
    const other = spawnSync("git", ["check-ignore", "-q", "wasm/python-3.11.3.wasm"]);
    assert.equal(other.status, 0);
  });
});
