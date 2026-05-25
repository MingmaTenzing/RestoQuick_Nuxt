<script setup lang="ts">
import ScrollReveal from '~/components/home_components/ScrollReveal.vue';
import Vapi_call_button from '~/components/vapi/vapi_call_button.vue';

const bookingNotes = [
    'Picks up booking calls automatically during busy service windows',
    'Collects date, time, party size, and guest details by voice',
    'Handles multiple reservation requests without missed calls or rushed staff handoffs',
    'Syncs directly with your booking workflow so confirmed details stay organized',
];
</script>

<template>
    <section id="maya" class="px-6 py-20 sm:py-28">
        <ScrollReveal>
            <div class="mx-auto max-w-7xl">
                <div class="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.26em] text-green-700 dark:text-green-400">
                            AI voice agent for booking
                        </p>
                        <h2
                            class="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
                            Let Maya handle booking calls without slowing the team down.
                        </h2>
                        <p class="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                            Maya answers incoming calls, guides guests through the reservation flow, and confirms
                            bookings without pulling your team away from service or the counter.
                        </p>

                        <ul class="mt-8 space-y-4">
                            <li v-for="note in bookingNotes" :key="note"
                                class="flex items-start gap-3 text-sm leading-7 text-muted-foreground sm:text-base">
                                <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600 dark:bg-green-400"></span>
                                <span>{{ note }}</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ClientOnly>
                            <Vapi_call_button />
                        </ClientOnly>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    </section>
</template>