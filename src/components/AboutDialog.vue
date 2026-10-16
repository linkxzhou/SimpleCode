<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { t } from "@/i18n";

const open = defineModel<boolean>("open", { required: true });
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
    </DialogContent>
  </Dialog>
</template>
