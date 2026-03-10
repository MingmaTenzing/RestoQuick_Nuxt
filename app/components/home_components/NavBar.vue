<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import logoUrl from '~/assets/images/RestoQuick.png';

const colorMode = useColorMode();
const scrolled = ref(false);

const links = [
  { label: 'Features', href: '#features' },
  { label: 'AI Assistant', href: '#maya' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Demo', href: '#demo' },
];

const isDark = computed(() => colorMode.value === 'dark');

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark';
};

const updateScrollState = () => {
  scrolled.value = window.scrollY > 12;
};

onMounted(() => {
  updateScrollState();
  window.addEventListener('scroll', updateScrollState, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollState);
});
</script>

<template>
  <header class="sticky top-0 z-50 px-4 pt-4 sm:px-6">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-border bg-background/75 px-3 py-3 backdrop-blur-xl transition duration-300 sm:px-4"
      :class="scrolled ? 'shadow-md' : 'shadow-sm'"
      aria-label="Primary"
    >
      <NuxtLink to="/" class="flex items-center px-2 py-1.5">
        <img :src="logoUrl" alt="RestoQuick" class="h-10 w-auto transition dark:invert dark:brightness-0 sm:h-11">
      </NuxtLink>

      <div class="hidden items-center gap-2 lg:flex">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="px-4 py-2.5 text-sm font-medium text-muted-foreground transition duration-200 hover:text-primary"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>

        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
        >
          <span class="hidden sm:inline">Get Started</span>
          <span class="sm:hidden">Start</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>