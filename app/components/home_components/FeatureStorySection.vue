<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    id?: string;
    index?: string;
    eyebrow: string;
    title: string;
    description: string;
    bullets: string[];
    image: string;
    imageAlt: string;
    reverse?: boolean;
  }>(),
  {
    id: undefined,
    index: undefined,
    reverse: false,
  },
);

const contentOrder = computed(() => (props.reverse ? 'lg:order-2' : 'lg:order-1'));
const visualOrder = computed(() => (props.reverse ? 'lg:order-1' : 'lg:order-2'));
</script>

<template>
  <section :id="id" class="py-20 sm:py-28">
    <div class="mx-auto grid max-w-7xl items-start gap-14 px-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-24">
      <div :class="contentOrder" class="relative">
        <div class="mb-8 flex items-center gap-4">
          <span v-if="index" class="text-[11px] font-semibold tracking-[0.28em] text-muted-foreground">
            {{ index }}
          </span>
          <span class="h-px w-14 bg-border"></span>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
            {{ eyebrow }}
          </p>
        </div>

        <h2 class="max-w-xl text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-[3.25rem] lg:leading-[1.02]">
          {{ title }}
        </h2>
        <p class="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
          {{ description }}
        </p>

        <ul class="mt-8 space-y-4">
          <li
            v-for="bullet in bullets"
            :key="bullet"
            class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base"
          >
            <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
            <span>{{ bullet }}</span>
          </li>
        </ul>
      </div>

      <div :class="visualOrder" class="lg:pt-2">
        <div class="overflow-hidden rounded-[30px] border border-border bg-card shadow-sm transition duration-500 hover:-translate-y-1">
          <div class="flex items-center justify-between border-b border-border px-5 py-3">
            <span class="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">RestoQuick</span>
            <span class="text-[11px] text-muted-foreground">Live interface</span>
          </div>
          <img
            :src="image"
            :alt="imageAlt"
            class="h-full w-full object-cover"
          >
        </div>
      </div>
    </div>
  </section>
</template>