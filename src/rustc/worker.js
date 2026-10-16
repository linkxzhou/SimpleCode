// Compile-only weblings worker. Adapted from AngelOnFira/weblings app/public/worker.js (MIT).
// The linked program is not executed here; RunSession runs it on WASIWorkerHost.
import { Fd, File, Directory, PreopenDirectory, WASI } from "./shim/index.js";

let rustcModule = null;
let stdSysroot = null;

function parseBundle(bytes) {
  const magic = new TextDecoder().decode(bytes.subarray(0, 6));
  if (magic !== "RIWB1\n") throw new Error("bad sysroot bundle magic");
  const ilen = new DataView(bytes.buffer, bytes.byteOffset + 6, 4).getUint32(0, true);
  const index = JSON.parse(new TextDecoder().decode(bytes.subarray(10, 10 + ilen)));
  const base = 10 + ilen;
  const files = new Map();
  for (const f of index.files) {
    if (f.p === "manifest.json") continue;
    files.set(f.p, new File(bytes.slice(base + f.o, base + f.o + f.l)));
  }
  return files;
}

function stdSysrootPreopen() {
  const root = new Map();
  const dirFor = (segs) => {
    let m = root;
    for (const seg of segs) {
      if (!m.has(seg)) m.set(seg, new Map());
      m = m.get(seg);
    }
    return m;
  };
  for (const [path, file] of stdSysroot) {
    const segs = path.split("/");
    const name = segs.pop();
    dirFor(segs).set(name, file);
  }
  const toDir = (m) => new Directory([...m.entries()].map(([n, v]) => [n, v instanceof Map ? toDir(v) : v]));
  return new PreopenDirectory("/sysroot", [...root.entries()].map(([n, v]) => [n, v instanceof Map ? toDir(v) : v]));
}

const ANSI_RE = /\x1b\[[0-9;]*m/g;

function parseDiagnostics(log) {
  const out = [];
  for (const line of log.split("\n")) {
    if (line[0] !== "{") continue;
    let d;
    try {
      d = JSON.parse(line);
    } catch {
      continue;
    }
    if (d.$message_type !== "diagnostic") continue;
    if (d.level !== "error" && d.level !== "warning") continue;
    const ansi = (d.rendered || d.message || "").trimEnd().replaceAll("/work/prog.rs", "main.rs");
    out.push({ level: d.level, rendered: ansi.replace(ANSI_RE, ""), ansi });
  }
  return out;
}

async function compile(source) {
  let log = "";
  const dec = new TextDecoder();
  class Cap extends Fd {
    fd_write(data) {
      log += dec.decode(data, { stream: true });
      return { ret: 0, nwritten: data.byteLength };
    }
  }
  const work = new PreopenDirectory("/work", [["prog.rs", new File(new TextEncoder().encode(source))]]);
  const args = [
    "rustc",
    "/work/prog.rs",
    "--sysroot",
    "/sysroot",
    "-Zunstable-options",
    "--target",
    "wasm32-wasip1",
    "--edition",
    "2024",
    "-O",
    "-Cpanic=abort",
    "--error-format=json",
    "--json=diagnostic-rendered-ansi",
    "-o",
    "/work/prog.wasm",
  ];
  const fds = [new Cap(), new Cap(), new Cap(), new PreopenDirectory("/tmp", []), stdSysrootPreopen(), work];
  const w = new WASI(args, ["CLIF2WASM_OBJECT=1", "RIWL_TIMINGS=1"], fds, { debug: false });
  const tInst = performance.now();
  const inst = await WebAssembly.instantiate(rustcModule, { wasi_snapshot_preview1: w.wasiImport });
  const instantiateMs = performance.now() - tInst;
  const t0 = performance.now();
  let exit = 0;
  try {
    exit = w.start(inst);
  } catch (e) {
    const m = e && e.message ? e.message : String(e);
    if (!log.trim()) log += m;
    exit = 1;
  }
  const totalMs = performance.now() - t0;
  let linkMs = null;
  const tm = log.match(/riwl-timing: ([^\n]+)/);
  if (tm) {
    const phases = Object.fromEntries(tm[1].trim().split(/\s+/).map((kv) => kv.split("=")).map(([k, v]) => [k, Number(v)]));
    linkMs = phases.total_ms;
    log = log.replace(/^.*riwl-timing:[^\n]*\n?/m, "");
  }
  const compileMs = linkMs != null ? Math.max(0, totalMs - linkMs) : totalMs;
  const diagnostics = parseDiagnostics(log);
  const text = diagnostics.map((d) => d.ansi).join("\n");
  const bin = work.dir.contents.get("prog.wasm");
  if (!bin || !bin.data || bin.data.length === 0) {
    const residue = text || log.replaceAll("/work/prog.rs", "main.rs").trim() || `rustc exited ${exit} without emitting a program`;
    return { ok: false, exit: exit || 1, stderr: residue.endsWith("\n") ? residue : `${residue}\n`, wasm: null, compileMs, linkMs, instantiateMs };
  }
  const copy = new Uint8Array(bin.data.byteLength);
  copy.set(bin.data);
  const warnings = diagnostics.filter((d) => d.level === "warning").map((d) => d.ansi).join("\n");
  return {
    ok: exit === 0,
    exit,
    stderr: warnings ? (warnings.endsWith("\n") ? warnings : `${warnings}\n`) : "",
    wasm: copy.buffer,
    compileMs,
    linkMs,
    instantiateMs,
  };
}

self.onmessage = async (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    try {
      rustcModule = msg.module;
      stdSysroot = parseBundle(new Uint8Array(msg.bundle));
      self.postMessage({ type: "ready" });
    } catch (err) {
      self.postMessage({ type: "init-error", error: String((err && err.message) || err) });
    }
    return;
  }
  if (msg.type === "compile") {
    try {
      const result = await compile(msg.source);
      const transfer = result.wasm ? [result.wasm] : [];
      self.postMessage({ type: "compiled", id: msg.id, result }, transfer);
    } catch (err) {
      self.postMessage({
        type: "compiled",
        id: msg.id,
        result: { ok: false, exit: 1, stderr: `rustc worker: ${String((err && err.message) || err)}\n`, wasm: null, compileMs: 0, linkMs: null, instantiateMs: 0 },
      });
    }
  }
};
