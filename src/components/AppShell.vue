<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import LanguageSidebar from "./LanguageSidebar.vue";
import MainArea from "./MainArea.vue";
import DocsDrawer from "./docs/DocsDrawer.vue";
import { useDocsStore } from "@/stores/docs";
import { useStudyStore } from "@/stores/study";
import { useRunFromDoc } from "@/composables/useRunFromDoc";

const COLLAPSE_KEY = "simplecode:sidebar-collapsed";
const sidebar = ref<InstanceType<typeof ResizablePanel>>();
const collapsed = ref(localStorage.getItem(COLLAPSE_KEY) === "1");
const docs = useDocsStore();
const study = useStudyStore();
const learn = useRunFromDoc();

function setCollapsed(v: boolean) {
  collapsed.value = v;
  localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0");
}
function toggle() {
  if (!sidebar.value) return;
  if (sidebar.value.isCollapsed) sidebar.value.expand();
  else sidebar.value.collapse();
}
function onKey(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
    e.preventDefault();
    e.stopPropagation();
    toggle();
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
    e.preventDefault();
    e.stopPropagation();
    study.toggleDrawer();
    return;
  }
  if (!docs.open) return;
  const target = e.target as HTMLElement | null;
  const inDrawer = !!target?.closest("[data-testid='docs-drawer']");
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z" && !e.shiftKey && inDrawer) {
    e.preventDefault();
    learn.undoLastReplace();
    return;
  }
  if (!inDrawer || target?.closest("input, textarea, [contenteditable='true']")) return;
  if (study.mode !== "learn") return;
  if (e.key === "[") {
    e.preventDefault();
    docs.prev();
  } else if (e.key === "]") {
    e.preventDefault();
    docs.next();
  }
}
onMounted(() => {
  window.addEventListener("keydown", onKey, true);
  if (collapsed.value) sidebar.value?.collapse();
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey, true));
</script>

<template>
  <ResizablePanelGroup direction="horizontal" auto-save-id="simplecode-layout-v2" class="h-full w-full">
    <!-- Left: language sidebar (order 1) -->
    <ResizablePanel
      ref="sidebar"
      v-slot="{ isCollapsed }"
      :order="1"
      size-unit="px"
      :default-size="240"
      :min-size="200"
      :max-size="320"
      collapsible
      :collapsed-size="56"
      class="overflow-hidden border-r border-border bg-background"
      @collapse="setCollapsed(true)"
      @expand="setCollapsed(false)"
    >
      <LanguageSidebar :collapsed="isCollapsed" @toggle="toggle" />
    </ResizablePanel>
    <ResizableHandle />
    <!-- Right: editor + terminal (order 2) -->
    <ResizablePanel :order="2" :min-size="30">
      <MainArea />
    </ResizablePanel>
  </ResizablePanelGroup>
  <DocsDrawer />
</template>
