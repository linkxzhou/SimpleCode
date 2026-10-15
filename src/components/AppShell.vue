<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import LanguageSidebar from "./LanguageSidebar.vue";
import MainArea from "./MainArea.vue";

const COLLAPSE_KEY = "simplecode:sidebar-collapsed";
const sidebar = ref<InstanceType<typeof ResizablePanel>>();
const collapsed = ref(localStorage.getItem(COLLAPSE_KEY) === "1");

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
  }
}
onMounted(() => {
  window.addEventListener("keydown", onKey, true);
  if (collapsed.value) sidebar.value?.collapse();
});
onBeforeUnmount(() => window.removeEventListener("keydown", onKey, true));
</script>

<template>
  <ResizablePanelGroup direction="horizontal" auto-save-id="simplecode-layout" class="h-full w-full">
    <!-- Left: language sidebar (order 1) -->
    <ResizablePanel
      ref="sidebar"
      :order="1"
      size-unit="px"
      :default-size="240"
      :min-size="200"
      :max-size="320"
      collapsible
      :collapsed-size="56"
      class="border-r border-border bg-muted"
      @collapse="setCollapsed(true)"
      @expand="setCollapsed(false)"
    >
      <LanguageSidebar :collapsed="collapsed" @toggle="toggle" />
    </ResizablePanel>
    <ResizableHandle />
    <!-- Right: editor + terminal (order 2) -->
    <ResizablePanel :order="2" :min-size="30">
      <MainArea />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
