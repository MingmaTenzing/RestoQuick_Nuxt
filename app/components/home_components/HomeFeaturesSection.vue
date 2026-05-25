<script setup lang="ts">
import FeatureStorySection from '~/components/home_components/FeatureStorySection.vue';
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
import analyticsShot from '~/assets/images/app_screenshots/Dashboard.webp';
import kitchenShot from '~/assets/images/app_screenshots/Kitchen Display.webp';
import inventoryShot from '~/assets/images/app_screenshots/Stock Management.webp';
import tableShot from '~/assets/images/app_screenshots/Table Managment.webp';
import rosterShot from '~/assets/images/app_screenshots/AI Roster Suggestion.png';

const featureSections = [
    {
        id: 'features',
        index: '01',
        eyebrow: 'AI Staff Rostering',
        title: 'Build stronger schedules for lean teams in minutes, not hours.',
        description:
            'RestoQuick turns roster planning into a calmer workflow for growing cafes and restaurants with AI suggestions that account for demand, availability, and shift coverage.',
        bullets: [
            'Auto-generate staff schedules around expected demand',
            'Reduce labor costs without sacrificing coverage',
            'Balance shifts more fairly across the team',
        ],
        image: rosterShot,
        imageAlt: 'AI staff rostering screenshot',
        reverse: false,
    },
    {
        id: 'kitchen',
        index: '02',
        eyebrow: 'Real-Time Kitchen Display',
        title: 'Keep the kitchen aligned from first ticket to final pickup.',
        description:
            'Orders update instantly across the line so your team can work faster, avoid misfires, and keep service moving with less friction.',
        bullets: [
            'Orders update in real time as they are placed',
            'Reduce kitchen mistakes with clearer order flow',
            'Improve speed, coordination, and service efficiency',
        ],
        image: kitchenShot,
        imageAlt: 'Real-time kitchen display screenshot',
        reverse: true,
    },
    {
        id: 'analytics',
        index: '03',
        eyebrow: 'Smart Analytics Dashboard',
        title: 'See what is happening across the business at a glance.',
        description:
            'From revenue patterns to peak-hour behavior, the dashboard gives operators a sharper view of how the venue is performing every day.',
        bullets: [
            'Track revenue and order performance in one view',
            'Spot peak hours and service patterns quickly',
            'Monitor team and business performance over time',
        ],
        image: analyticsShot,
        imageAlt: 'Smart analytics dashboard screenshot',
        reverse: false,
    },
    {
        id: 'operations',
        index: '04',
        eyebrow: 'Staff & Inventory Management',
        title: 'Stay ahead of staffing issues and stock shortages before they hit service.',
        description:
            'Manage hours, team visibility, and inventory status with cleaner operational controls that reduce surprises during service across busy cafes and dining rooms.',
        bullets: [
            'Track staff hours and day-to-day team activity',
            'Monitor inventory in real time as stock moves',
            'Prevent shortages before they disrupt service',
        ],
        image: inventoryShot,
        imageAlt: 'Inventory management screenshot',
        reverse: true,
    },
    {
        id: 'tables',
        index: '05',
        eyebrow: 'Table Management',
        title: 'Run the floor with more confidence and less chaos.',
        description:
            'Give hosts and managers a clear view of reservations, walk-ins, and table status so they can seat guests faster and keep the room flowing.',
        bullets: [
            'Use a visual table layout to manage the floor',
            'Track reservations and table timing in one place',
            'Handle walk-ins without losing operational visibility',
        ],
        image: tableShot,
        imageAlt: 'Table management screenshot',
        reverse: false,
    },
];
</script>

<template>
    <div>
        <section class="px-6 pb-8 pt-20 sm:pt-28">
            <ScrollReveal>
                <div class="mx-auto max-w-7xl">
                    <div class="max-w-2xl">
                        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
                            Features
                        </p>
                        <h2
                            class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl sm:leading-[1.02]">
                            Every core part of the venue, designed to work together.
                        </h2>
                    </div>
                </div>
            </ScrollReveal>
        </section>

        <FeatureStorySection v-for="section in featureSections" :id="section.id" :key="section.title"
            :index="section.index" :eyebrow="section.eyebrow" :title="section.title" :description="section.description"
            :bullets="section.bullets" :image="section.image" :image-alt="section.imageAlt"
            :reverse="section.reverse" />
    </div>
</template>