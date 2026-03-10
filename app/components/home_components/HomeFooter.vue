<script setup lang="ts">
import logoUrl from '~/assets/images/RestoQuick.png';

const year = new Date().getFullYear();

const productLinks = [
  { label: 'Features', href: '#features' },
  { label: 'AI Assistant', href: '#maya' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Demo', href: '#demo' },
];

const companyLinks = [
  { label: 'Customers', href: '#testimonials' },
  { label: 'Overview', href: '#overview' },
  { label: 'Get Started', href: '/dashboard' },
];
</script>

<template>
  <footer class="border-t border-border bg-background">
    <div class="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12 lg:flex-row lg:items-end lg:justify-between">
      <div class="max-w-sm">
        <img :src="logoUrl" alt="RestoQuick" class="h-8 w-auto dark:invert dark:brightness-0">
        <p class="mt-5 text-sm leading-7 text-muted-foreground">
          RestoQuick is a web-based restaurant management system built to connect bookings,
          service, staffing, kitchen workflows, and performance in one interface.
        </p>
      </div>

      <div class="grid gap-10 sm:grid-cols-2">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Product</p>
          <ul class="mt-4 space-y-3">
            <li v-for="link in productLinks" :key="link.label">
              <a :href="link.href" class="text-sm text-muted-foreground transition hover:text-foreground">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Company</p>
          <ul class="mt-4 space-y-3">
            <li v-for="link in companyLinks" :key="link.label">
              <a :href="link.href" class="text-sm text-muted-foreground transition hover:text-foreground">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-border">
      <div class="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {{ year }} RestoQuick. All rights reserved.</p>
        <p>Designed for modern service teams.</p>
      </div>
    </div>
  </footer>
</template>