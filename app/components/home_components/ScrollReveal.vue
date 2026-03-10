<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    delay?: number;
    offset?: number;
    threshold?: number;
    once?: boolean;
  }>(),
  {
    delay: 0,
    offset: 40,
    threshold: 0.16,
    once: true,
  },
);

const root = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!root.value) {
    return;
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) {
        return;
      }

      if (entry.isIntersecting) {
        isVisible.value = true;

        if (props.once) {
          observer?.disconnect();
          observer = null;
        }
      } else if (!props.once) {
        isVisible.value = false;
      }
    },
    {
      threshold: props.threshold,
      rootMargin: '0px 0px -8% 0px',
    },
  );

  observer.observe(root.value);
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <div
    ref="root"
    :class="['scroll-reveal', { 'scroll-reveal--visible': isVisible }]"
    :style="{
      '--scroll-reveal-delay': `${props.delay}ms`,
      '--scroll-reveal-offset': `${props.offset}px`,
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.scroll-reveal {
  opacity: 0;
  transform: translate3d(0, var(--scroll-reveal-offset), 0);
  filter: blur(12px);
  transition:
    opacity 720ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 720ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 720ms cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--scroll-reveal-delay);
  will-change: opacity, transform, filter;
}

.scroll-reveal--visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .scroll-reveal--visible {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }
}
</style>