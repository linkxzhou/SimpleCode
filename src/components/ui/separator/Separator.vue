<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; orientation?: "horizontal" | "vertical" }>();
</script>

<template>
  <div
    role="separator"
    :aria-orientation="props.orientation ?? 'horizontal'"
    :class="cn(props.orientation === 'vertical' ? 'w-px self-stretch bg-border' : 'h-px w-full bg-border', props.class)"
  />
</template>
