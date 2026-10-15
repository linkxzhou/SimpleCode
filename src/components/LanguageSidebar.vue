<script setup lang="ts">
import { ChevronsLeft, ChevronsRight, Moon, Sun, SunMoon, Trash2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LanguageItem from "./LanguageItem.vue";
import { useLanguageStore } from "@/stores/language";
import { useTheme } from "@/composables/useTheme";
import { formatMB } from "@/core/manifest";

defineProps<{ collapsed: boolean }>();
defineEmits<{ toggle: [] }>();
const langs = useLanguageStore();
const { mode, cycle } = useTheme();
const themeLabel = () => (mode.value === "system" ? "跟随系统" : mode.value === "light" ? "浅色" : "深色");

async function clear() {
  if (confirm("确定清除所有已缓存的语言运行时？下次使用需重新下载。")) await langs.clearCache();
}
</script>

<template>
  <aside class="flex h-full flex-col overflow-hidden" data-testid="sidebar" :data-collapsed="collapsed">
    <div v-if="!collapsed" class="flex h-10 shrink-0 items-center px-3">
      <span class="text-xs font-medium uppercase tracking-wider text-muted-foreground">Languages</span>
    </div>
    <div v-else class="h-2 shrink-0" />

    <div v-if="langs.manifestError && !collapsed" class="px-3 py-2 text-xs">
      {{ langs.manifestError }}
      <button class="mt-1 block underline" @click="langs.init()">重试</button>
    </div>

    <nav class="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden py-1">
      <LanguageItem
        v-for="lang in langs.languages"
        :key="lang.id"
        :lang="lang"
        :state="langs.states[lang.id]"
        :size="langs.sizeOf(lang)"
        :selected="lang.id === langs.selectedId"
        :collapsed="collapsed"
        @select="langs.select(lang.id)"
      />
    </nav>

    <!-- Footer: cache info, theme, collapse toggle (bottom, both states) -->
    <div :class="['shrink-0 border-t border-border py-2', collapsed ? 'flex flex-col items-center gap-1' : 'space-y-1 px-2']">
      <div v-if="!collapsed" class="flex items-center justify-between px-1 text-xs text-muted-foreground">
        <span>缓存 {{ formatMB(langs.usage) }}</span>
        <Button variant="ghost" size="sm" class="h-6 px-1.5" :disabled="!langs.usage" @click="clear"><Trash2 class="!size-3.5" />清除</Button>
      </div>
      <div :class="collapsed ? 'flex flex-col items-center gap-1' : 'flex items-center gap-1'">
        <Tooltip>
          <TooltipTrigger as-child>
            <Button
              variant="ghost"
              :size="collapsed ? 'icon' : 'sm'"
              :class="collapsed ? '' : 'h-8 flex-1 justify-start px-2 text-xs text-muted-foreground'"
              aria-label="切换主题"
              @click="cycle"
            >
              <Sun v-if="mode === 'light'" />
              <Moon v-else-if="mode === 'dark'" />
              <SunMoon v-else />
              <span v-if="!collapsed">{{ themeLabel() }}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">主题：{{ themeLabel() }}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'" data-testid="sidebar-toggle" @click="$emit('toggle')">
              <ChevronsRight v-if="collapsed" />
              <ChevronsLeft v-else />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">{{ collapsed ? "展开" : "折叠" }} <kbd class="ml-1 opacity-70">⌘B</kbd></TooltipContent>
        </Tooltip>
      </div>
    </div>
  </aside>
</template>
