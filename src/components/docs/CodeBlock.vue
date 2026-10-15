<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Check, Circle, Copy, Loader2, Play, Square } from "lucide-vue-next";
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "reka-ui";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRunFromDoc } from "@/composables/useRunFromDoc";
import { BOOK_TO_RUNTIME, resolveRuntime, runtimeLabel, type BookId, type RuntimeId } from "@/docs/runtime";
import { stripAnsi } from "@/docs/text";
import type { CodeBlockData } from "@/docs/types";
import { formatMB, type LanguageSpec } from "@/core/manifest";
import { terminal } from "@/core/terminal";
import { useLanguageStore } from "@/stores/language";
import { useRunStore } from "@/stores/run";

const props = defineProps<{ block: CodeBlockData; book: string }>();
const langs = useLanguageStore();
const run = useRunStore();
const runner = useRunFromDoc();

const copied = ref(false);
const copyHint = ref("");
const useStdin = ref(true);
const transpileError = ref("");
const matched = ref<boolean | undefined>();
const actualTail = ref("");
const pinned = ref<string | null>(null);
const confirmOpen = ref(false);
const rememberStop = ref(false);
let pinTimer: number | undefined;
let confirmResolve: ((v: boolean) => void) | undefined;
const codeEl = ref<HTMLElement>();
const live = ref("");
const isolated = typeof window !== "undefined" && window.crossOriginIsolated === true;

