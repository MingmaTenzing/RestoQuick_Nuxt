<script setup lang="ts">
definePageMeta({
    layout: 'dashboard-layout'
})

import { computed, ref } from 'vue'
import type { OrderDetailsWithInclude } from '~~/types/orderwithInclude'

const searchQuery = ref('')

const { data: orders, pending, error, refresh } = await useFetch<OrderDetailsWithInclude[]>('/api/orders/takeaway-unpaid')

const filteredOrders = computed(() => {
    const allOrders = orders.value ?? []
    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    if (!normalizedQuery) {
        return allOrders
    }

    return allOrders.filter((order) => {
        const orderNo = order.orderNo?.toString() ?? ''
        const customerName = order.customerName?.toLowerCase() ?? ''

        return orderNo.includes(normalizedQuery) || customerName.includes(normalizedQuery)
    })
})

const totalDueCents = computed(() => {
    return filteredOrders.value.reduce((sum, order) => sum + order.totalAmountCents, 0)
})

const totalItems = (order: OrderDetailsWithInclude) => {
    return order.items.reduce((sum, item) => sum + item.quantity, 0)
}
</script>

<template>
    <main class="space-y-8 pb-10">
        <section class="px-1 pt-2">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class=" space-y-2">
                    <NuxtLink to="/dashboard/cashier"
                        class="inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors">
                        <i class="pi pi-arrow-left text-[10px]"></i>
                        Back
                    </NuxtLink>

                    <h1 class="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        Unpaid Takeaway Orders
                    </h1>
                </div>

                <div class="flex flex-wrap items-center gap-3 lg:justify-end">
                    <div
                        class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm">
                        <span class="h-2.5  rounded-full bg-amber-500"></span>
                        <span>{{ filteredOrders.length }} unpaid order{{ filteredOrders.length !== 1 ? 's' : ''
                        }}</span>
                    </div>
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-foreground">
                        <i class="pi pi-wallet text-xs"></i>
                        <span>$ {{ (totalDueCents / 100).toFixed(2) }} due</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="rounded-4xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p class="text-sm font-medium text-foreground">Order queue</p>
                    <p class="mt-1 text-sm text-muted-foreground">
                        Search by customer name or order number.
                    </p>
                </div>

                <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <label class="relative block w-full max-w-md">
                        <span
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                            <i class="pi pi-search text-sm"></i>
                        </span>
                        <input v-model="searchQuery" type="text" placeholder="Search unpaid takeaway orders"
                            class="h-12 w-full rounded-2xl border border-border bg-secondary pl-11 pr-10 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
                        <button v-if="searchQuery" @click="searchQuery = ''" type="button"
                            class="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                            <i class="pi pi-times text-xs"></i>
                        </button>
                    </label>

                    <button type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors"
                        @click="refresh()">
                        <i class="pi pi-refresh text-xs"></i>
                        Refresh
                    </button>
                </div>
            </div>
        </section>

        <section v-if="pending" class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <div v-for="index in 6" :key="index" class="h-72 animate-pulse rounded-4xl border border-border bg-card">
            </div>
        </section>

        <section v-else-if="error"
            class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <h2 class="text-xl font-semibold text-foreground">Unable to load takeaway orders</h2>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">
                {{ error.statusMessage || 'Try refreshing the queue.' }}
            </p>
            <button type="button"
                class="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors"
                @click="refresh()">
                <i class="pi pi-refresh text-xs"></i>
                Try again
            </button>
        </section>

        <section v-else-if="filteredOrders.length" class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            <article v-for="order in filteredOrders" :key="order.id"
                class="rounded-4xl border border-border bg-card p-6 shadow-sm transition-transform">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Order</p>
                        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                            #{{ order.orderNo ?? 'Pending' }}
                        </h2>
                    </div>

                    <span
                        class="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                        Unpaid
                    </span>
                </div>

                <div class="mt-5 grid grid-cols-2 gap-3">
                    <div class="rounded-2xl bg-secondary px-4 py-3">
                        <p class="text-xs uppercase tracking-widest text-muted-foreground">Customer</p>
                        <p class="mt-1 text-sm font-medium text-foreground">{{ order.customerName || 'Walk-in order' }}
                        </p>
                    </div>
                    <div class="rounded-2xl bg-secondary px-4 py-3">
                        <p class="text-xs uppercase tracking-widest text-muted-foreground">Total due</p>
                        <p class="mt-1 text-sm font-semibold text-foreground">$ {{ (order.totalAmountCents /
                            100).toFixed(2) }}</p>
                    </div>
                </div>

                <div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{{ totalItems(order) }} item{{ totalItems(order) !== 1 ? 's' : '' }}</span>
                    <NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short" hour="2-digit"
                        minute="2-digit" />
                </div>

                <ul class="mt-5 space-y-3 border-t border-border pt-5">
                    <li v-for="item in order.items" :key="item.id" class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-sm text-foreground">
                                <span class="mr-1.5 tabular-nums text-muted-foreground">{{ item.quantity }}x</span>
                                {{ item.itemName }}
                            </p>
                            <p v-if="item.specialInstructions" class="mt-1 text-xs italic text-muted-foreground">
                                {{ item.specialInstructions }}
                            </p>
                            <p v-for="option in item.orderItemOptions" :key="option.id"
                                class="mt-1 text-xs text-muted-foreground/80">
                                + {{ option.quantity }}x {{ option.name || 'Option' }}
                            </p>
                        </div>

                        <p class="shrink-0 text-sm tabular-nums text-muted-foreground">
                            $ {{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}
                        </p>
                    </li>
                </ul>

                <div class="mt-5 flex justify-end border-t border-border pt-5">
                    <NuxtLink :to="`/dashboard/cashier/takeaway/checkout/${order.id}`"
                        class="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors">
                        <span>Open checkout</span>
                        <i class="pi pi-arrow-right text-xs"></i>
                    </NuxtLink>
                </div>
            </article>
        </section>

        <section v-else class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <h2 class="text-xl font-semibold text-foreground">No unpaid takeaway orders</h2>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">
                Every takeaway order is already settled, or your search did not match any order.
            </p>
        </section>
    </main>
</template>
