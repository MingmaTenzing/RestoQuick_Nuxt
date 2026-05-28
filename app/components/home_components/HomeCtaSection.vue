<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
</script>

<template>
    <section class="px-6 py-20 sm:py-28">
        <ScrollReveal>
            <div class="mx-auto max-w-7xl">
                <div class="max-w-3xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                        Get started
                    </p>
                    <h2
                        class="mt-4 text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl sm:leading-[1.02]">
                        Replace scattered tools with one system your team can actually run the business on.
                    </h2>
                    <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                        Launch RestoQuick with real bookings, smarter scheduling, faster kitchen flow, and clearer
                        business
                        visibility from day one.
                    </p>
                </div>

                <div class="mt-10 flex items-center gap-8">
                    <NuxtLink to="/dashboard"
                        class="inline-flex items-center justify-center bg-green-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700">
                        Get Started
                    </NuxtLink>
                    <a href="#maya"
                        class="text-sm font-medium text-muted-foreground underline underline-offset-4 transition hover:text-foreground">
                        Explore Maya
                    </a>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>