<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import logoUrl from '~/assets/images/RestoQuick.png';

const colorMode = useColorMode();
const route = useRoute();
const scrolled = ref(false);

const links = [
  { label: 'Features', href: '#features' },
  { label: 'AI Assistant', href: '#maya' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Demo', href: '#demo' },
];

const isDark = computed(() => colorMode.value === 'dark');
const logoClasses = computed(() =>
  isDark.value ? 'brightness-0 invert' : '',
);
const navClasses = computed(() =>
  'border-b border-border bg-background shadow-md',
);
const navItemClasses = computed(() =>
  'text-muted-foreground hover:text-primary',
);
const actionClasses = computed(() =>
  'text-muted-foreground hover:text-primary',
);
const ctaClasses = computed(() =>
  'bg-green-600 text-white hover:bg-green-700',
);

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
  <header class="sticky top-0 z-50">
    <nav
      class="flex w-full items-center justify-between px-4 py-3 transition duration-300 sm:px-6"
      :class="navClasses"
      aria-label="Primary"
    >
      <NuxtLink to="/" class="flex items-center px-2 py-1.5">
        <img :src="logoUrl" alt="RestoQuick" class="h-10 w-auto transition sm:h-11" :class="logoClasses">
      </NuxtLink>

      <div class="hidden items-center gap-2 lg:flex">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          class="px-4 py-2.5 text-sm font-medium transition duration-200"
          :class="navItemClasses"
        >
          {{ link.label }}
        </a>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          class="inline-flex items-center justify-center p-2 transition duration-200"
          :class="actionClasses"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleColorMode"
        >
          <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'"></i>
        </button>

        <NuxtLink
          to="/dashboard"
          class="inline-flex items-center rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-sm transition"
          :class="ctaClasses"
        >
          <span class="hidden sm:inline">View Dashboard</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>