<script setup lang="ts">
import { computed } from "vue";
import { BookOpen } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BOOK_LABEL, RUNTIME_TO_BOOK, type RuntimeId } from "@/docs/runtime";
import { useDocsStore } from "@/stores/docs";
import { useLanguageStore } from "@/stores/language";

const langs = useLanguageStore();
const docs = useDocsStore();
const book = computed(() => RUNTIME_TO_BOOK[langs.selectedId as RuntimeId]);
const label = computed(() => (book.value ? BOOK_LABEL[book.value] : ""));
const show = computed(() => !!book.value);
const isMac = navigator.platform.toLowerCase().includes("mac");
const mod = isMac ? "⌘" : "Ctrl";
</script>

<template>
  <Tooltip v-if="show">
    <TooltipTrigger as-child>
      <Button
        type="button"
        variant="ghost"
        size="xs"
        data-testid="learn-button"
        :aria-expanded="docs.open"
        aria-controls="docs-drawer"
        @click="docs.toggle()"
      >
        <BookOpen />
        <span class="max-md:sr-only">{{ label }} 101</span>
      </Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      打开 {{ label }} 101
      <kbd class="ml-1 font-mono text-[10px] opacity-70">{{ mod }}+J</kbd>
    </TooltipContent>
  </Tooltip>
</template>
