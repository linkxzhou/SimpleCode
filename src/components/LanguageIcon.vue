<script setup lang="ts">
import { cn } from "@/lib/utils";
import type { LangStatus } from "@/stores/language";

// Monochrome monogram tile used as the language icon (expanded + collapsed sidebar)
const props = defineProps<{ short: string; status: LangStatus; selected: boolean; progress?: number }>();
</script>

<template>
  <span
    :class="
      cn(
        'relative grid size-7 shrink-0 place-items-center overflow-hidden rounded-md border font-mono text-[10px] font-semibold leading-none transition-colors',
        props.selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground',
        props.status === 'idle' && !props.selected && 'border-dashed text-muted-foreground',
        props.status === 'error' && 'border-dashed border-foreground',
      )
    "
    aria-hidden="true"
  >
    <span class="relative z-10">{{ props.short }}</span>
    <!-- download progress fills the tile from the bottom -->
    <span
      v-if="props.status === 'downloading'"
      class="absolute inset-x-0 bottom-0 bg-foreground/20 transition-[height] duration-150"
      :style="{ height: `${props.progress ?? 0}%` }"
    />
    <span v-if="props.status === 'error'" class="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-foreground" />
  </span>
</template>
