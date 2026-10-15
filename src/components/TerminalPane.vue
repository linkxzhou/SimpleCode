<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Eraser } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { terminal } from "@/core/terminal";
import { useRunStore } from "@/stores/run";

const el = ref<HTMLDivElement>();
const run = useRunStore();
let ro: ResizeObserver | undefined;

const indicator = computed(() => {
  switch (run.status) {
    case "preparing":
      return { dot: "bg-warning animate-pulse", text: "准备中…" };
    case "compile":
      return { dot: "bg-warning animate-pulse", text: "编译中…" };
    case "link":
      return { dot: "bg-warning animate-pulse", text: "链接中…" };
    case "run":
      return { dot: "bg-success animate-pulse", text: "运行中 · Ctrl+D 发送 EOF" };
    case "done":
      return { dot: "bg-success", text: `exit ${run.exitCode}` };
    case "failed":
      return { dot: "bg-destructive", text: run.message ?? `exit ${run.exitCode}` };
    case "terminated":
      return { dot: "bg-zinc-500", text: "已终止" };
    case "crash":
      return { dot: "bg-destructive", text: "崩溃" };
    default:
      return { dot: "bg-zinc-600", text: "就绪" };
  }
});
const seconds = computed(() => (run.status === "idle" ? "" : `${(run.elapsed / 1000).toFixed(2)}s`));

onMounted(() => {
  terminal.attach(el.value!);
  ro = new ResizeObserver(() => terminal.resize());
  ro.observe(el.value!);
});
onBeforeUnmount(() => ro?.disconnect());
</script>

<template>
  <div class="flex flex-col text-zinc-200">
    <div class="flex h-8 shrink-0 items-center gap-2 border-b border-white/10 px-3 text-xs">
      <span class="font-medium text-zinc-400">Terminal</span>
      <span class="flex flex-1 items-center gap-1.5 text-zinc-400" data-testid="run-status" :data-status="run.status">
        <span :class="['size-1.5 rounded-full', indicator.dot]" />{{ indicator.text }}
      </span>
      <span class="tabular-nums text-zinc-500">{{ seconds }}</span>
      <Button variant="ghost" size="icon" class="h-6 w-6 text-zinc-400 hover:bg-white/10 hover:text-zinc-100" aria-label="清空" @click="terminal.clear()">
        <Eraser class="!size-3.5" />
      </Button>
    </div>
    <div ref="el" class="min-h-0 flex-1 px-3 py-2" data-testid="terminal" @click="terminal.focus()" />
  </div>
</template>
