#!/usr/bin/env node
// Opt-in: download the four pinned TeaVM playground files into wasm/java/.
// Not part of the default manifest. The browser never fetches teavm.org.
import { createHash } from "node:crypto";
import { createWriteStream, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = JSON.parse(readFileSync(join(root, "scripts/sources.lock.json"), "utf8")).java.files;
const outDir = join(root, "wasm/java");

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function download(url, dest) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok || !res.body) fail(`download ${url} failed: HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  } catch (err) {
    rmSync(dest, { force: true });
    const reason = err && err.name === "TimeoutError" ? "timed out after 60s" : (err && err.message) || String(err);
    fail(`download ${url} failed: ${reason}`);
  }
}

function matches(name, pin) {
  const path = join(outDir, name);
  if (!existsSync(path)) return false;
  const buf = readFileSync(path);
  return buf.length === pin.bytes && sha256(buf) === pin.sha256;
}

mkdirSync(outDir, { recursive: true });
const entries = Object.entries(files);
if (entries.every(([name, pin]) => matches(name, pin))) {
  console.log("✓ wasm/java already matches sources.lock.json");
  process.exit(0);
}

for (const [name, pin] of entries) {
  const dest = join(outDir, name);
  if (!matches(name, pin)) {
    console.log(`↓ ${name}`);
    await download(pin.upstream, dest);
  }
  const buf = readFileSync(dest);
  if (buf.length !== pin.bytes) fail(`${name} 大小 ${buf.length}，期望 ${pin.bytes}`);
  const digest = sha256(buf);
  if (digest !== pin.sha256) fail(`${name} sha256 ${digest}`);
  console.log(`✓ ${name} ${buf.length} ${digest.slice(0, 12)}`);
}

console.log("✓ wasm/java ready (not part of the default language manifest)");
