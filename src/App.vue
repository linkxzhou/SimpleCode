<script setup lang="ts">
import { onMounted } from "vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell.vue";
import IsolationGuard from "@/components/IsolationGuard.vue";
import ToastHost from "@/components/docs/ToastHost.vue";
import { useLanguageStore } from "@/stores/language";
import { useRunStore } from "@/stores/run";
import { useTheme } from "@/composables/useTheme";

const isolated = typeof window !== "undefined" && window.crossOriginIsolated === true;
const langs = useLanguageStore();
const run = useRunStore();
useTheme();
const hooks = globalThis as unknown as {
  __simplecodeRun?: (opts?: { stdin?: string; stdinEOF?: boolean; source?: string }) => Promise<void>;
  __simplecodeSelect?: (id: string) => Promise<boolean>;
};
hooks.__simplecodeRun = (opts) => run.run(opts);
hooks.__simplecodeSelect = (id) => langs.select(id);
onMounted(() => {
  if (isolated) void langs.init();
});
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <AppShell v-if="isolated" />
    <IsolationGuard v-else />
    <ToastHost />
  </TooltipProvider>
</template>
