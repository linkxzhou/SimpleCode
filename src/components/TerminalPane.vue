<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDown, ChevronUp, Eraser } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { terminal } from "@/core/terminal";
import { useRunStore } from "@/stores/run";

defineProps<{ collapsed: boolean }>();
defineEmits<{ toggle: [] }>();
const el = ref<HTMLDivElement>();
const run = useRunStore();
let ro: ResizeObserver | undefined;

// Monochrome status indicator: filled = ok, ring = failure, pulse = busy
const FILLED = "bg-neutral-100";
const RING = "border border-neutral-300 bg-transparent";
const BUSY = "bg-neutral-400 animate-pulse";
const indicator = computed(() => {
  switch (run.status) {
    case "preparing":
      return { dot: BUSY, text: "准备中…" };
    case "compile":
      return { dot: BUSY, text: "编译中…" };
    case "link":
      return { dot: BUSY, text: "链接中…" };
    case "run":
      return { dot: "bg-neutral-100 animate-pulse", text: "运行中 · Ctrl+D 发送 EOF" };
    case "done":
      return { dot: FILLED, text: `exit ${run.exitCode}` };
    case "failed":
      return { dot: RING, text: run.message ?? `exit ${run.exitCode}` };
    case "terminated":
      return { dot: "bg-neutral-500", text: "已终止" };
    case "crash":
      return { dot: RING, text: "崩溃" };
    default:
      return { dot: "bg-neutral-600", text: "就绪" };
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
  <div class="flex flex-col text-neutral-200">
    <div
      :class="['flex h-8 shrink-0 cursor-default select-none items-center gap-2 px-3 text-xs', !collapsed && 'border-b border-white/10']"
      data-testid="terminal-header"
      @dblclick="$emit('toggle')"
    >
      <span class="font-medium text-neutral-300">Terminal</span>
      <span class="flex min-w-0 flex-1 items-center gap-1.5 truncate text-neutral-400" data-testid="run-status" :data-status="run.status" :data-source="run.source ?? ''" :data-exit="run.exitCode ?? ''">
        <span :class="['size-1.5 shrink-0 rounded-full', indicator.dot]" />{{ indicator.text }}
      </span>
      <span class="tabular-nums text-neutral-500">{{ seconds }}</span>
      <Button variant="ghost" size="icon" class="h-6 w-6 text-neutral-400 hover:bg-white/10 hover:text-neutral-100" aria-label="清空" @click="terminal.clear()">
        <Eraser class="!size-3.5" />
      </Button>
      <Tooltip>
        <TooltipTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6 text-neutral-400 hover:bg-white/10 hover:text-neutral-100"
            :aria-label="collapsed ? '展开终端' : '折叠终端'"
            data-testid="terminal-toggle"
            @click="$emit('toggle')"
          >
            <ChevronUp v-if="collapsed" class="!size-3.5" />
            <ChevronDown v-else class="!size-3.5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">{{ collapsed ? "展开终端" : "折叠终端" }}</TooltipContent>
      </Tooltip>
    </div>
    <div v-show="!collapsed" ref="el" class="min-h-0 flex-1 px-3 py-2" data-testid="terminal" @click="terminal.focus()" />
  </div>
</template>
