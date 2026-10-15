// Interactive runner built on @runno/wasi WASIWorkerHost.
// Logic ported from thirdparty/runno/packages/runtime/lib/headless.ts + elements/terminal.ts
import { WASIWorkerHost, WASIWorkerHostKilledError, type WASIFS } from "@runno/wasi";
import type { CommandSpec, LanguageSpec } from "./manifest";
import { getLoaded } from "./wasmLoader";

export type Phase = "compile" | "link" | "run";

export type RunOutcome =
  | { type: "complete"; exitCode: number; phase: Phase }
  | { type: "terminated" }
  | { type: "crash"; message: string; errorType: string };

export interface RunCallbacks {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
  phase: (phase: Phase) => void;
}

export const ENTRY = "/program";

function fill(args: string[] | undefined) {
  return (args ?? []).map((a) => a.replaceAll("{entry}", ENTRY));
}

function now() {
  return new Date();
}

export class RunSession {
  private host?: WASIWorkerHost;
  private killed = false;

  constructor(private lang: LanguageSpec, private cb: RunCallbacks) {}

  get active() {
    return !!this.host;
  }

  async pushStdin(data: string) {
    if (!this.host) return;
    // WASIWorkerHost uses an 8KB SharedArrayBuffer; push in small chunks
    const enc = new TextEncoder();
    let chunk = "";
    for (const ch of data) {
      if (enc.encode(chunk + ch).byteLength > 4000) {
        await this.host?.pushStdin(chunk);
        chunk = "";
      }
      chunk += ch;
    }
    if (chunk) await this.host?.pushStdin(chunk);
  }

  async pushEOF() {
    await this.host?.pushEOF();
  }

  kill() {
    this.killed = true;
    try {
      this.host?.kill();
    } catch {
      /* not started */
    }
  }

  private binaryFor(cmd: CommandSpec, fs: WASIFS): { url: string; revoke: boolean } {
    if (cmd.asset) {
      const a = getLoaded(cmd.asset);
      if (!a?.url) throw new Error(`运行时 ${cmd.asset} 尚未加载`);
      return { url: a.url, revoke: false };
    }
    if (cmd.fsPath) {
      const file = fs[cmd.fsPath];
      if (!file || file.mode !== "binary") throw new Error(`找不到可执行文件 ${cmd.fsPath}`);
      const url = URL.createObjectURL(new Blob([file.content], { type: "application/wasm" }));
      return { url, revoke: true };
    }
    throw new Error("命令缺少 asset 或 fsPath");
  }

  private async exec(cmd: CommandSpec, fs: WASIFS, interactive: boolean) {
    if (cmd.baseFS) {
      const base = getLoaded(cmd.baseFS);
      if (!base?.fs) throw new Error(`文件系统 ${cmd.baseFS} 尚未加载`);
      fs = { ...fs, ...base.fs };
    }
    const { url, revoke } = this.binaryFor(cmd, fs);
    const host = new WASIWorkerHost(url, {
      args: [cmd.binaryName, ...fill(cmd.args)],
      env: cmd.env ?? {},
      fs,
      isTTY: interactive && cmd.tty !== false,
      stdout: (t) => this.cb.stdout(t),
      stderr: (t) => this.cb.stderr(t),
    });
    this.host = host;
    try {
      const p = host.start();
      if (!interactive || this.lang.autoEOF) {
        // compile steps never read stdin; sqlite would otherwise wait for input
        void host.pushEOF();
      }
      const result = await p;
      return { exitCode: result.exitCode, fs: { ...fs, ...result.fs } };
    } finally {
      this.host = undefined;
      if (revoke) URL.revokeObjectURL(url);
    }
  }

  async run(code: string): Promise<RunOutcome> {
    let fs: WASIFS = {
      [ENTRY]: {
        path: "program",
        content: code,
        mode: "string",
        timestamps: { access: now(), modification: now(), change: now() },
      },
    };
    try {
      for (const step of this.lang.prepare ?? []) {
        const phase = (step.step as Phase) ?? "compile";
        this.cb.phase(phase);
        const r = await this.exec(step, fs, false);
        fs = r.fs;
        if (r.exitCode !== 0) return { type: "complete", exitCode: r.exitCode, phase };
        if (this.killed) return { type: "terminated" };
      }
      this.cb.phase("run");
      const r = await this.exec(this.lang.run, fs, true);
      return { type: "complete", exitCode: r.exitCode, phase: "run" };
    } catch (e) {
      if (e instanceof WASIWorkerHostKilledError || this.killed) return { type: "terminated" };
      const err = e as { message?: string; type?: string; constructor?: { name: string } };
      return {
        type: "crash",
        message: err?.message ?? String(e),
        errorType: err?.type ?? (e instanceof Error ? e.constructor.name : "Error"),
      };
    }
  }
}
