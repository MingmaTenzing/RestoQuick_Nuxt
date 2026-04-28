<script lang="ts" setup>
definePageMeta({
    layout: 'dashboard-layout'
})

const checkoutOptions = [
    {
        id: 'table',
        title: 'Table Checkout',
        subtitle: 'Dine-in Customers',
        description: 'Select an active table and collect payment for the dining session.',
        icon: 'pi pi-table',
        to: '/dashboard/cashier/table',
        accent: 'group-hover:border-primary/50 group-hover:bg-primary/5',
        iconClasses: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
    },
    {
        id: 'takeaway',
        title: 'Takeaway Checkout',
        subtitle: 'Walk-ins & Pickup',
        description: 'Jump directly to the takeaway order flow to process a quick pickup.',
        icon: 'pi pi-shopping-bag',
        to: '/dashboard/cashier/takeaway',
        accent: 'group-hover:border-amber-500/50 group-hover:bg-amber-500/5',
        iconClasses: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white',
    },
]
</script>

<template>
    <main class="space-y-12 pb-10">
        <header class="max-w-2xl space-y-5">


            <h1 class="text-2xl md:text-6xl">Ready for checkout?</h1>
            <p class="text-lg leading-relaxed text-muted-foreground">
                Select the order type you want to process right now.
            </p>
        </header>

        <section class="grid gap-6 md:grid-cols-2">
            <NuxtLink v-for="option in checkoutOptions" :key="option.id" :to="option.to"
                class="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl dark:shadow-none dark:hover:shadow-black/50 sm:p-10"
                :class="option.accent">

                <div class="relative z-10 flex h-full flex-col justify-between gap-12">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg"
                            :class="option.iconClasses">
                            <i :class="[option.icon, 'text-2xl']"></i>
                        </div>
                        <span
                            class="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/60 transition-colors group-hover:text-foreground">
                            {{ option.subtitle }}
                        </span>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-3xl font-semibold tracking-tight text-foreground transition-colors sm:text-4xl">
                            {{ option.title }}
                        </h2>
                        <p
                            class="max-w-sm text-base leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
                            {{ option.description }}
                        </p>
                    </div>

                    <div
                        class="mt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors group-hover:text-foreground">
                        <span>Continue</span>
                        <div
                            class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-all duration-500 group-hover:border-transparent group-hover:bg-foreground group-hover:text-background">
                            <i class="pi pi-arrow-right text-sm"></i>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </section>
    </main>
</template>