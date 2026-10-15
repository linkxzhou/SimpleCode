<script setup lang="ts">
import { AlertTriangle, Info, Lightbulb } from "lucide-vue-next";

defineProps<{ kind: "tip" | "note" | "warning" }>();
</script>

<template>
  <div
    class="my-4 flex gap-2 rounded-md bg-background p-3"
    :class="kind === 'warning' ? 'border-2 border-foreground/60' : 'border border-border'"
  >
    <Lightbulb v-if="kind === 'tip'" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <Info v-else-if="kind === 'note'" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <AlertTriangle v-else class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <slot />
    </div>
  </div>
</template>
