<script setup lang="ts">
import { ref } from "vue";
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; modelValue?: string }>();
const emit = defineEmits<{ "update:modelValue": [string] }>();
const el = ref<HTMLInputElement>();
function focus() {
  el.value?.focus();
}
defineExpose({ focus });
</script>

<template>
  <input
    ref="el"
    :value="props.modelValue"
    :class="
      cn(
        'flex h-8 w-full rounded-md border border-input bg-background px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring',
        props.class,
      )
    "
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
