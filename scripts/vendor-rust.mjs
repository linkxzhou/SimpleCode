#!/usr/bin/env node
// Download pinned weblings artifacts, check sha256, unpack the two files the
// browser worker needs into wasm/rust/. Those files are committed. This script
// is not part of default vendor. Pass --refresh to re-download the GitHub
// archives even when wasm/rust/ already matches the lock.
import { createHash } from "node:crypto";
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { decompress } from "fzstd";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(readFileSync(join(root, "scripts/sources.lock.json"), "utf8")).rust;
const outDir = join(root, "wasm/rust");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok || !res.body) fail(`下载 ${url} 失败：HTTP ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

function extractNamed(tarBytes, baseName) {
  let offset = 0;
  while (offset + 512 <= tarBytes.length) {
    const header = tarBytes.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break;
    const name = new TextDecoder().decode(header.subarray(0, 100)).replace(/\0.*$/, "");
    const prefix = new TextDecoder().decode(header.subarray(345, 500)).replace(/\0.*$/, "");
    const full = prefix ? `${prefix}/${name}` : name;
    const size = parseInt(new TextDecoder().decode(header.subarray(124, 136)).replace(/\0.*$/, "").trim() || "0", 8);
    const typeflag = String.fromCharCode(header[156]);
    offset += 512;
    const data = tarBytes.subarray(offset, offset + size);
    offset += Math.ceil(size / 512) * 512;
    if ((typeflag === "0" || typeflag === "\0") && (full.endsWith(`/${baseName}`) || full === baseName)) {
      return new Uint8Array(data);
    }
  }
  return undefined;
}

function already(name, pin) {
  const path = join(outDir, name);
  if (!existsSync(path)) return false;
  const buf = readFileSync(path);
  return buf.length === pin.bytes && sha256(buf) === pin.sha256;
}

const refresh = process.argv.includes("--refresh");
mkdirSync(outDir, { recursive: true });
const wanted = Object.entries(lock.unpacked);
if (!refresh && wanted.every(([name, pin]) => already(name, pin))) {
  console.log("✓ wasm/rust already matches sources.lock.json");
  process.exit(0);
}

const tmp = join(root, "wasm/.rust-tmp");
mkdirSync(tmp, { recursive: true });
if (refresh) {
  for (const assetName of Object.keys(lock.assets)) rmSync(join(tmp, assetName), { force: true });
}

for (const [assetName, asset] of Object.entries(lock.assets)) {
  const dest = join(tmp, assetName);
  if (refresh || !existsSync(dest) || readFileSync(dest).length !== asset.bytes) {
    console.log(`↓ ${assetName}`);
    await download(asset.url, dest);
  }
  const compressed = readFileSync(dest);
  if (compressed.length !== asset.bytes) fail(`${assetName} 大小 ${compressed.length}，期望 ${asset.bytes}`);
  const digest = sha256(compressed);
  if (digest !== asset.sha256) fail(`${assetName} sha256 ${digest}`);
  console.log(`✓ ${assetName} ${asset.bytes} ${digest.slice(0, 12)}`);
  if (!asset.extract) continue;
  const tar = decompress(compressed);
  const file = extractNamed(tar, asset.extract);
  if (!file) fail(`${assetName} 里没有 ${asset.extract}`);
  const pin = lock.unpacked[asset.extract];
  if (!pin) fail(`lock 缺少 unpacked.${asset.extract}`);
  if (file.byteLength !== pin.bytes || sha256(file) !== pin.sha256) {
    fail(`${asset.extract} 解压后与 lock 不一致（${file.byteLength} ${sha256(file)}）`);
  }
  writeFileSync(join(outDir, asset.extract), file);
  console.log(`✓ ${asset.extract} ${file.byteLength} ${pin.sha256.slice(0, 12)}`);
}

console.log("✓ wasm/rust ready (committed; not part of the default language manifest)");
