<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { cn } from "@/lib/utils";

const props = withDefaults(defineProps<{ modelValue?: number; class?: HTMLAttributes["class"]; indicatorClass?: string }>(), { modelValue: 0 });
</script>

<template>
  <ProgressRoot :model-value="props.modelValue" :class="cn('relative h-1 w-full overflow-hidden rounded-full bg-primary/10', props.class)">
    <ProgressIndicator
      :class="cn('h-full w-full flex-1 bg-foreground transition-transform duration-150', props.indicatorClass)"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
