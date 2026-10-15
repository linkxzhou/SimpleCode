<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { TooltipContent, TooltipPortal, type TooltipContentProps } from "reka-ui";
import { cn } from "@/lib/utils";

const props = withDefaults(defineProps<TooltipContentProps & { class?: HTMLAttributes["class"] }>(), { sideOffset: 6 });
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="props.side"
      :side-offset="props.sideOffset"
      :align="props.align"
      :class="cn('z-50 overflow-hidden rounded-md bg-primary px-2.5 py-1 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95', props.class)"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
