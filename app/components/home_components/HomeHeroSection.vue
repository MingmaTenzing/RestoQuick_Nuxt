<script setup lang="ts">
import { ref } from 'vue';
import Vapi_call_button from '~/components/vapi/vapi_call_button.vue';

const mouseX = ref(0);
const mouseY = ref(0);

const signatureNotes = [
    {
        label: 'Signal',
        value: 'A clearer read on what matters right now across service and operations.',
    },
    {
        label: 'Flow',
        value: 'One connected system from phone call to completed order and close.',
    },
    {
        label: 'Control',
        value: 'Sharper business decisions without adding visual noise to the team.',
    },
];

const handleMouseMove = (event: MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.value = event.clientX - rect.left;
    mouseY.value = event.clientY - rect.top;
};
</script>

<template>
    <section id="main" class="group relative isolate overflow-hidden px-6 pt-24 pb-24 sm:pt-40 sm:pb-32"
        @mousemove="handleMouseMove">
        <div class="absolute inset-0 -z-30 bg-background"></div>

        <div
            class="absolute inset-0 -z-20 h-[800px] bg-[radial-gradient(circle_at_center,rgba(156,163,175,0.4)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_20%,transparent_100%)]">
        </div>

        <div class="absolute inset-0 -z-20 h-[800px] bg-[radial-gradient(circle_at_center,rgba(156,163,175,0.8)_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_1.5px,transparent_1.5px)] [background-size:16px_16px] transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            :style="{ maskImage: `radial-gradient(120px circle at ${mouseX}px ${mouseY}px, black, transparent)`, WebkitMaskImage: `radial-gradient(120px circle at ${mouseX}px ${mouseY}px, black, transparent)` }">
        </div>

        <div
            class="absolute inset-x-0 top-0 -z-20 h-[800px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)] pointer-events-none">
        </div>

        <div class="mx-auto flex max-w-5xl flex-col items-center text-center">
            <p
                class="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-400">
                <span class="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                AI voice assistant & roster management
            </p>

            <h1
                class="text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-7xl lg:text-[5.5rem] lg:leading-[0.95]">
                AI-powered all-in-one software for your restaurant.
            </h1>

            <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Replace scattered tools with one cohesive operating layer. Handle bookings, kitchen flow, staffing, and
                inventory management in a system actually designed for the rush.
            </p>

            <div class="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <NuxtLink to="/dashboard"
                    class="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold tracking-[0.02em] text-background shadow-xl shadow-foreground/5 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Start Operating
                </NuxtLink>
                <ClientOnly>
                    <Vapi_call_button variant="button-only" />
                </ClientOnly>
            </div>
        </div>

        <div class="mx-auto mt-24 max-w-6xl">
            <div
                class="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-4xl border border-border bg-card/40 shadow-2xl shadow-green-900/5 backdrop-blur-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div v-for="item in signatureNotes" :key="item.label"
                    class="p-10 transition-colors hover:bg-accent/40 sm:p-12">
                    <p class="text-[10px] font-bold uppercase tracking-[0.3em] text-green-600 dark:text-green-500">
                        {{ item.label }}
                    </p>
                    <p class="mt-4 text-base font-medium leading-relaxed text-foreground/90">{{ item.value }}</p>
                </div>
            </div>
        </div>
    </section>
</template>