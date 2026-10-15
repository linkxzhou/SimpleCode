// Fingerprint wasm/ from the files on disk and write wasm/manifest.json.
// Invoked as `node scripts/write-manifest.mjs` and imported by Vite. No shebang:
// esbuild bundles this module into the Vite config and rejects a mid-stream #!.
// The manifest is generated, not committed: Lua's wasm is not byte-stable on
// Apple Silicon, so a Linux digest checked in beside a local binary fails the
// size check at download time.
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assets, languages } from "./languages.config.mjs";

const WASM_MAGIC = Buffer.from([0x00, 0x61, 0x73, 0x6d]);

export function fingerprint(fileName, buf) {
  const isWasm = fileName.endsWith(".wasm");
  const magicOk = isWasm ? buf.subarray(0, 4).equals(WASM_MAGIC) : buf[0] === 0x1f && buf[1] === 0x8b;
  if (!magicOk) {
    const err = new Error(`${fileName}: bad magic header (Git LFS pointer?)`);
    err.code = "BAD_MAGIC";
    throw err;
  }
  return {
    file: fileName,
    size: buf.length,
    sha256: createHash("sha256").update(buf).digest("hex"),
    kind: isWasm ? "wasm" : "fs",
  };
}

export function renderManifest(assetRecords, { generatedAt = new Date().toISOString(), source = "wasm/ files on disk" } = {}) {
  return {
    version: 1,
    generatedAt,
    source,
    assets: assetRecords,
    languages,
  };
}

/** Read every configured asset and return the manifest object. Does not write. */
export function manifestFromDir(wasmDir) {
  const records = {};
  const missing = [];
  for (const [id, spec] of Object.entries(assets)) {
    const path = join(wasmDir, spec.file);
    if (!existsSync(path)) {
      missing.push(spec.file);
      continue;
    }
    records[id] = fingerprint(spec.file, readFileSync(path));
  }
  if (missing.length) {
    const err = new Error(`缺少 ${missing.join(", ")}。请先运行 ./build.sh vendor`);
    err.code = "MISSING_WASM";
    throw err;
  }
  return renderManifest(records);
}

export function refreshManifest(root) {
  const wasmDir = join(root, "wasm");
  const manifest = manifestFromDir(wasmDir);
  writeFileSync(join(wasmDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
  return manifest;
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  try {
    const manifest = refreshManifest(root);
    const n = Object.keys(manifest.assets).length;
    console.log(`✓ wrote wasm/manifest.json from ${n} files on disk`);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exit(err.code === "MISSING_WASM" ? 2 : 1);
  }
}
