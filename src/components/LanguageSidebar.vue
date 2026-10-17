<script setup lang="ts">
import { computed, ref } from "vue";
import { AlertCircle, ChevronsLeft, ChevronsRight, CircleHelp, HardDrive, Moon, Sun, SunMoon, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import AboutDialog from "./AboutDialog.vue";
import LanguageItem from "./LanguageItem.vue";
import LocaleToggle from "./LocaleToggle.vue";
import { useLanguageStore } from "@/stores/language";
import { useTheme } from "@/composables/useTheme";
import { formatMB } from "@/core/manifest";
import { t } from "@/i18n";

const props = defineProps<{ collapsed: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
const langs = useLanguageStore();
const { mode, cycle } = useTheme();
const isMac = navigator.platform.toLowerCase().includes("mac");
const mod = isMac ? "⌘" : "Ctrl";

const aboutOpen = ref(false);
const themeLabel = computed(() => (mode.value === "system" ? t("themeFollow") : mode.value === "light" ? t("themeLight") : t("themeDark")));
const cacheText = computed(() => formatMB(langs.usage));

async function clear() {
  if (confirm(t("clearCacheConfirm"))) await langs.clearCache();
}

function choose(id: string) {
  // Do not return the promise. Vue reports a rejection from this handler as
  // an uncaught error on `onSelect`, including AbortError from a language switch.
  void langs.select(id).catch((err: unknown) => {
    if ((err as { name?: string } | null)?.name === "AbortError") return;
    console.error(err);
  });
}
</script>

<template>
  <aside
    class="flex h-full min-h-0 w-full min-w-0 select-none flex-col overflow-hidden bg-background text-foreground"
    data-testid="sidebar"
    :data-collapsed="props.collapsed"
  >
    <header
      class="sidebar-header flex h-10 shrink-0 items-center border-b border-border"
      :class="props.collapsed ? 'justify-center' : 'gap-1.5 px-3'"
    >
      <Tooltip :disabled="!props.collapsed">
        <TooltipTrigger as-child>
          <span class="grid size-7 shrink-0 place-items-center text-foreground" aria-hidden="true">
            <svg viewBox="0 0 32 32" class="size-full" fill="none">
              <path
                d="M11 11l-5 5 5 5M21 11l5 5-5 5M18 9l-4 14"
                stroke="currentColor"
                stroke-width="2.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">SimpleCode</TooltipContent>
      </Tooltip>
      <h1
        data-testid="sidebar-title"
        :class="props.collapsed ? 'sr-only' : 'sidebar-expanded-only min-w-0 flex-1 truncate text-sm font-semibold tracking-tight'"
      >
        SimpleCode
      </h1>
      <template v-if="!props.collapsed">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="sidebar-expanded-only size-7 shrink-0 text-foreground"
              data-testid="about-button"
              :aria-label="t('about')"
              @click="aboutOpen = true"
            >
              <CircleHelp />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">{{ t("about") }}</TooltipContent>
        </Tooltip>
        <LocaleToggle class="sidebar-expanded-only" />
      </template>
    </header>
    <AboutDialog v-model:open="aboutOpen" />

    <div
      v-if="langs.manifestError"
      :class="props.collapsed ? 'flex justify-center px-1 py-2' : 'sidebar-expanded-only px-4 py-2 text-xs text-muted-foreground'"
    >
      <Tooltip v-if="props.collapsed">
        <TooltipTrigger as-child>
          <Button variant="ghost" size="icon" class="size-8" :aria-label="t('retryLoad')" @click="langs.init()">
            <AlertCircle />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{{ langs.manifestError }} · {{ t("retry") }}</TooltipContent>
      </Tooltip>
      <template v-else>
        <p>{{ langs.manifestError }}</p>
        <button type="button" class="mt-1 underline underline-offset-2" @click="langs.init()">{{ t("retry") }}</button>
      </template>
    </div>

    <nav
      :class="[
        'flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden py-2',
        props.collapsed ? 'px-0' : 'px-2',
      ]"
    >
      <LanguageItem
        v-for="lang in langs.languages"
        :key="lang.id"
        :lang="lang"
        :state="langs.states[lang.id]"
        :size="langs.sizeOf(lang)"
        :selected="lang.id === langs.selectedId"
        :collapsed="props.collapsed"
        @select="choose(lang.id)"
      />
    </nav>

    <!-- Expanded: aligned cache + theme rows. Collapsed: centered icon stack. -->
    <footer data-testid="sidebar-footer" class="sidebar-footer shrink-0 border-t border-border">
      <div v-if="props.collapsed" class="flex flex-col items-center gap-1 py-2">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-foreground"
              data-testid="about-button"
              :aria-label="t('about')"
              @click="aboutOpen = true"
            >
              <CircleHelp />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{{ t("about") }}</TooltipContent>
        </Tooltip>
        <LocaleToggle />
        <Tooltip>
          <TooltipTrigger as-child>
            <span class="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                class="size-8 text-foreground"
                data-testid="sidebar-clear"
                :aria-label="t('clearCache')"
                :disabled="!langs.usage"
                @click="clear"
              >
                <Trash2 />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="right">{{ t("clearCacheTip", { size: cacheText }) }}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-foreground"
              data-testid="sidebar-theme"
              :aria-label="t('themeCurrent', { theme: themeLabel })"
              @click="cycle"
            >
              <Sun v-if="mode === 'light'" />
              <Moon v-else-if="mode === 'dark'" />
              <SunMoon v-else />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{{ t("themeTip", { theme: themeLabel }) }}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="size-8 text-foreground"
              data-testid="sidebar-toggle"
              :aria-label="t('expandSidebar')"
              @click="emit('toggle')"
            >
              <ChevronsRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{{ t("expand") }} <kbd class="ml-1 opacity-70">{{ mod }}B</kbd></TooltipContent>
        </Tooltip>
      </div>

      <div v-else class="flex flex-col gap-1 px-2 py-2">
        <div class="flex h-8 items-center gap-2.5 pl-2">
          <span class="grid size-7 shrink-0 place-items-center text-muted-foreground" aria-hidden="true">
            <HardDrive class="size-4" />
          </span>
          <span class="sidebar-expanded-only shrink-0 text-xs text-muted-foreground">{{ t("cache") }}</span>
          <span class="sidebar-expanded-only min-w-0 truncate text-xs tabular-nums text-foreground">{{ cacheText }}</span>
          <span class="flex-1" />
          <Tooltip>
            <TooltipTrigger as-child>
              <span class="inline-flex">
                <Button
                  variant="ghost"
                  size="sm"
                  class="h-8 shrink-0 px-2 text-xs font-normal text-muted-foreground"
                  data-testid="sidebar-clear"
                  :aria-label="t('clearCache')"
                  :disabled="!langs.usage"
                  @click="clear"
                >
                  <Trash2 />
                  <span class="sidebar-expanded-only">{{ t("clear") }}</span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">{{ t("clearCacheTip", { size: cacheText }) }}</TooltipContent>
          </Tooltip>
        </div>
        <div class="flex h-8 items-center gap-1">
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="h-8 min-w-0 flex-1 justify-start gap-2.5 px-2 text-xs font-normal text-muted-foreground"
                data-testid="sidebar-theme"
                :aria-label="t('themeCurrent', { theme: themeLabel })"
                @click="cycle"
              >
                <span class="grid size-7 shrink-0 place-items-center">
                  <Sun v-if="mode === 'light'" />
                  <Moon v-else-if="mode === 'dark'" />
                  <SunMoon v-else />
                </span>
                <span class="sidebar-expanded-only truncate">{{ themeLabel }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{{ t("themeTip", { theme: themeLabel }) }}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button
                variant="ghost"
                size="icon"
                class="size-8 shrink-0 text-muted-foreground"
                data-testid="sidebar-toggle"
                :aria-label="t('collapseSidebar')"
                @click="emit('toggle')"
              >
                <ChevronsLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">{{ t("collapse") }} <kbd class="ml-1 opacity-70">{{ mod }}B</kbd></TooltipContent>
          </Tooltip>
        </div>
      </div>
    </footer>
  </aside>
</template>
