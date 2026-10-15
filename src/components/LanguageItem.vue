<script setup lang="ts">
import { computed } from "vue";
import { AlertCircle, Check, Download, Loader2 } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatMB, type LanguageSpec } from "@/core/manifest";
import type { LangState } from "@/stores/language";

const props = defineProps<{ lang: LanguageSpec; state?: LangState; size: number; selected: boolean; collapsed: boolean }>();
defineEmits<{ select: [] }>();

const status = computed(() => props.state?.status ?? "idle");
const pct = computed(() => (props.state?.total ? Math.round((props.state.loaded / props.state.total) * 100) : 0));
const dot = computed(
  () =>
    ({ idle: "bg-muted-foreground/40", cached: "bg-success", ready: "bg-success", downloading: "bg-warning animate-pulse", error: "bg-destructive" })[status.value],
);
const tip = computed(() => {
  const s = props.state;
  if (status.value === "downloading" && s) return `${props.lang.label} · 下载中 ${formatMB(s.loaded)} / ${formatMB(s.total)}`;
  if (status.value === "error") return `${props.lang.label} · ${s?.error ?? "下载失败"}（点击重试）`;
  if (status.value === "idle") return `${props.lang.label} · 点击下载 ${formatMB(props.size)}`;
  return `${props.lang.label} ${props.lang.version ?? ""} · 已缓存`;
});
</script>

<template>
  <Tooltip :disabled="!collapsed && status !== 'error' && status !== 'downloading'">
    <TooltipTrigger as-child>
      <button
        type="button"
        :data-testid="`lang-${lang.id}`"
        :data-status="status"
        :aria-current="selected ? 'true' : undefined"
        :class="
          cn(
            'relative flex w-full flex-col justify-center border-l-2 border-transparent text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            collapsed ? 'h-10 items-center px-0' : 'min-h-9 px-3 py-1.5',
            selected && 'border-primary bg-accent font-medium',
          )
        "
        @click="$emit('select')"
      >
        <template v-if="collapsed">
          <span class="font-mono text-xs">{{ lang.short }}</span>
          <span :class="['absolute right-2 top-2 size-1.5 rounded-full', dot]" />
        </template>
        <template v-else>
          <span class="flex w-full items-center gap-2">
            <span class="flex-1 truncate">{{ lang.label }}</span>
            <span v-if="status === 'downloading'" class="flex items-center gap-1 text-xs tabular-nums text-warning">
              <Loader2 class="size-3.5 animate-spin" />{{ pct }}%
            </span>
            <span v-else-if="status === 'error'" class="flex items-center gap-1 text-xs text-destructive"><AlertCircle class="size-3.5" />重试</span>
            <span v-else-if="status === 'idle'" class="flex items-center gap-1 text-xs text-muted-foreground"><Download class="size-3.5" />{{ formatMB(size).replace(".0", "") }}</span>
            <span v-else class="flex items-center gap-1 text-xs text-muted-foreground">
              <span v-if="lang.version" class="hidden text-[10px] xl:inline">{{ lang.version }}</span>
              <Check class="size-3.5 text-success" />
            </span>
          </span>
          <template v-if="status === 'downloading'">
            <Progress :model-value="pct" class="mt-1.5" />
            <span class="mt-0.5 text-[10px] tabular-nums text-muted-foreground">{{ formatMB(state?.loaded ?? 0) }} / {{ formatMB(state?.total ?? 0) }}</span>
          </template>
        </template>
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">{{ tip }}</TooltipContent>
  </Tooltip>
</template>