const runtimeId = computed(() => resolveRuntime(props.block.lang));
const bookRuntime = computed(() => BOOK_TO_RUNTIME[props.book as BookId]);
const spec = computed(() => langs.languages.find((l) => l.id === runtimeId.value));
const langState = computed(() => (runtimeId.value ? langs.states[runtimeId.value] : undefined));
const active = computed(() => run.source === props.block.id);
const needsDownload = computed(() => langState.value?.status === "idle");
const downloading = computed(() => langState.value?.status === "downloading");
const downloadError = computed(() => langState.value?.status === "error");
const pct = computed(() => {
  const s = langState.value;
  if (!s?.total) return 0;
  return Math.min(100, Math.round((s.loaded / s.total) * 100));
});
const sizeLabel = computed(() => (spec.value ? formatMB(langs.sizeOf(spec.value as LanguageSpec)).replace(/\.0(?= )/, "") : ""));
const switchHint = computed(() => {
  if (!runtimeId.value || !bookRuntime.value || runtimeId.value === bookRuntime.value) return "";
  return `→ 切换到 ${runtimeLabel(runtimeId.value)}`;
});
const needsInput = computed(() => {
  if (props.block.stdin || !props.block.runnable) return false;
  return /\b(input\s*\(|scanf\s*\(|gets\b|getline\s*\(|io\.read|fgets\s*\(|ReadString|bufio\.|cin\s*>>|STDIN)/.test(props.block.code);
});
const busy = computed(
  () => active.value && (run.status === "preparing" || run.status === "compile" || run.status === "link" || run.status === "run"),
);
const phaseLabel = computed(() => {
  if (pinned.value === "done") return `exit ${run.exitCode ?? 0}`;
  if (pinned.value === "failed") return run.message ?? `exit ${run.exitCode ?? 1}`;
  if (pinned.value === "crash") return "崩溃";
  if (pinned.value === "terminated") return "已终止";
  if (!active.value) return idleLabel.value;
  if (run.status === "compile") return "编译中…";
  if (run.status === "link") return "链接中…";
  if (run.status === "preparing" || run.status === "run") return "运行中…";
  return idleLabel.value;
});
const idleLabel = computed(() => {
  if (downloadError.value) return "下载失败 · 重试";
  if (needsDownload.value) return sizeLabel.value ? `下载并运行 ${sizeLabel.value}` : "下载并运行";
  return "运行";
});
const showResultIcon = computed(() => pinned.value === "done" || pinned.value === "failed" || pinned.value === "crash" || pinned.value === "terminated");

watch(
  () => [run.status, run.source, run.exitCode] as const,
  ([status, source]) => {
    if (source !== props.block.id) return;
    if (status === "preparing" || status === "compile" || status === "link" || status === "run") {
      pinned.value = null;
      live.value = status === "run" ? "运行中" : "正在准备运行";
      return;
    }
    if (status === "done" || status === "failed" || status === "crash" || status === "terminated") {
      pinned.value = status;
      window.clearTimeout(pinTimer);
      pinTimer = window.setTimeout(() => {
        pinned.value = null;
      }, 2000);
      if (props.block.expect) {
        const text = stripAnsi(terminal.transcript);
        matched.value = text.includes(props.block.expect);
        actualTail.value = text.trim().slice(-600);
      }
      live.value = status === "done" ? `运行结束，退出码 ${run.exitCode ?? 0}` : `运行结束，${phaseLabel.value}`;
    }
  },
);

function askConfirm() {
  if (localStorage.getItem("simplecode:learn:autoStop") === "1") return Promise.resolve(true);
  confirmOpen.value = true;
  return new Promise<boolean>((resolve) => {
    confirmResolve = resolve;
  });
}
function answerConfirm(ok: boolean) {
  if (ok && rememberStop.value) localStorage.setItem("simplecode:learn:autoStop", "1");
  confirmOpen.value = false;
  confirmResolve?.(ok);
  confirmResolve = undefined;
}

async function onRun() {
  if (!props.block.runnable || !isolated) return;
  if (busy.value) {
    runner.stopFromDoc(props.block.id);
    return;
  }
  transpileError.value = "";
  const result = await runner.runFromDoc(props.block.code, props.block.lang, {
    blockId: props.block.id,
    stdin: props.block.stdin,
    useStdin: useStdin.value && !!props.block.stdin,
    stdinEOF: props.block.eof,
    expect: props.block.expect,
    confirmStop: askConfirm,
  });
  if (result.type === "transpile-error") {
    const at = result.line ? `（${result.line}:${result.column ?? 1}）` : "";
    transpileError.value = `转译失败${at}：${result.message}`;
  }
}

async function copy() {
  copyHint.value = "";
  try {
    await navigator.clipboard.writeText(props.block.code);
    copied.value = true;
    live.value = "已复制";
  } catch {
    const sel = window.getSelection();
    if (codeEl.value && sel) {
      const range = document.createRange();
      range.selectNodeContents(codeEl.value);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    copyHint.value = "复制失败，已选中代码，请按 ⌘C 或 Ctrl+C";
    copied.value = true;
  }
  window.setTimeout(() => {
    copied.value = false;
    copyHint.value = "";
  }, 1500);
}

function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    e.stopPropagation();
    void onRun();
  } else if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "c") {
    e.preventDefault();
    void copy();
  } else if (e.key === "Escape" && busy.value) {
    e.preventDefault();
    runner.stopFromDoc(props.block.id);
  }
}

function cancelDownload() {
  if (runtimeId.value) langs.cancel(runtimeId.value);
}

const runAria = computed(() => {
  const name = runtimeId.value ? runtimeLabel(runtimeId.value as RuntimeId) : props.block.lang;
  return `运行此 ${name} 示例（会替换编辑器内容）`;
});
const runTip = computed(() => {
  if (!isolated) return "当前页面未隔离，无法运行";
  if (needsDownload.value && spec.value && runtimeId.value) return `首次运行需下载 ${runtimeLabel(runtimeId.value)} 运行时（${sizeLabel.value}）`;
  return "运行此示例";
});
</script>

<template>
  <div
    class="doc-code group relative my-4 rounded-md border border-border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
    role="group"
    tabindex="0"
    data-testid="doc-code-block"
    :data-lang="block.lang"
    :data-code="block.code"
    :data-expect="block.expect ?? ''"
    :data-runnable="block.runnable ? '1' : '0'"
    :data-smoke="block.smoke ?? ''"
    :aria-label="block.title ? `代码示例：${block.title}` : `代码示例（${block.lang}）`"
    @keydown="onKey"
  >
    <div class="flex h-8 items-center gap-2 border-b border-border pl-3 pr-1">
      <span class="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{{ block.lang }}</span>
      <span v-if="block.title" class="truncate text-xs text-muted-foreground">{{ block.title }}</span>
      <span v-if="switchHint" class="truncate text-[11px] text-muted-foreground">{{ switchHint }}</span>
      <span v-if="block.stdin" class="text-[11px] text-muted-foreground">需要输入</span>
      <span class="flex-1" />
      <span v-if="!block.runnable" class="pr-2 text-[11px] text-muted-foreground">{{ block.reason }}</span>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button type="button" variant="ghost" size="xs" :aria-label="`复制 ${block.lang} 代码`" @click="copy">
            <Check v-if="copied" />
            <Copy v-else />
            <span class="doc-btn-label">{{ copied ? "已复制" : "复制" }}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">复制</TooltipContent>
      </Tooltip>
      <Tooltip v-if="block.runnable">
        <TooltipTrigger as-child>
          <span>
            <Button
              type="button"
              size="xs"
              class="min-w-[8.75rem] justify-center"
              data-testid="doc-run"
              :disabled="!isolated || downloading"
              :aria-label="runAria"
              :aria-busy="downloading || busy"
              :aria-valuenow="downloading ? pct : undefined"
              @click="onRun"
            >
              <Loader2 v-if="downloading || (busy && !showResultIcon)" class="animate-spin motion-reduce:animate-none" />
              <Check v-else-if="pinned === 'done'" />
              <Circle v-else-if="showResultIcon" />
              <Play v-else />
              <span class="doc-btn-label">{{ downloading ? `下载 ${pct}%` : phaseLabel }}</span>
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">{{ runTip }}</TooltipContent>
      </Tooltip>
      <Button v-if="downloading" type="button" variant="ghost" size="xs" @click="cancelDownload">取消</Button>
      <Button v-if="busy" type="button" variant="ghost" size="xs" data-testid="doc-stop" @click="runner.stopFromDoc(block.id)">
        <Square />
        <span class="doc-btn-label">停止</span>
      </Button>
    </div>
    <pre class="max-h-[480px] overflow-auto px-3 py-2.5 font-mono text-[13px] leading-[1.6]"><code ref="codeEl" v-html="block.html" /></pre>
    <div v-if="block.stdin || block.expect" class="space-y-1 border-t border-border px-3 py-1.5 text-xs text-muted-foreground">
      <CollapsibleRoot v-if="block.stdin">
        <CollapsibleTrigger class="underline underline-offset-2">样例输入</CollapsibleTrigger>
        <CollapsibleContent>
          <pre class="mt-1 whitespace-pre-wrap font-mono text-[12px] text-foreground">{{ block.stdin }}</pre>
          <label class="mt-1 flex items-center gap-2">
            <input v-model="useStdin" type="checkbox" class="accent-foreground" />
            使用样例输入
          </label>
          <p v-if="!block.eof" class="mt-1">预填后不发送 EOF，程序可能继续等待输入。</p>
        </CollapsibleContent>
      </CollapsibleRoot>
      <CollapsibleRoot v-if="block.expect">
        <CollapsibleTrigger class="underline underline-offset-2">期望输出</CollapsibleTrigger>
        <CollapsibleContent>
          <pre class="mt-1 whitespace-pre-wrap font-mono text-[12px] text-foreground">{{ block.expect }}</pre>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
    <p v-if="needsInput" class="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">此示例需要输入</p>
    <p v-if="copyHint" class="border-t border-border px-3 py-1.5 text-xs text-muted-foreground">{{ copyHint }}</p>
    <p v-if="transpileError" class="border-t border-foreground/60 px-3 py-2 text-xs" role="alert">{{ transpileError }}</p>
    <p v-if="matched === true" class="border-t border-border px-3 py-1.5 text-xs">✓ 输出符合预期</p>
    <div v-else-if="matched === false" class="border-t border-border px-3 py-1.5 text-xs">
      <p>○ 输出与预期不同</p>
      <CollapsibleRoot>
        <CollapsibleTrigger class="underline underline-offset-2">查看差异</CollapsibleTrigger>
        <CollapsibleContent>
          <p class="mt-1 text-muted-foreground">预期</p>
          <pre class="whitespace-pre-wrap font-mono">{{ block.expect }}</pre>
          <p class="mt-1 text-muted-foreground">实际（末尾）</p>
          <pre class="whitespace-pre-wrap font-mono">{{ actualTail }}</pre>
        </CollapsibleContent>
      </CollapsibleRoot>
    </div>
    <div v-if="confirmOpen" data-testid="doc-confirm" class="absolute right-2 top-9 z-10 w-64 rounded-md border border-border bg-popover p-3 text-xs text-popover-foreground shadow-sm">
      <p>当前程序正在运行，停止并运行此示例？</p>
      <label class="mt-2 flex items-center gap-2 text-muted-foreground">
        <input v-model="rememberStop" type="checkbox" class="accent-foreground" />
        不再询问
      </label>
      <div class="mt-2 flex justify-end gap-1">
        <Button type="button" variant="ghost" size="xs" @click="answerConfirm(false)">取消</Button>
        <Button type="button" size="xs" data-testid="doc-confirm-yes" @click="answerConfirm(true)">停止并运行</Button>
      </div>
    </div>
    <span class="sr-only" aria-live="polite">{{ live }}</span>
  </div>
</template>
