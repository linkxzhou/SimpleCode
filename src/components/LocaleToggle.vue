<script setup lang="ts">
import { locale, setLocale, t, type Locale } from "@/i18n";

function choose(next: Locale) {
  setLocale(next);
}
</script>

<template>
  <div
    class="inline-flex h-6 shrink-0 items-center rounded-full border border-border bg-background p-0.5"
    role="group"
    :aria-label="t('localeGroup')"
    data-testid="locale-toggle"
  >
    <button
      type="button"
      data-testid="locale-zh"
      class="h-5 rounded-full px-1.5 text-[10px] leading-none"
      :class="locale === 'zh' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
      :aria-pressed="locale === 'zh'"
      @click="choose('zh')"
    >
      中
    </button>
    <button
      type="button"
      data-testid="locale-en"
      class="h-5 rounded-full px-1.5 text-[10px] leading-none"
      :class="locale === 'en' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'"
      :aria-pressed="locale === 'en'"
      @click="choose('en')"
    >
      EN
    </button>
  </div>
</template>
