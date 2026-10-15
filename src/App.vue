<script setup lang="ts">
import { onMounted } from "vue";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell.vue";
import IsolationGuard from "@/components/IsolationGuard.vue";
import { useLanguageStore } from "@/stores/language";
import { useTheme } from "@/composables/useTheme";

const isolated = typeof window !== "undefined" && window.crossOriginIsolated === true;
const langs = useLanguageStore();
useTheme();
onMounted(() => {
  if (isolated) void langs.init();
});
</script>

<template>
  <TooltipProvider :delay-duration="300">
    <AppShell v-if="isolated" />
    <IsolationGuard v-else />
  </TooltipProvider>
</template>
