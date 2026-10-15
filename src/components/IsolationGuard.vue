<script setup lang="ts">
import { ShieldAlert } from "lucide-vue-next";
</script>

<template>
  <div class="flex h-full items-center justify-center p-8">
    <div class="max-w-md space-y-3 text-sm">
      <ShieldAlert class="size-8 text-foreground" />
      <h1 class="text-lg font-semibold">页面未启用跨源隔离（crossOriginIsolated）</h1>
      <p class="text-muted-foreground">
        SimpleCode 需要 <code>SharedArrayBuffer</code> 来支持程序输入（stdin）。请确保服务器返回以下响应头：
      </p>
      <pre class="rounded-md bg-muted p-3 font-mono text-xs">Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp</pre>
      <p class="text-muted-foreground">开发时请使用 <code>./build.sh dev</code>，生产预览使用 <code>./build.sh preview</code>。</p>
    </div>
  </div>
</template>
