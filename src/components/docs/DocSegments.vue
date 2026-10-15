<script setup lang="ts">
import type { Segment } from "@/docs/types";
import CodeBlock from "./CodeBlock.vue";
import DocAnswer from "./DocAnswer.vue";
import DocCallout from "./DocCallout.vue";

defineProps<{ segments: Segment[]; book: string }>();
</script>

<template>
  <template v-for="(seg, i) in segments" :key="i">
    <div v-if="seg.type === 'html'" class="doc-prose" v-html="seg.html" />
    <CodeBlock v-else-if="seg.type === 'code'" :block="seg.block" :book="book" />
    <DocCallout v-else-if="seg.type === 'callout'" :kind="seg.kind">
      <DocSegments :segments="seg.segments" :book="book" />
    </DocCallout>
    <DocAnswer v-else :title="seg.title">
      <DocSegments :segments="seg.segments" :book="book" />
    </DocAnswer>
  </template>
</template>
