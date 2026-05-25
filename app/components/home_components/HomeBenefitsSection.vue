<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';

const operatorNotes = [
    'Fewer missed calls and fewer booking bottlenecks',
    'Faster kitchen coordination and clearer service flow',
    'Better visibility across staffing, tables, stock, and revenue',
];
</script>

<template>
    <section class="px-6 py-20 sm:py-28">
        <ScrollReveal>
            <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                        Benefits
                    </p>
                    <h2
                        class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                        The result is a business that runs with more clarity.
                    </h2>
                </div>

                <div class="space-y-10">
                    <div v-for="(note, index) in operatorNotes" :key="note" class="flex items-start gap-6">
                        <span class="text-4xl font-semibold tracking-tight text-muted-foreground/40">
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>
                        <div class="pt-2">
                            <p class="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                                Outcome</p>
                            <p class="mt-2 text-base leading-7 text-foreground">{{ note }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>