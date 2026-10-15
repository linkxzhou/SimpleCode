#!/usr/bin/env node
// Copy Runno language binaries into wasm/ and build Lua/Go, then write wasm/manifest.json.
import { copyFileSync, existsSync, mkdirSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { assets } from "./languages.config.mjs";
import { refreshManifest } from "./write-manifest.mjs";

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

for (const spec of Object.values(assets)) {
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
}

let manifest;
try {
  manifest = refreshManifest(root);
} catch (err) {
  fail(err.message);
}
for (const asset of Object.values(manifest.assets)) {
  console.log(`✓ ${asset.file.padEnd(24)} ${(asset.size / 1048576).toFixed(1).padStart(6)} MB  ${asset.sha256.slice(0, 12)}`);
}
console.log(`✓ wrote wasm/manifest.json from files on disk (${Object.keys(manifest.assets).length} assets)`);
