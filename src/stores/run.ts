import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { RunSession, type Phase } from "@/core/runner";
import { terminal } from "@/core/terminal";
import { useLanguageStore } from "./language";
import { useEditorStore } from "./editor";

export type RunStatus = "idle" | "preparing" | "compile" | "link" | "run" | "done" | "failed" | "terminated" | "crash";

export const useRunStore = defineStore("run", () => {
  const status = ref<RunStatus>("idle");
  const exitCode = ref<number>();
  const elapsed = ref(0);
  const message = ref<string>();
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

  async function run() {
    const langs = useLanguageStore();
    const editor = useEditorStore();
    const lang = langs.selected;
    if (!lang || running.value) return;
    status.value = "preparing";
    if (!(await langs.ensure(lang.id))) {
      status.value = "idle";
      return;
    }
    stop();
    terminal.clear();
    const code = editor.get(lang.id);
    exitCode.value = undefined;
    message.value = undefined;
    status.value = "preparing";
    const s = new RunSession(lang, {
      stdout: (t) => terminal.write(t),
      stderr: (t) => terminal.stderr(t),
      phase: (p: Phase) => {
        status.value = p;
        if (p === "run") terminal.setInputHandler(inputHandler);
      },
    });
    session = s;
    const inputHandler = {
      onLine: (line: string) => void s.pushStdin(line),
      onEOF: () => void s.pushEOF(),
      onInterrupt: () => stop(),
    };
    startTimer();
    const out = await s.run(code);
    stopTimer();
    terminal.setInputHandler(undefined);
    if (session !== s) return; // superseded
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
    if (session) {
      session.kill();
    }
  }

  return { status, exitCode, elapsed, message, running, run, stop };
});
