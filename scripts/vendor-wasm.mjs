#!/usr/bin/env node
// Copy Runno language binaries into wasm/ and build Lua/Go/Shell, then write wasm/manifest.json.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assets, languages } from "./languages.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const srcArg = args.indexOf("--source");
const src = srcArg >= 0 ? resolve(args[srcArg + 1]) : join(root, "thirdparty/runno/langs");
const useLink = args.includes("--link");
const out = join(root, "wasm");
mkdirSync(out, { recursive: true });

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function buildAsset(builder, dest) {
  const script = join(root, "scripts/builders", builder, "build.sh");
  if (!existsSync(script)) fail(`missing builder ${script}`);
  const result = spawnSync("bash", [script, dest], { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const manifestAssets = {};
for (const [id, spec] of Object.entries(assets)) {
  const to = join(out, spec.file);
  if (spec.build) buildAsset(spec.build, to);
  else {
    const from = join(src, spec.file);
    if (!existsSync(from)) fail(`missing ${from}`);
    rmSync(to, { force: true });
    if (useLink) symlinkSync(from, to);
    else copyFileSync(from, to);
  }
  if (!existsSync(to)) fail(`missing ${to}`);
  const buf = readFileSync(to);
  const isWasm = spec.file.endsWith(".wasm");
  const magicOk = isWasm
    ? buf.subarray(0, 4).equals(Buffer.from([0, 0x61, 0x73, 0x6d]))
    : buf[0] === 0x1f && buf[1] === 0x8b;
  if (!magicOk) fail(`${spec.file}: bad magic header (Git LFS pointer?)`);
  const sha256 = createHash("sha256").update(buf).digest("hex");
  manifestAssets[id] = { file: spec.file, size: buf.length, sha256, kind: isWasm ? "wasm" : "fs" };
  console.log(`✓ ${spec.file.padEnd(24)} ${(buf.length / 1048576).toFixed(1).padStart(6)} MB  ${sha256.slice(0, 12)}`);
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "thirdparty/runno/langs + scripts/builders",
  assets: manifestAssets,
  languages,
};
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ wrote wasm/manifest.json (${languages.length} languages)`);
