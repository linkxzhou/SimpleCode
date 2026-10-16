// TeaVM compiler and the program it emits both stay in this worker.
// System.in blocks on a SharedArrayBuffer. Thread.sleep keeps the event loop alive.
const CAP = 65536;

let loadFn;
let compiler;
let sdkBytes;
let classlibBytes;
let bridges;
let stdinCtrl;
let stdinData;
let broken = false;

function post(msg) {
  self.postMessage(msg);
}

async function gunzip(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function gzip(bytes) {
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function appendRecord(raw, name, data) {
  const nb = new TextEncoder().encode(name);
  const rec = new Uint8Array(2 + nb.length + 4 + data.length);
  const view = new DataView(rec.buffer);
  view.setUint16(0, nb.length);
  rec.set(nb, 2);
  view.setUint32(2 + nb.length, data.length);
  rec.set(data, 2 + nb.length + 4);
  const merged = new Uint8Array(raw.length + rec.length);
  merged.set(raw, 0);
  merged.set(rec, raw.length);
  return merged;
}

function asI8(bytes) {
  return new Int8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function formatDiag(d) {
  const file = d.fileName || "Main.java";
  const line = d.lineNumber > 0 ? d.lineNumber : 1;
  const sev = String(d.severity || "error").toLowerCase();
  const msg = d.message || "";
  return `${file}:${line}: ${sev}: ${msg}`;
}

function freshCompiler() {
  compiler = self.__teavm.exports.createCompiler();
  compiler.setSdk(asI8(sdkBytes));
  compiler.setTeaVMClasslib(asI8(classlibBytes));
  compiler.onDiagnostic((d) => {
    if (!self.__diags) return;
    self.__diags.push(formatDiag(d));
  });
  broken = false;
}

function readByte() {
  if (!stdinCtrl || !stdinData) return -1;
  for (;;) {
    const w = Atomics.load(stdinCtrl, 0);
    const r = Atomics.load(stdinCtrl, 1);
    if (w !== r) {
      const b = stdinData[r];
      Atomics.store(stdinCtrl, 1, (r + 1) % CAP);
      Atomics.add(stdinCtrl, 3, 1);
      Atomics.notify(stdinCtrl, 3);
      return b;
    }
    if (Atomics.load(stdinCtrl, 2) === 1) return -1;
    const seq = Atomics.load(stdinCtrl, 3);
    if (Atomics.load(stdinCtrl, 0) !== Atomics.load(stdinCtrl, 1)) continue;
    if (Atomics.load(stdinCtrl, 2) === 1) return -1;
    Atomics.wait(stdinCtrl, 3, seq);
  }
}

function attachStdin(sab) {
  stdinCtrl = new Int32Array(sab, 0, 4);
  stdinData = new Uint8Array(sab, 16, CAP);
}

async function waitIdle(pending) {
  while (pending.n > 0) {
    await new Promise((resolve) => setTimeout(resolve, 15));
  }
}

async function runProgram(id, bytes) {
  const stdout = { line: "" };
  const stderr = { line: "" };
  const pending = { n: 0 };
  const emit = (bucket, kind, ch) => {
    if (ch === 10) {
      post({ type: kind, id, text: `${bucket.line}\n` });
      bucket.line = "";
    } else if (ch !== 13) {
      bucket.line += String.fromCharCode(ch & 0xffff);
    }
  };
  const app = await loadFn(bytes, {
    stackDeobfuscator: { enabled: false },
    installImports(o) {
      o.simplecode = { read: () => readByte() };
      o.teavmConsole.putcharStdout = (ch) => emit(stdout, "stdout", ch);
      o.teavmConsole.putcharStderr = (ch) => emit(stderr, "stderr", ch);
      const offer = o.teavmAsync.offer.bind(o.teavmAsync);
      const kill = o.teavmAsync.kill.bind(o.teavmAsync);
      o.teavmAsync.offer = (event, resume, when) => {
        pending.n++;
        return offer(
          event,
          () => {
            try {
              resume(event);
            } finally {
              pending.n--;
            }
          },
          when,
        );
      };
      o.teavmAsync.kill = (timer) => {
        pending.n = Math.max(0, pending.n - 1);
        return kill(timer);
      };
    },
  });
  post({ type: "running", id });
  let exit = 0;
  try {
    const main = app.exports.main;
    if (typeof main !== "function") throw new Error("missing main export");
    main([]);
  } catch (e) {
    exit = 1;
    const message = e instanceof Error ? e.message : String(e);
    post({ type: "stderr", id, text: `${message}\n` });
  }
  await waitIdle(pending);
  if (stdout.line) post({ type: "stdout", id, text: `${stdout.line}\n` });
  if (stderr.line) post({ type: "stderr", id, text: `${stderr.line}\n` });
  post({ type: "done", id, exit, phase: "run" });
}

async function compileAndRun(id, source, sab) {
  attachStdin(sab);
  if (broken) freshCompiler();
  const diags = [];
  self.__diags = diags;
  compiler.clearSourceFiles();
  compiler.clearOutputFiles();
  compiler.addSourceFile("Main.java", source);
  let ok = false;
  try {
    ok = compiler.compile();
  } catch (e) {
    broken = true;
    const message = e instanceof Error ? e.message : String(e);
    post({ type: "stderr", id, text: `${message}\n` });
    post({ type: "done", id, exit: 1, phase: "compile" });
    freshCompiler();
    return;
  }
  if (!ok) {
    const errors = diags.filter((line) => !line.includes(": warning:"));
    const text = (errors.length ? errors : diags).join("\n");
    post({ type: "stderr", id, text: `${text || "compile failed"}\n` });
    post({ type: "done", id, exit: 1, phase: "compile" });
    return;
  }
  compiler.addOutputClassFile("org/teavm/classlib/java/lang/TConsoleInputStream.class", asI8(bridges.stream));
  compiler.addOutputClassFile("org/teavm/classlib/java/util/TScanner.class", asI8(bridges.scanner));
  compiler.addOutputClassFile("org/teavm/classlib/java/io/TInputStreamReader.class", asI8(bridges.reader));
  const mains = compiler.detectMainClasses();
  if (!mains || mains.length === 0) {
    post({ type: "done", id, exit: 1, phase: "compile", code: "no-main" });
    return;
  }
  if (mains.length !== 1) {
    post({ type: "done", id, exit: 1, phase: "compile", code: "many-main", list: mains.join(", ") });
    return;
  }
  const mainClass = String(mains[0]).replaceAll("/", ".");
  let generated = false;
  try {
    generated = compiler.generateWebAssembly({ outputName: "app", mainClass });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    post({ type: "stderr", id, text: `${message}\n` });
    post({ type: "done", id, exit: 1, phase: "compile" });
    return;
  }
  if (!generated) {
    const text = diags.join("\n");
    post({ type: "stderr", id, text: `${text || "TeaVM failed"}\n` });
    post({ type: "done", id, exit: 1, phase: "compile" });
    return;
  }
  const wasm = compiler.getWebAssemblyOutputFile("app.wasm");
  const bytes = wasm instanceof Uint8Array ? wasm : new Uint8Array(wasm);
  await runProgram(id, bytes);
}

self.onmessage = (e) => {
  const msg = e.data;
  if (msg.type === "init") {
    void (async () => {
      try {
        const blob = new Blob([msg.runtimeJs], { type: "text/javascript" });
        const url = URL.createObjectURL(blob);
        const mod = await import(/* @vite-ignore */ url);
        loadFn = mod.load;
        self.__teavm = await loadFn(new Uint8Array(msg.compilerWasm), { stackDeobfuscator: { enabled: false } });
        const raw = await gunzip(new Uint8Array(msg.compileClasslib));
        const merged = appendRecord(raw, "java/util/Scanner.class", new Uint8Array(msg.scannerStub));
        sdkBytes = await gzip(merged);
        classlibBytes = new Uint8Array(msg.runtimeClasslib);
        bridges = {
          stream: new Uint8Array(msg.stream),
          scanner: new Uint8Array(msg.scanner),
          reader: new Uint8Array(msg.reader),
        };
        freshCompiler();
        post({ type: "ready" });
      } catch (err) {
        post({ type: "init-error", error: err instanceof Error ? err.message : String(err) });
      }
    })();
    return;
  }
  if (msg.type === "run") {
    void compileAndRun(msg.id, msg.source, msg.sab).catch((err) => {
      post({ type: "stderr", id: msg.id, text: `${err instanceof Error ? err.message : String(err)}\n` });
      post({ type: "done", id: msg.id, exit: 1, phase: "compile" });
    });
  }
};
