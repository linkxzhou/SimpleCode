<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import EditorToolbar from "./EditorToolbar.vue";
import CodeEditor from "./CodeEditor.vue";
import TerminalPane from "./TerminalPane.vue";
import { useRunStore } from "@/stores/run";

const KEY = "simplecode:terminal-collapsed";
const HEADER = 32; // px, terminal header height == collapsed size
const termPanel = ref<InstanceType<typeof ResizablePanel>>();
const collapsed = ref(localStorage.getItem(KEY) === "1");
// ~28% of the viewport by default
const defaultSize = Math.max(140, Math.round(window.innerHeight * 0.28));
const run = useRunStore();

function setCollapsed(v: boolean) {
  collapsed.value = v;
  localStorage.setItem(KEY, v ? "1" : "0");
}
function toggle() {
  const p = termPanel.value;
  if (!p) return;
  if (p.isCollapsed) p.expand();
  else p.collapse();
}
onMounted(() => {
  if (collapsed.value) termPanel.value?.collapse();
});
// show output when a run starts
watch(
  () => run.status,
  (s) => {
    if (s === "preparing" && termPanel.value?.isCollapsed) termPanel.value.expand();
  },
);
</script>

<template>
  <ResizablePanelGroup direction="vertical" auto-save-id="simplecode-main-v2" class="h-full">
    <ResizablePanel :order="1" :min-size="20" class="flex flex-col">
      <EditorToolbar />
      <CodeEditor class="min-h-0 flex-1" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel
      ref="termPanel"
      :order="2"
      size-unit="px"
      :default-size="defaultSize"
      :min-size="96"
      collapsible
      :collapsed-size="HEADER"
      class="flex flex-col bg-terminal"
      data-testid="terminal-panel"
      @collapse="setCollapsed(true)"
      @expand="setCollapsed(false)"
    >
      <TerminalPane class="min-h-0 flex-1" :collapsed="collapsed" @toggle="toggle" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
