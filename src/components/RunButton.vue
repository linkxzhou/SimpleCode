<script setup lang="ts">
import { computed } from "vue";
import { Loader2, Play } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import type { RunStatus } from "@/stores/run";

const props = defineProps<{
  running?: boolean;
  status?: RunStatus;
  disabled?: boolean;
  testId?: string;
}>();

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const label = computed(() => {
  if (!props.running) return "Run";
  const text: Partial<Record<RunStatus, string>> = {
    preparing: "Preparing…",
    compile: "Compiling…",
    link: "Linking…",
    run: "Running…",
  };
  return text[props.status ?? "run"] ?? "Running…";
});
</script>

<template>
  <Button type="button" size="xs" :data-testid="testId" :disabled="disabled" @click="emit('click', $event)">
    <Loader2 v-if="running" class="animate-spin motion-reduce:animate-none" />
    <Play v-else />
    {{ label }}
  </Button>
</template>
