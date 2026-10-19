// Pack and extract the committed wasm vendor archives in vendor/prebuilt/.
// `./build.sh vendor` tries the normal build first. If that fails, this script
// checks sha256, unpacks the archives, and rewrites wasm/manifest.json.
// Extraction needs bash, tar, gzip, sha256sum or shasum, and node.
// Rust stays in wasm/rust/ and is not part of these archives.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { assets } from "./languages.config.mjs";
import { refreshManifest } from "./write-manifest.mjs";

export const PREBUILT_VERSION = 1;
// Stay under GitHub's 100 MB file limit and the ~90 MB target. Decimal MB,
// so an 84 MB gzip stays one file and a larger one splits before 90 MB.
export const PART_BYTES = 90 * 1000 * 1000;

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  const err = new Error(message);
  err.code = "PREBUILT";
  throw err;
}

export function sha256Buffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

export function sha256File(file) {
  const tool = sha256Tool();
  if (!tool) return sha256Buffer(readFileSync(file));
  const args = tool === "sha256sum" ? [file] : ["-a", "256", file];
  const result = spawnSync(tool, args, { encoding: "utf8" });
  if (result.status !== 0) fail(`${tool} failed for ${file}`);
  const line = (result.stdout || "").trim().split(/\s+/)[0];
  if (!/^[0-9a-f]{64}$/.test(line)) fail(`${tool} returned an unexpected digest for ${file}`);
  return line;
}

function sha256Tool() {
  const chosen = process.env.SIMPLECODE_SHA256_TOOL || "";
  if (chosen === "sha256sum" || chosen === "shasum") return chosen;
  if (chosen) fail(`unknown SIMPLECODE_SHA256_TOOL ${chosen}`);
  if (commandExists("sha256sum")) return "sha256sum";
  if (commandExists("shasum")) return "shasum";
  return "";
}

function commandExists(name) {
  const result = spawnSync("sh", ["-c", `command -v ${name}`], { encoding: "utf8" });
  return result.status === 0 && Boolean((result.stdout || "").trim());
}

function octal(value, width) {
  const digits = width - 1;
  const text = value.toString(8).padStart(digits, "0");
  if (text.length !== digits) fail(`tar field overflow (${value})`);
  return `${text}\0`;
}

function writeField(buf, text, offset, length) {
  const encoded = Buffer.from(text, "utf8");
  if (encoded.length > length) fail(`tar name too long: ${text}`);
  encoded.copy(buf, offset);
}

// POSIX ustar. mtime, uid, and gid are zero so the same inputs always match.
export function buildTar(entries) {
  const sorted = [...entries].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const chunks = [];
  for (const entry of sorted) {
    if (entry.name.includes("\\") || entry.name.startsWith("/") || entry.name.split("/").includes("..")) {
      fail(`unsafe tar path ${entry.name}`);
    }
    const header = Buffer.alloc(512, 0);
    writeField(header, entry.name, 0, 100);
    writeField(header, octal(0o644, 8), 100, 8);
    writeField(header, octal(0, 8), 108, 8);
    writeField(header, octal(0, 8), 116, 8);
    writeField(header, octal(entry.data.length, 12), 124, 12);
    writeField(header, octal(0, 12), 136, 12);
    header.fill(0x20, 148, 156);
    header[156] = 0x30;
    writeField(header, "ustar\0", 257, 6);
    writeField(header, "00", 263, 2);
    let sum = 0;
    for (const byte of header) sum += byte;
    writeField(header, sum.toString(8).padStart(6, "0"), 148, 6);
    header[154] = 0;
    header[155] = 0x20;
    chunks.push(header);
    chunks.push(entry.data);
    const pad = (512 - (entry.data.length % 512)) % 512;
    if (pad) chunks.push(Buffer.alloc(pad));
  }
  chunks.push(Buffer.alloc(1024));
  return Buffer.concat(chunks);
}

export function gzipDeterministic(buf) {
  return gzipSync(buf, { level: 9, mtime: 0 });
}

export function splitBuffer(buf, partBytes) {
  if (partBytes < 1) fail("part size must be positive");
  if (buf.length <= partBytes) return [buf];
  const parts = [];
  for (let offset = 0; offset < buf.length; offset += partBytes) {
    parts.push(Buffer.from(buf.subarray(offset, offset + partBytes)));
  }
  return parts;
}

export function runtimeFiles() {
  return Object.values(assets).map((spec) => spec.file).sort();
}

