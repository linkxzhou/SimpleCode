import { ensureRustToolchain, rustParts, type RustParts } from "./toolchain";

export interface RustCompileResult {
  ok: boolean;
  exit: number;
  stderr: string;
  wasm?: Uint8Array;
  compileMs: number;
  linkMs: number | null;
}

interface WorkerResult {
  ok: boolean;
  exit: number;
  stderr: string;
  wasm: ArrayBuffer | null;
  compileMs: number;
  linkMs: number | null;
}

let worker: Worker | undefined;
let ready: Promise<void> | undefined;
let seq = 0;
const pending = new Map<number, { resolve: (r: WorkerResult) => void; reject: (e: Error) => void }>();

function spawn(parts: RustParts): Promise<void> {
  worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" });
  const current = worker;
  const promise = new Promise<void>((resolve, reject) => {
    current.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "ready") {
        resolve();
        return;
      }
      if (msg.type === "init-error") {
        reject(new Error(msg.error || "rustc worker init failed"));
        return;
      }
      if (msg.type === "compiled") {
        const slot = pending.get(msg.id);
        pending.delete(msg.id);
        slot?.resolve(msg.result as WorkerResult);
      }
    };
    current.onerror = (e) => {
      reject(new Error(e.message || "rustc worker error"));
    };
  });
  // Copy the bundle so a later respawn still has the bytes. The module is shared.
  const bundle = parts.bundle.slice().buffer;
  current.postMessage({ type: "init", module: parts.module, bundle }, [bundle]);
  return promise;
}

async function engine(): Promise<Worker> {
  if (!ready) {
    const parts = rustParts();
    if (!parts) throw new Error("Rust 工具链尚未加载");
    ready = spawn(parts).catch((e) => {
      worker = undefined;
      ready = undefined;
      throw e;
    });
  }
  await ready;
  if (!worker) throw new Error("rustc worker 未就绪");
  return worker;
}

/** Drop the compiler worker. The downloaded toolchain stays in memory. */
export function cancelRustCompile() {
  for (const slot of pending.values()) slot.reject(new DOMException("aborted", "AbortError"));
  pending.clear();
  worker?.terminate();
  worker = undefined;
  ready = undefined;
}

export async function compileRust(source: string, signal?: AbortSignal): Promise<RustCompileResult> {
  await ensureRustToolchain(() => {});
  if (signal?.aborted) throw new DOMException("aborted", "AbortError");
  const w = await engine();
  const id = ++seq;
  const result = await new Promise<WorkerResult>((resolve, reject) => {
    const onAbort = () => {
      cancelRustCompile();
      reject(new DOMException("aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
    pending.set(id, {
      resolve: (r) => {
        signal?.removeEventListener("abort", onAbort);
        resolve(r);
      },
      reject: (e) => {
        signal?.removeEventListener("abort", onAbort);
        reject(e);
      },
    });
    w.postMessage({ type: "compile", id, source });
  });
  return {
    ok: result.ok && !!result.wasm,
    exit: result.exit,
    stderr: result.stderr,
    wasm: result.wasm ? new Uint8Array(result.wasm) : undefined,
    compileMs: result.compileMs,
    linkMs: result.linkMs,
  };
}
