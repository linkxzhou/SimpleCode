import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { attachLinuxConsole, linuxMachine } from "@/core/linux";
import { RunSession, type Phase } from "@/core/runner";
import { terminal } from "@/core/terminal";
import { TranspileError, transpileTypeScript } from "@/core/transpile";
import { useLanguageStore } from "./language";
import { useEditorStore } from "./editor";
import { t } from "@/i18n";
import type { MessageKey } from "@/i18n/messages.ts";

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
  const messageKey = ref<MessageKey>();
  const source = ref<string>();
  let session: RunSession | undefined;
  let timer: number | undefined;
  let started = 0;
  let generation = 0;

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

  function abandon() {
    generation++;
    const current = session;
    session = undefined;
    current?.kill();
    window.clearInterval(timer);
    status.value = "idle";
    exitCode.value = undefined;
    message.value = undefined;
    messageKey.value = undefined;
    source.value = undefined;
    elapsed.value = 0;
  }

  async function run(opts?: RunOptions) {
    const langs = useLanguageStore();
    const editor = useEditorStore();
    const lang = langs.selected;
    if (!lang || running.value) return;
    const gen = generation;
    const langId = lang.id;
    const still = () => gen === generation && langs.selectedId === langId;
    source.value = opts?.source ?? "editor";
    status.value = "preparing";
    message.value = undefined;
    messageKey.value = undefined;
    exitCode.value = undefined;
    let code = editor.get(editor.activeBuffer(lang.id));
    if (lang.id === "quickjs" && editor.dialect === "ts") {
      try {
        code = await transpileTypeScript(code);
      } catch (e) {
        if (!still()) return;
        stop();
        terminal.clear();
        elapsed.value = 0;
        status.value = "failed";
        messageKey.value = "transpileFailed";
        message.value = t("transpileFailed");
        const detail = e instanceof TranspileError ? e.detail : e instanceof Error ? e.message : String(e);
        terminal.system("tsTranspileFailed", undefined, "31");
        terminal.write(detail.endsWith("\n") ? detail : `${detail}\n`);
        return;
      }
    }
    if (!still()) return;
    if (!(await langs.ensure(lang.id))) {
      if (!still()) return;
      status.value = "idle";
      return;
    }
    if (!still()) return;
    stop();
    terminal.clear();
    status.value = "preparing";
    const stdin = opts?.stdin;
    const stdinEOF = opts?.stdinEOF;
    let inputHandler: { onLine: (line: string) => void; onEOF: () => void; onInterrupt: () => void };
    const s = new RunSession(
      lang,
      {
        stdout: (text) => {
          if (!still()) return;
          terminal.write(text);
        },
        stderr: (text) => {
          if (!still()) return;
          terminal.stderr(text);
        },
        phase: (p: Phase) => {
          if (!still() || session !== s) return;
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
    if (!still() || session !== s) return;
    stopTimer();
    terminal.flush();
    terminal.setInputHandler(undefined);
    if (lang.runtime === "v86" && linuxMachine.booted) attachLinuxConsole();
    session = undefined;
    switch (out.type) {
      case "complete":
        exitCode.value = out.exitCode;
        if (out.phase !== "run" && out.exitCode !== 0) {
        status.value = "failed";
        const key = out.phase === "compile" ? "compileFailed" : "linkFailed";
        messageKey.value = key;
        message.value = t(key);
        terminal.system(key, undefined, "31");
        } else status.value = out.exitCode === 0 ? "done" : "failed";
        break;
      case "terminated":
        status.value = "terminated";
        terminal.system("terminated");
        break;
      case "crash":
        status.value = "crash";
        const detail = `${out.errorType}: ${out.message}`;
        message.value = detail;
        terminal.system("crashedBanner", { detail }, "31");
        break;
    }
  }

  function stop() {
    if (session) session.kill();
  }

  return { status, exitCode, elapsed, message, messageKey, source, running, run, stop, abandon, waitUntilIdle };
});
