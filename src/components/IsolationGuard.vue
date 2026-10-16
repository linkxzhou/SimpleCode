<script setup lang="ts">
import { ShieldAlert } from "lucide-vue-next";
import { t } from "@/i18n";
</script>

<template>
  <div class="flex h-full items-center justify-center p-8">
    <div class="max-w-md space-y-3 text-sm">
      <ShieldAlert class="size-8 text-foreground" />
      <h1 class="text-lg font-semibold">{{ t("isolationTitle") }}</h1>
      <p class="text-muted-foreground">
        {{ t("isolationBefore") }} <code>SharedArrayBuffer</code> {{ t("isolationAfter") }}
      </p>
      <pre class="rounded-md bg-muted p-3 font-mono text-xs">Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp</pre>
      <p class="text-muted-foreground">{{ t("isolationDev") }}<code>./build.sh dev</code>{{ t("isolationPreview") }}<code>./build.sh preview</code>{{ t("isolationEnd") }}</p>
    </div>
  </div>
</template>
