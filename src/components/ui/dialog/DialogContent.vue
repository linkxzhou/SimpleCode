<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, type DialogContentProps } from "reka-ui";
import { X } from "lucide-vue-next";
import { cn } from "@/lib/utils";

interface Props extends DialogContentProps {
  class?: HTMLAttributes["class"];
  closeLabel?: string;
}

const props = withDefaults(defineProps<Props>(), { closeLabel: "Close" });
defineOptions({ inheritAttrs: false });
</script>

<template>
  <DialogPortal>
    <DialogOverlay class="fixed inset-0 z-50 bg-foreground/40" />
    <DialogContent
      v-bind="$attrs"
      :class="
        cn(
          'fixed left-1/2 top-1/2 z-50 grid w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-lg border border-border bg-background p-6 text-foreground shadow-lg',
          props.class,
        )
      "
    >
      <slot />
      <DialogClose
        class="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-label="props.closeLabel"
      >
        <X class="size-4" />
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
