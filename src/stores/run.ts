import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { attachLinuxConsole, linuxMachine } from "@/core/linux";
import { RunSession, type Phase } from "@/core/runner";
import { terminal } from "@/core/terminal";
import { TranspileError, transpileTypeScript } from "@/core/transpile";
import { useLanguageStore } from "./language";
import { useEditorStore } from "./editor";

export type RunStatus = "idle" | "preparing" | "compile" | "link" | "run" | "done" | "failed" | "terminated" | "crash";

export interface RunOptions {
  stdin?: string;
  stdinEOF?: boolean;
  /** "editor" or a docs block id. */
  source?: string;
}

export const useRunStore = defineStore("run", () => {
  const status = ref<RunStatus>("idle");
  const exitCode = ref<number>();
  const elapsed = ref(0);
  const message = ref<string>();
  const source = ref<string>();
  let session: RunSession | undefined;
  let timer: number | undefined;
  let started = 0;

  const running = computed(() => ["preparing", "compile", "link", "run"].includes(status.value));

  function startTimer() {
    started = performance.now();
    elapsed.value = 0;
    timer = window.setInterval(() => (elapsed.value = performance.now() - started), 100);
  }
  function stopTimer() {
    window.clearInterval(timer);
    elapsed.value = performance.now() - started;
  }

  async function waitUntilIdle(timeout = 1500) {
    const t0 = Date.now();
    while (running.value && Date.now() - t0 < timeout) await new Promise((r) => setTimeout(r, 30));
    return !running.value;
  }

  async function run(opts?: RunOptions) {
    const langs = useLanguageStore();
    const editor = useEditorStore();
    const lang = langs.selected;
    if (!lang || running.value) return;
    source.value = opts?.source ?? "editor";
    status.value = "preparing";
    message.value = undefined;
    exitCode.value = undefined;
    let code = editor.get(editor.activeBuffer(lang.id));
    if (lang.id === "quickjs" && editor.dialect === "ts") {
      try {
        code = await transpileTypeScript(code);
      } catch (e) {
        stop();
        terminal.clear();
        elapsed.value = 0;
        status.value = "failed";
        message.value = "转译失败";
        const detail = e instanceof TranspileError ? e.detail : e instanceof Error ? e.message : String(e);
        terminal.system("TypeScript 转译失败", "31");
        terminal.write(detail.endsWith("\n") ? detail : `${detail}\n`);
        return;
      }
    }
    if (!(await langs.ensure(lang.id))) {
      status.value = "idle";
      return;
    }
    stop();
    terminal.clear();
    status.value = "preparing";
    const stdin = opts?.stdin;
    const stdinEOF = opts?.stdinEOF;
    let inputHandler: { onLine: (line: string) => void; onEOF: () => void; onInterrupt: () => void };
    const s = new RunSession(
      lang,
      {
        stdout: (t) => terminal.write(t),
        stderr: (t) => terminal.stderr(t),
        phase: (p: Phase) => {
          status.value = p;
          if (p === "run") {
            if (lang.runtime !== "v86") terminal.setInputHandler(inputHandler);
            if (stdin) {
              const shown = stdin.endsWith("\n") ? stdin : `${stdin}\n`;
              terminal.write(`\x1b[38;5;247m${shown}\x1b[39m`);
            }
          }
        },
      },
      { stdin, stdinEOF },
    );
    inputHandler = {
      onLine: (line: string) => void s.pushStdin(line),
      onEOF: () => void s.pushEOF(),
      onInterrupt: () => stop(),
    };
    if (lang.runtime === "v86") {
      terminal.setInputHandler(undefined);
      terminal.setPassthrough({
        onData: (data) => {
          if (data.includes("\x03")) linuxMachine.send("\x03");
        },
      });
    }
    session = s;
    startTimer();
    const out = await s.run(code);
    stopTimer();
    terminal.flush();
    terminal.setInputHandler(undefined);
    if (lang.runtime === "v86") attachLinuxConsole();
    if (session !== s) return;
    session = undefined;
    switch (out.type) {
      case "complete":
        exitCode.value = out.exitCode;
        if (out.phase !== "run" && out.exitCode !== 0) {
          status.value = "failed";
          message.value = out.phase === "compile" ? "编译失败" : "链接失败";
          terminal.system(message.value, "31");
        } else status.value = out.exitCode === 0 ? "done" : "failed";
        break;
      case "terminated":
        status.value = "terminated";
        terminal.system("已终止");
        break;
      case "crash":
        status.value = "crash";
        message.value = `${out.errorType}: ${out.message}`;
        terminal.write(`\n\x1b[31m[Crashed] ${message.value}\x1b[0m\n`);
        break;
    }
  }

  function stop() {
    if (session) session.kill();
  }

  return { status, exitCode, elapsed, message, source, running, run, stop, waitUntilIdle };
});
