<script setup lang="ts">
import { computed, ref } from "vue";
import type { Booking, Staff, Table } from "~/generated/prisma/client";
import type { OrderDetailsWithInclude } from "~~/types/orderwithInclude";

definePageMeta({
    layout: "dashboard-layout",
});

type DashboardRange = "all" | "day" | "week" | "month";

const selected_range = ref<DashboardRange>("week");

const { data: orders, status: orders_loading } = await useFetch<OrderDetailsWithInclude[]>(
    "/api/orders",
    {
        query: computed(() => ({
            range: selected_range.value,
        })),
        watch: [selected_range],
        lazy: true,
    }
);

const { data: bookings, status: bookings_loading } = await useFetch<Booking[]>("/api/bookings", {
    lazy: true,
});

const { data: staff, status: staff_loading } = await useFetch<Staff[]>("/api/staff", {
    lazy: true,
});

const { data: tables, status: tables_loading } = await useFetch<Table[]>("/api/tables", {
    lazy: true,
});

const selected_range_label = computed(() => {
    if (selected_range.value === "all") return "All Time";
    if (selected_range.value === "day") return "Today";
    if (selected_range.value === "week") return "This Week";
    return "This Month";
});

const is_loading = computed(
    () =>
        orders_loading.value === "pending" ||
        bookings_loading.value === "pending" ||
        staff_loading.value === "pending" ||
        tables_loading.value === "pending"
);

const total_orders = computed(() => orders.value?.length ?? 0);

const total_revenue_cents = computed(() =>
    (orders.value ?? []).reduce((sum, order) => sum + order.totalAmountCents, 0)
);

const completed_orders = computed(
    () => (orders.value ?? []).filter((order) => order.status === "COMPLETED").length
);

const pending_orders = computed(
    () => (orders.value ?? []).filter((order) => order.status === "PENDING").length
);

const cancelled_orders = computed(
    () => (orders.value ?? []).filter((order) => order.status === "CANCELLED").length
);

const completion_rate = computed(() => {
    if (!total_orders.value) return 0;
    return Math.round((completed_orders.value / total_orders.value) * 100);
});

const average_order_value_cents = computed(() => {
    if (!total_orders.value) return 0;
    return Math.round(total_revenue_cents.value / total_orders.value);
});

const today_bookings_count = computed(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const date = today.getDate();

    return (bookings.value ?? []).filter((booking) => {
        const booking_date = new Date(booking.bookingTime);
        return (
            booking_date.getFullYear() === year &&
            booking_date.getMonth() === month &&
            booking_date.getDate() === date
        );
    }).length;
});

const active_bookings_count = computed(
    () =>
        (bookings.value ?? []).filter((booking) =>
            ["PENDING", "CONFIRMED", "SEATED"].includes(booking.status)
        ).length
);

const seating_capacity = computed(() =>
    (tables.value ?? []).reduce((sum, table) => sum + table.capacity, 0)
);

const total_staff = computed(() => staff.value?.length ?? 0);

const booking_status_counts = computed(() => {
    const base: Record<string, number> = {
        PENDING: 0,
        CONFIRMED: 0,
        SEATED: 0,
        COMPLETED: 0,
        CANCELLED: 0,
        NO_SHOW: 0,
    };

    for (const booking of bookings.value ?? []) {
        base[booking.status] = (base[booking.status] ?? 0) + 1;
    }

    return base;
});

const max_booking_status_count = computed(() => Math.max(...Object.values(booking_status_counts.value), 1));

const order_status_counts = computed(() => {
    const base: Record<string, number> = {
        PENDING: pending_orders.value,
        COMPLETED: completed_orders.value,
        CANCELLED: cancelled_orders.value,
    };

    return base;
});

const max_order_status_count = computed(() => Math.max(...Object.values(order_status_counts.value), 1));

