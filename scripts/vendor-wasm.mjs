#!/usr/bin/env node
// Copy language binaries from thirdparty/runno/langs into wasm/ and generate wasm/manifest.json
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync, statSync, symlinkSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assets, languages } from "./languages.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const srcArg = args.indexOf("--source");
const src = srcArg >= 0 ? resolve(args[srcArg + 1]) : join(root, "thirdparty/runno/langs");
const useLink = args.includes("--link");
const out = join(root, "wasm");
mkdirSync(out, { recursive: true });

const manifestAssets = {};
for (const [id, file] of Object.entries(assets)) {
  const from = join(src, file);
  if (!existsSync(from)) {
    console.error(`✗ missing ${from}`);
    process.exit(1);
  }
  const buf = readFileSync(from);
  const isWasm = file.endsWith(".wasm");
  const magicOk = isWasm
    ? buf.subarray(0, 4).equals(Buffer.from([0, 0x61, 0x73, 0x6d]))
    : buf[0] === 0x1f && buf[1] === 0x8b;
  if (!magicOk) {
    console.error(`✗ ${file}: bad magic header (Git LFS pointer?)`);
    process.exit(1);
  }
  const to = join(out, file);
  rmSync(to, { force: true });
  if (useLink) symlinkSync(from, to);
  else copyFileSync(from, to);
  const sha256 = createHash("sha256").update(buf).digest("hex");
  manifestAssets[id] = { file, size: statSync(from).size, sha256, kind: isWasm ? "wasm" : "fs" };
  console.log(`✓ ${file.padEnd(24)} ${(buf.length / 1048576).toFixed(1).padStart(6)} MB  ${sha256.slice(0, 12)}`);
}

const manifest = {
  version: 1,
  generatedAt: new Date().toISOString(),
  source: "thirdparty/runno/langs",
  assets: manifestAssets,
  languages,
};
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(`✓ wrote wasm/manifest.json (${languages.length} languages)`);
