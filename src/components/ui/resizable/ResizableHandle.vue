<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { SplitterResizeHandle } from "reka-ui";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; disabled?: boolean }>();
</script>

<template>
  <SplitterResizeHandle
    :disabled="props.disabled"
    :class="
      cn(
        'relative flex items-center justify-center bg-border transition-colors hover:bg-primary/20 data-[state=drag]:bg-primary/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        'data-[orientation=horizontal]:w-px data-[orientation=vertical]:h-px',
        'after:absolute data-[orientation=horizontal]:after:inset-y-0 data-[orientation=horizontal]:after:-left-[3px] data-[orientation=horizontal]:after:w-[7px]',
        'data-[orientation=vertical]:after:inset-x-0 data-[orientation=vertical]:after:-top-[3px] data-[orientation=vertical]:after:h-[7px]',
        props.class,
      )
    "
  />
</template>
