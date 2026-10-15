<script setup lang="ts">
import { ref } from "vue";
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "reka-ui";

defineProps<{ title: string }>();
const open = ref(false);
</script>

<template>
  <CollapsibleRoot v-model:open="open" class="my-3">
    <CollapsibleTrigger class="text-xs underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      {{ open ? "收起" : "展开" }}{{ title }}
    </CollapsibleTrigger>
    <CollapsibleContent class="mt-2 border-l-2 border-foreground/30 pl-3">
      <slot />
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
