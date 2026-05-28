<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';

const pricingPlans = [
    {
        name: 'Starter',
        price: '$39',
        note: 'For smaller venues that want better day-to-day control.',
        features: [
            'Bookings and table management',
            'Core dashboard insights',
            'Daily operations tracking',
        ],
        featured: false,
    },
    {
        name: 'All Features',
        oldPrice: '$79',
        price: '$25',
        note: 'One simple monthly plan with every RestoQuick feature included.',
        features: [
            'AI voice booking assistant (Maya)',
            'Real-time kitchen display',
            'Bookings and table management',
            'Staff rostering and team visibility',
            'Inventory and stock management',
            'Analytics and performance dashboard',
        ],
        featured: true,
    },
    {
        name: 'Scale',
        price: '$59',
        note: 'For multi-shift teams that want extra rollout support.',
        features: [
            'Multi-team setup support',
            'Priority onboarding guidance',
            'Advanced operations oversight',
        ],
        featured: false,
    },
];
</script>

<template>
    <section id="pricing" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
            <div class="mx-auto max-w-7xl">
                <div class="max-w-2xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                        Pricing
                    </p>
                    <h2
                        class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                        Every feature. One fixed price: $25 per month.
                    </h2>
                </div>

                <div class="mt-20 grid gap-12 lg:grid-cols-3 lg:gap-8">
                    <article v-for="plan in pricingPlans" :key="plan.name"
                        class="flex flex-col border-t border-border pt-8 pl-0">
                        <div class="flex items-center gap-3">
                            <p class="text-xs font-bold uppercase tracking-[0.25em] text-foreground">{{ plan.name }}</p>
                            <span v-if="plan.featured"
                                class="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-green-600 dark:text-green-500">
                                Recommended
                            </span>
                        </div>
                        <div class="mt-6 flex items-baseline gap-2">
                            <p v-if="plan.oldPrice" class="pb-1 text-sm font-medium text-muted-foreground line-through">
                                {{ plan.oldPrice }}
                            </p>
                            <p class="text-5xl font-semibold tracking-[-0.05em] text-foreground">{{ plan.price }}</p>
                            <p v-if="plan.price !== 'Custom'" class="pb-1.5 text-sm font-medium text-muted-foreground">/
                                month</p>
                        </div>
                        <p class="mt-6 text-sm font-medium leading-relaxed text-muted-foreground">{{ plan.note }}</p>

                        <ul class="mt-8 flex-grow space-y-4">
                            <li v-for="feature in plan.features" :key="feature"
                                class="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                <span
                                    class="h-[3px] w-[3px] shrink-0 rounded-full bg-green-600 dark:bg-green-500"></span>
                                <span>{{ feature }}</span>
                            </li>
                        </ul>

                        <NuxtLink to="/dashboard"
                            class="mt-12 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold tracking-[0.02em] transition-transform"
                            :class="plan.featured ? 'bg-foreground text-background shadow-xl shadow-foreground/5 hover:scale-[1.02] active:scale-[1]' : 'border border-border bg-transparent text-foreground hover:bg-accent/50'">
                            Start Operating
                        </NuxtLink>
                    </article>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>