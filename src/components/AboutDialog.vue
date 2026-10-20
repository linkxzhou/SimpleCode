<script setup lang="ts">
import { Github } from "lucide-vue-next";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { t } from "@/i18n";

const open = defineModel<boolean>("open", { required: true });

// Label is localized. The repository URL is the same in both locales.
const repoUrl = "https://github.com/linkxzhou/SimpleCode";
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent data-testid="about-dialog" :close-label="t('close')">
      <DialogTitle class="pr-8 text-base font-semibold leading-6">{{ t("aboutTitle") }}</DialogTitle>
      <DialogDescription class="mt-2 text-sm leading-6 text-muted-foreground">{{ t("aboutLead") }}</DialogDescription>
      <ul class="mt-4 list-disc space-y-2 pl-5 text-sm leading-6">
        <li>{{ t("aboutLanguages") }}</li>
        <li>{{ t("aboutWasm") }}</li>
        <li>{{ t("aboutEditor") }}</li>
        <li>{{ t("aboutTerminal") }}</li>
        <li>{{ t("aboutBooks") }}</li>
      </ul>
      <a
        data-testid="about-repo"
        class="mt-5 inline-flex w-fit items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium leading-6 text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :href="repoUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github class="size-4 shrink-0" aria-hidden="true" />
        {{ t("aboutRepo") }}
      </a>
    </DialogContent>
  </Dialog>
</template>