const top_selling_items = computed(() => {
    const item_map = new Map<string, { name: string; quantity: number }>();

    for (const order of orders.value ?? []) {
        for (const item of order.items) {
            const item_name = item.menuItem?.name ?? item.itemName;
            const existing = item_map.get(item_name);

            if (existing) {
                existing.quantity += item.quantity;
            } else {
                item_map.set(item_name, {
                    name: item_name,
                    quantity: item.quantity,
                });
            }
        }
    }

    return Array.from(item_map.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
});

const recent_orders = computed(() => (orders.value ?? []).slice(0, 6));

function formatCurrency(cents: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(cents / 100);
}

function formatDateTime(date: Date | string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(date));
}
</script>

<template>
    <div class="space-y-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
                <h1 class="text-2xl md:text-6xl">Dashboard</h1>
                <p class="text-muted-foreground">Restaurant analytics and operational overview</p>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
                <span class="text-sm text-muted-foreground">Range:</span>
                <button
                    @click="selected_range = 'all'"
                    :class="selected_range === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                    class="rounded-md border px-3 py-1.5 text-sm transition-colors"
                >
                    All
                </button>
                <button
                    @click="selected_range = 'day'"
                    :class="selected_range === 'day' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                    class="rounded-md border px-3 py-1.5 text-sm transition-colors"
                >
                    Day
                </button>
                <button
                    @click="selected_range = 'week'"
                    :class="selected_range === 'week' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                    class="rounded-md border px-3 py-1.5 text-sm transition-colors"
                >
                    Week
                </button>
                <button
                    @click="selected_range = 'month'"
                    :class="selected_range === 'month' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                    class="rounded-md border px-3 py-1.5 text-sm transition-colors"
                >
                    Month
                </button>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="border rounded-lg shadow p-6 border-border bg-card text-card-foreground h-42.5 flex flex-col justify-between">
                <span class="font-light text-muted-foreground">Total Revenue</span>
                <div class="space-y-1">
                    <span v-if="is_loading" class="w-36 h-10 bg-muted-foreground/20 animate-pulse rounded-lg block"></span>
                    <span v-else class="text-2xl md:text-4xl font-medium">{{ formatCurrency(total_revenue_cents) }}</span>
                    <span class="text-muted-foreground font-light text-sm">{{ selected_range_label }}</span>
                </div>
            </div>

            <div class="border rounded-lg shadow p-6 border-border bg-card text-card-foreground h-42.5 flex flex-col justify-between">
                <span class="font-light text-muted-foreground">Orders</span>
                <div class="space-y-1">
                    <span v-if="is_loading" class="w-20 h-10 bg-muted-foreground/20 animate-pulse rounded-lg block"></span>
                    <span v-else class="text-2xl md:text-4xl font-medium">{{ total_orders }}</span>
                    <span class="text-muted-foreground font-light text-sm">{{ completion_rate }}% completed</span>
                </div>
            </div>

            <div class="border rounded-lg shadow p-6 border-border bg-card text-card-foreground h-42.5 flex flex-col justify-between">
                <span class="font-light text-muted-foreground">Average Order Value</span>
                <div class="space-y-1">
                    <span v-if="is_loading" class="w-28 h-10 bg-muted-foreground/20 animate-pulse rounded-lg block"></span>
                    <span v-else class="text-2xl md:text-4xl font-medium">{{ formatCurrency(average_order_value_cents) }}</span>
                    <span class="text-muted-foreground font-light text-sm">Per order</span>
                </div>
            </div>

            <div class="border rounded-lg shadow p-6 border-border bg-card text-card-foreground h-42.5 flex flex-col justify-between">
                <span class="font-light text-muted-foreground">Active Bookings</span>
                <div class="space-y-1">
                    <span v-if="is_loading" class="w-20 h-10 bg-muted-foreground/20 animate-pulse rounded-lg block"></span>
                    <span v-else class="text-2xl md:text-4xl font-medium">{{ active_bookings_count }}</span>
                    <span class="text-muted-foreground font-light text-sm">{{ today_bookings_count }} today</span>
                </div>
            </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div class="border rounded-lg p-4 border-border bg-card text-card-foreground">
                <p class="text-xs text-muted-foreground uppercase tracking-wide">Staff Members</p>
                <p class="text-2xl font-medium mt-2">{{ total_staff }}</p>
            </div>
            <div class="border rounded-lg p-4 border-border bg-card text-card-foreground">
                <p class="text-xs text-muted-foreground uppercase tracking-wide">Tables</p>
                <p class="text-2xl font-medium mt-2">{{ tables?.length ?? 0 }}</p>
            </div>
            <div class="border rounded-lg p-4 border-border bg-card text-card-foreground">
                <p class="text-xs text-muted-foreground uppercase tracking-wide">Total Seating Capacity</p>
                <p class="text-2xl font-medium mt-2">{{ seating_capacity }}</p>
            </div>
            <div class="border rounded-lg p-4 border-border bg-card text-card-foreground">
                <p class="text-xs text-muted-foreground uppercase tracking-wide">Pending Orders</p>
                <p class="text-2xl font-medium mt-2">{{ pending_orders }}</p>
            </div>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
            <section class="border rounded-lg p-5 border-border bg-card text-card-foreground">
                <h2 class="text-lg font-medium">Order Status</h2>
                <p class="text-sm text-muted-foreground mb-4">Current distribution for {{ selected_range_label.toLowerCase() }}</p>

                <div class="space-y-3">
                    <div v-for="(count, status_name) in order_status_counts" :key="status_name" class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>{{ status_name }}</span>
                            <span class="text-muted-foreground">{{ count }}</span>
                        </div>
                        <div class="h-2 w-full rounded bg-muted-foreground/20 overflow-hidden">
                            <div
                                class="h-full bg-primary rounded"
                                :style="{ width: `${(count / max_order_status_count) * 100}%` }"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border rounded-lg p-5 border-border bg-card text-card-foreground">
                <h2 class="text-lg font-medium">Booking Status</h2>
                <p class="text-sm text-muted-foreground mb-4">Reservation pipeline overview</p>

                <div class="space-y-3">
                    <div v-for="(count, status_name) in booking_status_counts" :key="status_name" class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span>{{ status_name }}</span>
                            <span class="text-muted-foreground">{{ count }}</span>
                        </div>
                        <div class="h-2 w-full rounded bg-muted-foreground/20 overflow-hidden">
                            <div
                                class="h-full bg-primary rounded"
                                :style="{ width: `${(count / max_booking_status_count) * 100}%` }"
                            ></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div class="grid gap-4 xl:grid-cols-2">
            <section class="border rounded-lg p-5 border-border bg-card text-card-foreground">
                <h2 class="text-lg font-medium">Top Selling Items</h2>
                <p class="text-sm text-muted-foreground mb-4">Most ordered menu items</p>

                <div v-if="top_selling_items.length === 0" class="text-sm text-muted-foreground">No order items yet.</div>

                <div v-else class="space-y-3">
                    <div
                        v-for="(item, index) in top_selling_items"
                        :key="item.name"
                        class="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"
                    >
                        <div class="flex items-center gap-3">
                            <span class="text-muted-foreground text-sm">#{{ index + 1 }}</span>
                            <span>{{ item.name }}</span>
                        </div>
                        <span class="text-sm text-muted-foreground">{{ item.quantity }} sold</span>
                    </div>
                </div>
            </section>

            <section class="border rounded-lg p-5 border-border bg-card text-card-foreground">
                <h2 class="text-lg font-medium">Recent Orders</h2>
                <p class="text-sm text-muted-foreground mb-4">Latest order activity</p>

                <div v-if="recent_orders.length === 0" class="text-sm text-muted-foreground">No orders found.</div>

                <div v-else class="space-y-3">
                    <div
                        v-for="order in recent_orders"
                        :key="order.id"
                        class="border border-border rounded-md p-3 flex justify-between gap-3"
                    >
                        <div>
                            <p class="font-medium">#{{ order.orderNo }} · {{ order.customerName }}</p>
                            <p class="text-xs text-muted-foreground">{{ formatDateTime(order.createdAt) }}</p>
                        </div>
                        <div class="text-right">
                            <p class="font-medium">{{ formatCurrency(order.totalAmountCents) }}</p>
                            <p class="text-xs text-muted-foreground">{{ order.status }}</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>