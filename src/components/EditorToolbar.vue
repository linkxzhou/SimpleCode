<script setup lang="ts">
import { computed } from "vue";
import { Loader2, Play, RotateCcw, Square, X } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LearnButton from "./docs/LearnButton.vue";
import { useLanguageStore } from "@/stores/language";
import { useRunStore } from "@/stores/run";
import { fileNameFor, useEditorStore } from "@/stores/editor";

const langs = useLanguageStore();
const run = useRunStore();
const editor = useEditorStore();
const isMac = navigator.platform.toLowerCase().includes("mac");
const mod = isMac ? "⌘" : "Ctrl";

const downloading = computed(() => langs.selectedState?.status === "downloading");
const ready = computed(() => ["ready", "cached"].includes(langs.selectedState?.status ?? ""));
const runLabel = computed(() =>
  ({ preparing: "Preparing…", compile: "Compiling…", link: "Linking…", run: "Running…" })[run.status as string] ?? "Run",
);
const fileName = computed(() => {
  const l = langs.selected;
  if (!l) return "";
  return fileNameFor(l.id, l.fileName, editor.dialect);
});
const jsTs = computed(() => langs.selected?.id === "quickjs");

function reset() {
  const l = langs.selected;
  if (!l) return;
  const name = l.id === "quickjs" ? (editor.dialect === "ts" ? "TypeScript" : "JavaScript") : l.label;
  if (confirm(`恢复 ${name} 的示例代码？当前代码将被覆盖。`)) editor.reset(editor.activeBuffer(l.id));
}
</script>

<template>
  <div class="flex h-10 shrink-0 items-center gap-1 border-b border-border px-3">
    <span class="flex-1 truncate font-mono text-xs text-muted-foreground" data-testid="filename">{{ fileName }}</span>
    <div
      v-if="jsTs"
      class="flex h-7 items-center rounded-md border border-border p-0.5"
      role="group"
      aria-label="JavaScript 或 TypeScript"
      data-testid="dialect-toggle"
    >
      <button
        type="button"
        data-testid="dialect-js"
        class="h-6 rounded px-2 font-mono text-xs"
        :class="editor.dialect === 'js' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        :aria-pressed="editor.dialect === 'js'"
        title="JavaScript"
        @click="editor.dialect = 'js'"
      >
        JS
      </button>
      <button
        type="button"
        data-testid="dialect-ts"
        class="h-6 rounded px-2 font-mono text-xs"
        :class="editor.dialect === 'ts' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        :aria-pressed="editor.dialect === 'ts'"
        title="TypeScript（运行前去除类型）"
        @click="editor.dialect = 'ts'"
      >
        TS
      </button>
    </div>
    <LearnButton />
    <template v-if="downloading && langs.selected">
      <Button variant="ghost" size="xs" @click="langs.cancel(langs.selected.id)"><X />取消下载</Button>
    </template>
    <Tooltip>
      <TooltipTrigger as-child>
        <span>
          <Button size="xs" data-testid="run" :disabled="!langs.selected || run.running || downloading" @click="run.run()">
            <Loader2 v-if="run.running" class="animate-spin" />
            <Play v-else />
            {{ runLabel }}
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent side="bottom">{{ ready || downloading ? `运行 ${mod}+Enter` : "首次运行将下载该语言" }}</TooltipContent>
    </Tooltip>
    <Button v-if="run.running" variant="ghost-destructive" size="xs" data-testid="stop" @click="run.stop()"><Square />Stop</Button>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon" class="h-7 w-7" aria-label="恢复示例代码" @click="reset"><RotateCcw /></Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">恢复示例代码</TooltipContent>
    </Tooltip>
  </div>
</template>
