<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>
<template>
  <span :class="cn('inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-medium leading-4 text-muted-foreground', props.class)"><slot /></span>
</template>
