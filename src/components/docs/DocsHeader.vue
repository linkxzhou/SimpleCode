<script setup lang="ts">
import { Search, X, ChevronLeft } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

defineProps<{ title: string; showBack: boolean }>();
const emit = defineEmits<{ back: []; close: []; search: [] }>();
</script>

<template>
  <header class="flex h-10 shrink-0 items-center gap-1 border-b border-border px-2">
    <Button v-if="showBack" type="button" variant="ghost" size="icon" class="h-7 w-7" aria-label="返回目录" @click="emit('back')">
      <ChevronLeft />
    </Button>
    <h2 data-testid="docs-title" class="min-w-0 flex-1 truncate px-1 text-sm font-semibold leading-5">{{ title }}</h2>
    <Button v-if="showBack" type="button" variant="ghost" size="icon" class="h-7 w-7" aria-label="搜索本书" @click="emit('search')">
      <Search />
    </Button>
    <Button type="button" variant="ghost" size="icon" class="h-7 w-7" aria-label="关闭教程" data-testid="docs-close" @click="emit('close')">
      <X />
    </Button>
  </header>
</template>
