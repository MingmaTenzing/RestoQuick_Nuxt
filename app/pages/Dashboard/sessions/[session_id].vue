<script setup lang="ts">
import type { TableSessionWithOrders } from "~~/types/table_session_with_orders";

definePageMeta({
    layout: "dashboard-layout",
});

const route = useRoute();
const sessionId = computed(() => route.params.session_id?.toString() ?? "");

const { data: session, status, error } = await useFetch<TableSessionWithOrders>(
    () => `/api/table-sessions/${sessionId.value}`,
);

const orders = computed(() => session.value?.orders ?? []);

const itemCount = computed(() => {
    return orders.value.reduce((total, order) => total + order.items.length, 0);
});

const sessionTotalCents = computed(() => {
    return orders.value.reduce((total, order) => total + order.totalAmountCents, 0);
});
</script>

<template>
    <main class="space-y-5">
        <NuxtLink to="/dashboard/sessions"
            class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
            <i class="pi pi-arrow-left text-xs"></i>
            Back to sessions
        </NuxtLink>

        <section v-if="status === 'pending'" class="space-y-4">
            <div class="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div class="h-8 w-52 animate-pulse rounded-2xl bg-muted"></div>
                <div class="mt-3 h-4 w-72 animate-pulse rounded-2xl bg-muted"></div>
            </div>
            <div class="grid gap-3 sm:grid-cols-3">
                <div v-for="index in 3" :key="index"
                    class="h-24 rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div class="h-4 w-16 animate-pulse rounded-full bg-muted"></div>
                    <div class="mt-3 h-7 w-20 animate-pulse rounded-full bg-muted"></div>
                </div>
            </div>
        </section>

        <section v-else-if="error || !session"
            class="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <i class="pi pi-exclamation-circle mb-4 block text-4xl text-muted-foreground"></i>
            <h1 class="text-xl font-semibold text-foreground">Session not found</h1>
            <p class="mt-2 text-sm text-muted-foreground">This table session may have been removed or is unavailable.
            </p>
        </section>

        <template v-else>
            <section class="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
                <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div class="space-y-3">
                        <div class="flex flex-wrap items-center gap-2">
                            <span
                                class="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-sm font-medium text-foreground">
                                <i class="pi pi-table text-xs text-muted-foreground"></i>
                                Table {{ session.table.number }}
                            </span>
                            <span
                                class="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {{ session.status.toLowerCase() }}
                            </span>
                        </div>

                        <div>
                            <p class="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Session
                                details</p>
                            <h1 class="mt-1 text-3xl font-semibold text-foreground md:text-5xl">Table {{
                                session.table.number }}</h1>
                            <p v-if="session.status === 'ACTIVE'" class="mt-2 text-sm text-muted-foreground">
                                Open since
                                <NuxtTime :datetime="session.openedAt" relative />
                            </p>
                            <p v-else class="mt-2 text-sm text-muted-foreground">
                                Closed
                                <NuxtTime :datetime="session.closedAt ?? session.openedAt" relative />
                            </p>
                        </div>
                    </div>

                    <NuxtLink :to="`/dashboard/cashier/table/checkout/${session.id}`"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
                        <i class="pi pi-wallet"></i>
                        Checkout
                    </NuxtLink>
                </div>
            </section>

            <section class="grid gap-3 sm:grid-cols-3">
                <div class="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p class="text-sm text-muted-foreground">Items</p>
                    <p class="mt-1 text-2xl font-semibold text-foreground">{{ itemCount }}</p>
                </div>
                <div class="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p class="text-sm text-muted-foreground">Orders</p>
                    <p class="mt-1 text-2xl font-semibold text-foreground">{{ orders.length }}</p>
                </div>
                <div class="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <p class="text-sm text-muted-foreground">Total</p>
                    <p class="mt-1 break-all text-2xl font-semibold text-foreground">${{ (sessionTotalCents /
                        100).toFixed(2) }}</p>
                </div>
            </section>

            <section v-if="orders.length === 0"
                class="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
                <i class="pi pi-receipt mb-4 block text-4xl text-muted-foreground"></i>
                <h2 class="text-xl font-semibold text-foreground">No orders yet</h2>
                <p class="mt-2 text-sm text-muted-foreground">Orders placed during this session will appear here.</p>
            </section>

            <section v-else class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <NuxtLink v-for="order in orders" :key="order.id" :to="`/dashboard/orders/${order.id}`"
                    class="block border-b border-border p-5 transition hover:bg-accent/30 last:border-b-0 sm:p-6">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0 space-y-3">
                            <div class="flex flex-wrap items-center gap-2">
                                <span class="font-semibold text-foreground">Order #{{ order.orderNo }}</span>
                                <span
                                    class="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                    {{ order.status.toLowerCase() }}
                                </span>
                                <span
                                    class="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                    {{ order.paymentStatus.toLowerCase() }}
                                </span>
                            </div>
                            <p class="text-sm text-muted-foreground">
                                {{ order.customerName }} ·
                                <NuxtTime :datetime="order.createdAt" relative />
                            </p>
                        </div>
                        <p class="text-lg font-semibold text-foreground">${{ (order.totalAmountCents / 100).toFixed(2)
                        }}</p>
                    </div>

                    <ul class="mt-4 divide-y divide-border rounded-2xl border border-border bg-accent/20">
                        <li v-for="item in order.items" :key="item.id" class="px-3 py-2.5 text-sm">
                            <div class="flex items-start justify-between gap-3">
                                <span class="font-medium text-foreground">{{ item.menuItem?.name ?? 'Menu item removed'
                                }}</span>
                                <span class="shrink-0 text-muted-foreground">x{{ item.quantity }}</span>
                            </div>
                            <p v-if="item.orderItemOptions.length" class="mt-1 text-xs text-muted-foreground">
                                {{item.orderItemOptions.map((option) => option.menuOption?.name ??
                                    'Optionremoved').join(', ')}}
                            </p>
                        </li>
                    </ul>
                </NuxtLink>
            </section>
        </template>
    </main>
</template>