<script lang="ts" setup>
const serviceModes = [
    {
        title: 'Dining',
        description: 'Choose a table first, then build the order for the floor.',
        icon: 'pi pi-desktop',
        to: '/dashboard/pos/tables',
    },
    {
        title: 'Takeaway',
        description: 'Start a pickup order immediately without assigning a table.',
        icon: 'pi pi-shopping-bag',
        to: '/dashboard/pos/order/takeaway',
    },
]
</script>


<template>
    <main class="space-y-8">
        <section class="max-w-3xl space-y-3">
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Point of sale</p>
            <h1 class="text-2xl md:text-4xl">Start a dining or takeaway order</h1>
            <p class="text-sm leading-6 text-muted-foreground md:text-base">
                Pick the service type first. Dining moves to table selection before ordering, while takeaway opens a direct order screen.
            </p>
        </section>

        <section class="grid gap-6 lg:grid-cols-2">
            <NuxtLink
                v-for="mode in serviceModes"
                :key="mode.title"
                :to="mode.to"
                class="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-ring hover:shadow-md"
            >
                <div class="flex h-full flex-col justify-between gap-10">
                    <div class="space-y-5">
                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            <i :class="[mode.icon, 'text-xl']"></i>
                        </div>

                        <div class="space-y-3">
                            <h2 class="text-3xl font-semibold uppercase tracking-[0.08em] text-foreground">{{ mode.title }}</h2>
                            <p class="max-w-md text-sm leading-6 text-muted-foreground md:text-base">
                                {{ mode.description }}
                            </p>
                        </div>
                    </div>

                    <div class="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        <span>Continue</span>
                        <i class="pi pi-arrow-right text-xs transition-transform group-hover:translate-x-1"></i>
                    </div>
                </div>
            </NuxtLink>
        </section>
    </main>
</template>