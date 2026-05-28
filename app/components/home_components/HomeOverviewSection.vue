<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
import heroShot from '~/assets/images/usecase/Cafe.webp';
import bookingsOverviewShot from '~/assets/images/app_screenshots/Bookings.webp';
import orderShot from '~/assets/images/app_screenshots/Order Details.webp';

const overviewCards = [
    {
        title: 'Built for owner-operators and managers',
        description: 'A single system for the day-to-day realities of small to mid-sized restaurants and cafes, from floor flow to team visibility.',
        image: heroShot,
        alt: 'Chef and manager using RestoQuick in service',
    },
    {
        title: 'One source of truth for the whole team',
        description: 'Front-of-house, kitchen, and management work from the same operational picture with fewer handoffs and less guesswork.',
        image: orderShot,
        alt: 'RestoQuick order management interface',
    },
    {
        title: 'Designed for the rush and the reset',
        description: 'From bookings and tickets to staffing and stock, RestoQuick keeps service moving and gives leadership a clearer read on the business.',
        image: bookingsOverviewShot,
        alt: 'RestoQuick booking management interface',
    },
];
</script>

<template>
    <section id="overview" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
            <div class="mx-auto max-w-7xl">
                <div class="max-w-3xl">
                    <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                        Product overview
                    </p>
                    <h2
                        class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                        A business operations platform for hospitality teams that have outgrown basic tools.
                    </h2>
                    <p class="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                        Most tools solve one slice of the venue. RestoQuick connects bookings, service, staffing,
                        stock, and decision-making so the business runs like one system.
                    </p>
                </div>

                <div class="mt-20 grid gap-16 lg:grid-cols-3">
                    <article v-for="card in overviewCards" :key="card.title" class="flex flex-col">
                        <div class="overflow-hidden rounded-2xl ring-1 ring-border/50">
                            <img :src="card.image" :alt="card.alt"
                                class="h-64 w-full object-cover object-top transition duration-700 hover:scale-[1.03]">
                        </div>
                        <div class="mt-8">
                            <h3 class="text-2xl font-semibold tracking-[-0.04em] text-foreground">{{ card.title }}</h3>
                            <p class="mt-4 text-base font-medium leading-relaxed text-muted-foreground">{{
                                card.description }}</p>
                        </div>
                    </article>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>