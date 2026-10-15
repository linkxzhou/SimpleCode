<script setup lang="ts">
import { computed } from "vue";
import { AlertCircle, Check, Download, Loader2 } from "lucide-vue-next";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { formatMB, type LanguageSpec } from "@/core/manifest";
import type { LangState } from "@/stores/language";
import LanguageIcon from "./LanguageIcon.vue";

const props = defineProps<{ lang: LanguageSpec; state?: LangState; size: number; selected: boolean; collapsed: boolean }>();
defineEmits<{ select: [] }>();

const status = computed(() => props.state?.status ?? "idle");
const pct = computed(() => (props.state?.total ? Math.round((props.state.loaded / props.state.total) * 100) : 0));
const sizeLabel = computed(() => formatMB(props.size).replace(".0", ""));
const tip = computed(() => {
  const s = props.state;
  if (status.value === "downloading" && s) return `${props.lang.label} · 下载中 ${pct.value}%（${formatMB(s.loaded)} / ${formatMB(s.total)}）`;
  if (status.value === "error") return `${props.lang.label} · ${s?.error ?? "下载失败"}（点击重试）`;
  if (status.value === "idle") return `${props.lang.label} · 点击下载 ${formatMB(props.size)}`;
  return `${props.lang.label} ${props.lang.version ?? ""} · 已缓存`;
});
</script>

<template>
  <Tooltip :disabled="!collapsed && status !== 'error'">
    <TooltipTrigger as-child>
      <button
        type="button"
        :data-testid="`lang-${lang.id}`"
        :data-status="status"
        :aria-label="lang.label"
        :aria-current="selected ? 'true' : undefined"
        :class="
          cn(
            'sidebar-item relative flex h-10 items-center overflow-hidden rounded-md text-left text-sm text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
            collapsed ? 'mx-auto w-10 justify-center px-0' : 'w-full gap-2.5 px-2',
            selected && 'bg-accent font-medium',
          )
        "
        @click="$emit('select')"
      >
        <LanguageIcon :short="lang.short" :status="status" :selected="selected" :progress="pct" />
        <template v-if="!collapsed">
          <span class="sidebar-expanded-only min-w-0 flex-1 truncate">{{ lang.label }}</span>
          <span
            v-if="status === 'downloading'"
            class="sidebar-expanded-only flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground"
          >
            <Loader2 class="size-3.5 animate-spin" />{{ pct }}%
          </span>
          <span v-else-if="status === 'error'" class="sidebar-expanded-only flex shrink-0 items-center gap-1 text-xs text-foreground">
            <AlertCircle class="size-3.5" />重试
          </span>
          <span v-else-if="status === 'idle'" class="sidebar-expanded-only flex shrink-0 items-center gap-1 text-xs tabular-nums text-muted-foreground">
            <Download class="size-3.5" />{{ sizeLabel }}
          </span>
          <Check v-else class="sidebar-expanded-only size-3.5 shrink-0 text-foreground" />
          <Progress
            v-if="status === 'downloading'"
            :model-value="pct"
            class="sidebar-expanded-only pointer-events-none absolute inset-x-2 bottom-1 h-0.5"
          />
        </template>
      </button>
    </TooltipTrigger>
    <TooltipContent side="right">{{ tip }}</TooltipContent>
  </Tooltip>
</template>
