<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';

const testimonials = [
    {
        quote:
            'RestoQuick gave us the first operating view that actually feels calm during service. Maya alone changed how we handle bookings and front desk pressure.',
        name: 'Amelia Hart',
        title: 'Owner, Hart House Cafe',
    },
    {
        quote:
            'The kitchen display and analytics changed the pace of the business. We make faster calls, and the team trusts the system.',
        name: 'Noah Patel',
        title: 'Operations Lead, Ember Table Group',
    },
    {
        quote:
            'Scheduling used to be a weekly drain. Now our managers spend less time building rosters and more time improving service and sales.',
        name: 'Sofia Nguyen',
        title: 'General Manager, Juniper & Co. Cafe',
    },
];
</script>

<template>
    <section id="testimonials" class="px-6 py-20 sm:py-24">
        <ScrollReveal>
            <div class="mx-auto max-w-7xl">
                <div class="max-w-2xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                        Testimonials
                    </p>
                    <h2
                        class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                        Operators switch because the whole business feels lighter in practice.
                    </h2>
                </div>

                <div class="mt-20 grid gap-12 lg:grid-cols-3 lg:gap-8">
                    <article v-for="item in testimonials" :key="item.name" class="flex flex-col justify-between">
                        <p class="text-xl leading-relaxed tracking-[-0.02em] text-foreground">“{{ item.quote }}”</p>
                        <div class="mt-8 pt-6">
                            <p class="text-sm font-bold uppercase tracking-[0.05em] text-foreground">{{ item.name }}</p>
                            <p class="mt-1.5 text-sm text-muted-foreground">{{ item.title }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>