export function javaFiles(root = rootDir) {
  const lock = JSON.parse(readFileSync(join(root, "scripts/sources.lock.json"), "utf8"));
  return Object.keys(lock.java.files).map((name) => `java/${name}`).sort();
}

export function hostLabel() {
  const os = spawnSync("uname", ["-s"], { encoding: "utf8" });
  const arch = spawnSync("uname", ["-m"], { encoding: "utf8" });
  const osName = (os.stdout || "").trim().toLowerCase() === "darwin" ? "darwin" : "linux";
  const cpu = (arch.stdout || "").trim();
  const archName = cpu === "aarch64" || cpu === "arm64" ? "arm64" : cpu === "x86_64" || cpu === "amd64" ? "x86_64" : cpu;
  return `${osName}-${archName}`;
}

function archiveBase(version, group) {
  if (group === "runtime") return `wasm-vendor-${version}.tar.gz`;
  if (group === "java") return `wasm-vendor-${version}-java.tar.gz`;
  fail(`unknown prebuilt group ${group}`);
}

function partName(base, index, count) {
  if (count === 1) return base;
  return `${base}.part-${String(index).padStart(2, "0")}`;
}

function readIndex(prebuiltDir) {
  const path = join(prebuiltDir, "index.json");
  if (!existsSync(path)) fail(`missing ${path}. Run ./build.sh vendor --pack after a successful vendor.`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function assertSafeRelative(rel) {
  if (typeof rel !== "string" || rel.length === 0 || rel.includes("\\") || rel.startsWith("/") || rel.split("/").includes("..")) {
    fail(`unsafe prebuilt path ${rel}`);
  }
}

function inside(root, rel) {
  assertSafeRelative(rel);
  const abs = resolve(root, rel);
  const base = resolve(root);
  if (abs !== base && !abs.startsWith(base + sep)) fail(`unsafe prebuilt path ${rel}`);
  return abs;
}

export function packPrebuilt({
  wasmDir,
  outDir,
  groups,
  partBytes = PART_BYTES,
  version = PREBUILT_VERSION,
  host = hostLabel(),
}) {
  mkdirSync(outDir, { recursive: true });
  const index = {
    version,
    format: "ustar+gzip",
    partBytes,
    host,
    note: "Canonical vendor snapshot used when ./build.sh vendor cannot build. Wasm bytes are portable. Lua and Shell may differ on darwin-arm64 because that wasi-sdk compiler-rt differs; this archive is the linux-x86_64 reference when packed there. linux-state.zst is one save_state() snapshot and is not stable across regenerations. Rust is committed under wasm/rust/ and is not in these archives.",
    groups: {},
  };
  const written = [];
  for (const group of Object.keys(groups)) {
    const rels = [...groups[group]].sort();
    const entries = [];
    const files = [];
    for (const rel of rels) {
      const abs = inside(wasmDir, rel);
      if (!existsSync(abs)) fail(`missing ${abs}. Vendor that group before --pack.`);
      const data = readFileSync(abs);
      entries.push({ name: rel, data });
      files.push({ path: rel, bytes: data.length, sha256: sha256Buffer(data) });
    }
    const gz = gzipDeterministic(buildTar(entries));
    const parts = splitBuffer(gz, partBytes);
    const base = archiveBase(version, group);
    const archives = parts.map((part, i) => {
      const name = partName(base, i, parts.length);
      const dest = join(outDir, name);
      writeFileSync(dest, part);
      written.push(name);
      return { name, bytes: part.length, sha256: sha256Buffer(part) };
    });
    index.groups[group] = { archives, files };
  }
  for (const name of readdirSync(outDir)) {
    if (!name.startsWith("wasm-vendor-")) continue;
    if (!written.includes(name)) rmSync(join(outDir, name));
  }
  writeFileSync(join(outDir, "index.json"), `${JSON.stringify(index, null, 2)}\n`);
  writeFileSync(join(outDir, "SHA256SUMS"), sumsText(index));
  writeFileSync(join(outDir, "CONTENTS.txt"), contentsText(index));
  return index;
}

function sumsText(index) {
  const lines = [];
  for (const group of Object.keys(index.groups)) {
    for (const archive of index.groups[group].archives) {
      lines.push(`${archive.sha256}  ${archive.name}`);
    }
  }
  lines.sort();
  return `${lines.join("\n")}\n`;
}

function contentsText(index) {
  const lines = [
    `version ${index.version}`,
    `host ${index.host}`,
    `format ${index.format}`,
    `partBytes ${index.partBytes}`,
    "",
    index.note,
    "",
  ];
  for (const group of Object.keys(index.groups)) {
    lines.push(`[${group}]`);
    for (const file of index.groups[group].files) {
      lines.push(`${file.sha256}  ${String(file.bytes).padStart(10, " ")}  ${file.path}`);
    }
    lines.push("");
    lines.push(`[${group} archives]`);
    for (const archive of index.groups[group].archives) {
      lines.push(`${archive.sha256}  ${String(archive.bytes).padStart(10, " ")}  ${archive.name}`);
    }
    lines.push("");
  }
  lines.push("Reassemble a split archive with cat, then tar. Example:");
  lines.push("  cat wasm-vendor-1.tar.gz.part-* | tar -xzf - -C wasm");
  lines.push("Check archive digests from this directory:");
  lines.push("  sha256sum -c SHA256SUMS");
  lines.push("");
  return `${lines.join("\n")}`;
}

export function extractPrebuilt({ wasmDir, prebuiltDir, group, index = readIndex(prebuiltDir) }) {
  const spec = index.groups[group];
  if (!spec) fail(`prebuilt index has no ${group} group`);
  if (!Array.isArray(spec.archives) || spec.archives.length === 0) fail(`prebuilt ${group} has no archives`);
  const tmp = mkdtempSync(join(tmpdir(), "simplecode-prebuilt-"));
  try {
    const chunks = [];
    for (const archive of spec.archives) {
      assertSafeRelative(archive.name);
      if (archive.name.includes("/")) fail(`unexpected archive name ${archive.name}`);
      const path = join(prebuiltDir, archive.name);
      if (!existsSync(path)) fail(`missing prebuilt archive ${path}`);
      const bytes = statSync(path).size;
      if (bytes !== archive.bytes) {
        fail(`${archive.name} is ${bytes} bytes, index expects ${archive.bytes}`);
      }
      const digest = sha256File(path);
      if (digest !== archive.sha256) {
        fail(`${archive.name} sha256 ${digest}, index expects ${archive.sha256}`);
      }
      chunks.push(readFileSync(path));
    }
    const gz = join(tmp, "archive.tar.gz");
    writeFileSync(gz, Buffer.concat(chunks));
    const unpacked = join(tmp, "files");
    mkdirSync(unpacked);
    const extracted = spawnSync("tar", ["-xzf", gz, "-C", unpacked], { encoding: "utf8" });
    if (extracted.status !== 0) {
      fail(`tar extract failed: ${(extracted.stderr || extracted.stdout || "").trim()}`);
    }
    for (const file of spec.files) {
      const abs = inside(unpacked, file.path);
      if (!existsSync(abs)) fail(`archive is missing ${file.path}`);
      const bytes = statSync(abs).size;
      if (bytes !== file.bytes) fail(`${file.path} is ${bytes} bytes, index expects ${file.bytes}`);
      const digest = sha256File(abs);
      if (digest !== file.sha256) fail(`${file.path} sha256 ${digest}, index expects ${file.sha256}`);
    }
    for (const file of spec.files) {
      const dest = inside(wasmDir, file.path);
      mkdirSync(dirname(dest), { recursive: true });
      copyFileSync(inside(unpacked, file.path), dest);
      console.log(`✓ ${file.path} ${file.bytes} ${file.sha256.slice(0, 12)}`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
  if (group === "runtime" && runtimeFiles().every((rel) => existsSync(join(wasmDir, rel)))) {
    refreshManifest(dirname(resolve(wasmDir)));
    console.log("✓ wrote wasm/manifest.json from extracted files");
  }
}

export function missingRuntime(root) {
  return runtimeFiles().filter((rel) => !existsSync(join(root, "wasm", rel)));
}

export function missingJava(root) {
  return javaFiles(root).filter((rel) => !existsSync(join(root, "wasm", rel)));
}

export function ensurePrebuilt(root) {
  const errors = [];
  if (missingRuntime(root).length) {
    console.warn("⚠ wasm runtime files are missing; extracting committed prebuilt archives");
    try {
      extractPrebuilt({ wasmDir: join(root, "wasm"), prebuiltDir: join(root, "vendor/prebuilt"), group: "runtime" });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  if (missingJava(root).length) {
    console.warn("⚠ wasm/java is missing; extracting the committed TeaVM archive");
    try {
      extractPrebuilt({ wasmDir: join(root, "wasm"), prebuiltDir: join(root, "vendor/prebuilt"), group: "java" });
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  if (errors.length) fail(errors.join("; "));
}

// status 0 keeps the fresh tree. Any other status unpacks the committed group.
export function runVendor({ label, force = "", status = 0, extract, log = console }) {
  if (force) log.error(`✗ ${label} skipped (${force})`);
  if (!force && status === 0) {
    log.log(`✓ ${label} used fresh outputs`);
    return "fresh";
  }
  log.error(`⚠ ${label} failed; extracting committed prebuilt archives`);
  extract();
  log.log(`✓ ${label}: extracted prebuilt archives`);
  return "prebuilt";
}

function childStatus(script, args) {
  const result = spawnSync(process.execPath, [join(rootDir, script), ...args], { stdio: "inherit" });
  return result.status === 0 ? 0 : result.status ?? 1;
}

function packDefault() {
  const java = javaFiles(rootDir);
  const index = packPrebuilt({
    wasmDir: join(rootDir, "wasm"),
    outDir: join(rootDir, "vendor/prebuilt"),
    groups: { runtime: runtimeFiles(), java },
    host: hostLabel(),
  });
  for (const group of Object.keys(index.groups)) {
    const archives = index.groups[group].archives;
    const bytes = archives.reduce((sum, archive) => sum + archive.bytes, 0);
    console.log(`✓ packed ${group}: ${archives.map((archive) => archive.name).join(", ")} (${bytes} bytes)`);
  }
  console.log("✓ wrote vendor/prebuilt/index.json, SHA256SUMS, and CONTENTS.txt");
}

function extractDefault(group) {
  const prebuiltDir = join(rootDir, "vendor/prebuilt");
  const wasmDir = join(rootDir, "wasm");
  if (group === "all") {
    extractPrebuilt({ wasmDir, prebuiltDir, group: "runtime" });
    extractPrebuilt({ wasmDir, prebuiltDir, group: "java" });
    return;
  }
  extractPrebuilt({ wasmDir, prebuiltDir, group });
}

function verifyDefault() {
  const prebuiltDir = join(rootDir, "vendor/prebuilt");
  const index = readIndex(prebuiltDir);
  const sums = readFileSync(join(prebuiltDir, "SHA256SUMS"), "utf8");
  for (const group of Object.keys(index.groups)) {
    for (const archive of index.groups[group].archives) {
      const path = join(prebuiltDir, archive.name);
      const digest = sha256File(path);
      if (digest !== archive.sha256) fail(`${archive.name} sha256 ${digest}`);
      if (!sums.includes(`${archive.sha256}  ${archive.name}`)) fail(`SHA256SUMS missing ${archive.name}`);
      console.log(`✓ ${archive.name} ${archive.bytes} ${digest.slice(0, 12)}`);
    }
  }
  console.log("✓ prebuilt archives match index.json");
}

function runDefault(argv) {
  const java = argv.includes("--java");
  const label = java ? "./build.sh vendor --java" : "./build.sh vendor";
  const forward = argv.filter((arg) => arg !== "--java" && arg !== "--");
  const force = process.env.SIMPLECODE_VENDOR_FORCE_FAIL === "1" ? "SIMPLECODE_VENDOR_FORCE_FAIL=1" : "";
  runVendor({
    label,
    force,
    status: force ? 1 : childStatus(java ? "scripts/vendor-java.mjs" : "scripts/vendor-wasm.mjs", java ? [] : forward),
    extract: () => extractDefault(java ? "java" : "runtime"),
  });
}

function main() {
  const [cmd, ...argv] = process.argv.slice(2);
  if (cmd === "pack") {
    packDefault();
    return;
  }
  if (cmd === "verify") {
    verifyDefault();
    return;
  }
  if (cmd === "extract") {
    const flag = argv.indexOf("--group");
    const group = flag >= 0 ? argv[flag + 1] : "all";
    if (!group || !["runtime", "java", "all"].includes(group)) fail("extract --group runtime|java|all");
    extractDefault(group);
    return;
  }
  if (cmd === "run") {
    runDefault(argv);
    return;
  }
  fail("usage: node scripts/vendor-prebuilt.mjs pack|verify|extract|run");
}

const isCli = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  try {
    main();
  } catch (err) {
    console.error(`✗ ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
