import { t } from "@/i18n";
import { ensureJavaToolchain, javaParts, type JavaParts } from "./toolchain";
import { beginJavaStdin, clearJavaStdin, pushJavaEOF, pushJavaStdin } from "./stdin";

export { pushJavaEOF, pushJavaStdin };

export interface JavaRunResult {
  exit: number;
  phase: "compile" | "run";
}

export interface JavaRunHandlers {
  stdin?: string;
  stdinEOF?: boolean;
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  onRunning: () => void;
}

interface DoneMessage {
  id: number;
  exit: number;
  phase: "compile" | "run";
  code?: "no-main" | "many-main";
  list?: string;
}

let worker: Worker | undefined;
let ready: Promise<void> | undefined;
let settleInit: ((err?: Error) => void) | undefined;
let seq = 0;
let current: { id: number; resolve: (r: JavaRunResult) => void; reject: (e: Error) => void; handlers: JavaRunHandlers } | undefined;

const BRIDGE_URL = {
  "TConsoleInputStream.class": new URL("./bridge/TConsoleInputStream.class", import.meta.url),
  "TScanner.class": new URL("./bridge/TScanner.class", import.meta.url),
  "TInputStreamReader.class": new URL("./bridge/TInputStreamReader.class", import.meta.url),
  "Scanner.class": new URL("./bridge/Scanner.class", import.meta.url),
} as const;

async function bridgeBytes(name: keyof typeof BRIDGE_URL): Promise<Uint8Array> {
  const res = await fetch(BRIDGE_URL[name]);
  if (!res.ok) throw new Error(t("javaBridge", { file: name }));
  return new Uint8Array(await res.arrayBuffer());
}

function transfer(bytes: Uint8Array): ArrayBuffer {
  const copy = bytes.slice();
  return copy.buffer;
}

function spawn(parts: JavaParts, bridges: { stream: Uint8Array; scanner: Uint8Array; reader: Uint8Array; stub: Uint8Array }): Promise<void> {
  const currentWorker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  worker = currentWorker;
  const promise = new Promise<void>((resolve, reject) => {
    settleInit = (err) => {
      settleInit = undefined;
      if (err) reject(err);
      else resolve();
    };
    currentWorker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "ready") {
        settleInit?.();
        return;
      }
      if (msg.type === "init-error") {
        settleInit?.(new Error(msg.error || t("javaWorker")));
        return;
      }
      const slot = current;
      if (!slot || msg.id !== slot.id) return;
      if (msg.type === "stdout") slot.handlers.stdout(msg.text);
      else if (msg.type === "stderr") slot.handlers.stderr(msg.text);
      else if (msg.type === "running") slot.handlers.onRunning();
      else if (msg.type === "done") {
        const done = msg as DoneMessage;
        if (done.code === "no-main") slot.handlers.stderr(`${t("javaNoMain")}\n`);
        if (done.code === "many-main") slot.handlers.stderr(`${t("javaManyMain", { list: done.list ?? "" })}\n`);
        current = undefined;
        slot.resolve({ exit: done.exit, phase: done.phase });
      }
    };
    currentWorker.onerror = (e) => {
      const err = new Error(e.message || t("javaWorker"));
      if (settleInit) settleInit(err);
      else if (current) {
        const slot = current;
        current = undefined;
        slot.reject(err);
      }
    };
  });
  const compilerWasm = transfer(parts.compilerWasm);
  const compileClasslib = transfer(parts.compileClasslib);
  const runtimeClasslib = transfer(parts.runtimeClasslib);
  const stream = transfer(bridges.stream);
  const scanner = transfer(bridges.scanner);
  const reader = transfer(bridges.reader);
  const scannerStub = transfer(bridges.stub);
  currentWorker.postMessage(
    {
      type: "init",
      runtimeJs: parts.runtimeJs,
      compilerWasm,
      compileClasslib,
      runtimeClasslib,
      stream,
      scanner,
      reader,
      scannerStub,
    },
    [compilerWasm, compileClasslib, runtimeClasslib, stream, scanner, reader, scannerStub],
  );
  return promise;
}

async function engine(): Promise<Worker> {
  if (!ready) {
    const parts = javaParts();
    if (!parts) throw new Error(t("javaNotLoaded"));
    const [stream, scanner, reader, stub] = await Promise.all([
      bridgeBytes("TConsoleInputStream.class"),
      bridgeBytes("TScanner.class"),
      bridgeBytes("TInputStreamReader.class"),
      bridgeBytes("Scanner.class"),
    ]);
    const pending = spawn(parts, { stream, scanner, reader, stub });
    const owned = worker;
    ready = pending.catch((e) => {
      if (worker === owned) {
        worker = undefined;
        ready = undefined;
      }
      throw e;
    });
  }
  await ready;
  if (!worker) throw new Error(t("javaWorker"));
  return worker;
}

/** Drop the compiler worker. Downloaded toolchain bytes stay in memory. */
export function cancelJavaRun() {
  const slot = current;
  current = undefined;
  clearJavaStdin();
  if (slot) slot.reject(new DOMException("aborted", "AbortError"));
  settleInit?.(new DOMException("aborted", "AbortError"));
  worker?.terminate();
  worker = undefined;
  ready = undefined;
}

export async function runJava(source: string, handlers: JavaRunHandlers): Promise<JavaRunResult> {
  await ensureJavaToolchain(() => {});
  try {
    const w = await engine();
    const pipeSab = beginJavaStdin({ stdin: handlers.stdin, stdinEOF: handlers.stdinEOF }).sab;
    const id = ++seq;
    return await new Promise<JavaRunResult>((resolve, reject) => {
      current = {
        id,
        handlers,
        resolve: (r) => {
          clearJavaStdin();
          resolve(r);
        },
        reject: (e) => {
          clearJavaStdin();
          reject(e);
        },
      };
      w.postMessage({ type: "run", id, source, sab: pipeSab });
    });
  } catch (e) {
    clearJavaStdin();
    throw e;
  }
}
