<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import EditorToolbar from "./EditorToolbar.vue";
import CodeEditor from "./CodeEditor.vue";
import TerminalPane from "./TerminalPane.vue";
</script>

<template>
  <ResizablePanelGroup direction="vertical" auto-save-id="simplecode-main" class="h-full">
    <ResizablePanel :default-size="60" :min-size="20" class="flex flex-col">
      <EditorToolbar />
      <CodeEditor class="min-h-0 flex-1" />
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="40" :min-size="15" class="flex flex-col bg-terminal">
      <TerminalPane class="min-h-0 flex-1" />
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
