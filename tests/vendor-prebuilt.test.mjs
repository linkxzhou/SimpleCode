import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import {
  buildTar,
  extractPrebuilt,
  gzipDeterministic,
  javaFiles,
  packPrebuilt,
  runtimeFiles,
  runVendor,
  sha256Buffer,
  splitBuffer,
} from "../scripts/vendor-prebuilt.mjs";

function tree() {
  const root = mkdtempSync(join(tmpdir(), "simplecode-prebuilt-"));
  const wasm = join(root, "wasm");
  mkdirSync(join(wasm, "java"), { recursive: true });
  writeFileSync(join(wasm, "a.wasm"), Buffer.from([0x00, 0x61, 0x73, 0x6d, 0x61]));
  writeFileSync(join(wasm, "b.tar.gz"), Buffer.from([0x1f, 0x8b, 0x62]));
  writeFileSync(join(wasm, "java/compiler.wasm"), Buffer.from("java-bytes"));
  return root;
}

describe("prebuilt vendor archives", () => {
  it("builds a deterministic ustar gzip and splits it", () => {
    const first = gzipDeterministic(buildTar([
      { name: "b.tar.gz", data: Buffer.from("beta") },
      { name: "a.wasm", data: Buffer.from("alpha") },
    ]));
    const second = gzipDeterministic(buildTar([
      { name: "a.wasm", data: Buffer.from("alpha") },
      { name: "b.tar.gz", data: Buffer.from("beta") },
    ]));
    assert.equal(sha256Buffer(first), sha256Buffer(second));
    const parts = splitBuffer(first, 40);
    assert.ok(parts.length > 1);
    assert.equal(sha256Buffer(Buffer.concat(parts)), sha256Buffer(first));
    const listed = spawnSync("tar", ["-tzf", "-"], { input: first, encoding: "utf8" });
    assert.equal(listed.status, 0);
    assert.deepEqual(listed.stdout.trim().split("\n"), ["a.wasm", "b.tar.gz"]);
  });

  it("packs, checks sha256, and extracts the same bytes", () => {
    const root = tree();
    const out = join(root, "prebuilt");
    const wasm = join(root, "wasm");
    const packed = packPrebuilt({
      wasmDir: wasm,
      outDir: out,
      groups: { runtime: ["b.tar.gz", "a.wasm"], java: ["java/compiler.wasm"] },
      partBytes: 80,
      version: 1,
      host: "linux-x86_64",
    });
    const again = packPrebuilt({
      wasmDir: wasm,
      outDir: join(root, "prebuilt-2"),
      groups: { runtime: ["a.wasm", "b.tar.gz"], java: ["java/compiler.wasm"] },
      partBytes: 80,
      version: 1,
      host: "linux-x86_64",
    });
    assert.deepEqual(
      packed.groups.runtime.archives.map((archive) => archive.sha256),
      again.groups.runtime.archives.map((archive) => archive.sha256),
    );
    assert.ok(packed.groups.runtime.archives.length > 1);
    for (const archive of packed.groups.runtime.archives) {
      assert.ok(archive.bytes <= 80);
      assert.equal(archive.name.startsWith("wasm-vendor-1.tar.gz.part-"), true);
    }
    rmSync(wasm, { recursive: true, force: true });
    mkdirSync(wasm);
    extractPrebuilt({ wasmDir: wasm, prebuiltDir: out, group: "runtime", index: packed });
    extractPrebuilt({ wasmDir: wasm, prebuiltDir: out, group: "java", index: packed });
    const original = tree();
    assert.equal(readFileSync(join(wasm, "a.wasm")).equals(readFileSync(join(original, "wasm/a.wasm"))), true);
    assert.equal(readFileSync(join(wasm, "b.tar.gz")).equals(readFileSync(join(original, "wasm/b.tar.gz"))), true);
    assert.equal(readFileSync(join(wasm, "java/compiler.wasm")).toString(), "java-bytes");
    rmSync(root, { recursive: true, force: true });
    rmSync(original, { recursive: true, force: true });
  });

  it("refuses an archive whose sha256 does not match the index", () => {
    const root = tree();
    const out = join(root, "prebuilt");
    const index = packPrebuilt({
      wasmDir: join(root, "wasm"),
      outDir: out,
      groups: { runtime: ["a.wasm"], java: ["java/compiler.wasm"] },
      partBytes: 1024 * 1024,
      version: 1,
      host: "linux-x86_64",
    });
    const name = index.groups.runtime.archives[0].name;
    const path = join(out, name);
    const buf = readFileSync(path);
    buf[buf.length - 1] ^= 0xff;
    writeFileSync(path, buf);
    assert.throws(
      () => extractPrebuilt({ wasmDir: join(root, "wasm"), prebuiltDir: out, group: "runtime", index }),
      /sha256/,
    );
    rmSync(root, { recursive: true, force: true });
  });

  it("uses fresh outputs only when the vendor command exits 0", () => {
    const logs = [];
    const log = {
      log(line) { logs.push(line); },
      error(line) { logs.push(line); },
    };
    let extracted = 0;
    assert.equal(runVendor({ label: "./build.sh vendor", status: 0, extract: () => extracted++, log }), "fresh");
    assert.equal(extracted, 0);
    assert.match(logs.join("\n"), /fresh outputs/);
    logs.length = 0;
    assert.equal(runVendor({
      label: "./build.sh vendor",
      force: "SIMPLECODE_VENDOR_FORCE_FAIL=1",
      status: 0,
      extract: () => extracted++,
      log,
    }), "prebuilt");
    assert.equal(extracted, 1);
    assert.match(logs.join("\n"), /extracting committed prebuilt/);
  });

  it("committed archives match SHA256SUMS and extract to the indexed files", () => {
    const prebuiltDir = "vendor/prebuilt";
    const index = JSON.parse(readFileSync(join(prebuiltDir, "index.json"), "utf8"));
    assert.equal(index.version, 1);
    assert.equal(index.host, "linux-x86_64");
    assert.deepEqual(index.groups.runtime.files.map((file) => file.path), runtimeFiles());
    assert.deepEqual(index.groups.java.files.map((file) => file.path), javaFiles());
    for (const group of Object.values(index.groups)) {
      for (const archive of group.archives) assert.ok(archive.bytes < 90 * 1000 * 1000);
    }
    const check = spawnSync("sha256sum", ["-c", "SHA256SUMS"], { cwd: prebuiltDir, encoding: "utf8" });
    assert.equal(check.status, 0, check.stdout + check.stderr);
    const root = mkdtempSync(join(tmpdir(), "simplecode-prebuilt-real-"));
    const wasmDir = join(root, "wasm");
    mkdirSync(wasmDir);
    extractPrebuilt({ wasmDir, prebuiltDir, group: "runtime", index });
    extractPrebuilt({ wasmDir, prebuiltDir, group: "java", index });
    const manifest = JSON.parse(readFileSync(join(wasmDir, "manifest.json"), "utf8"));
    assert.equal(Object.keys(manifest.assets).length, runtimeFiles().length);
    assert.equal(existsSync(join(wasmDir, "java/compiler.wasm")), true);
    rmSync(root, { recursive: true, force: true });
  });
});
