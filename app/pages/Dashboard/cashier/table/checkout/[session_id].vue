<script setup lang="ts">
import CashierTableCheckoutSkeleton from "~/components/cashier_components/CashierTableCheckoutSkeleton.vue";
import type { PaymentMethod } from "~/generated/prisma/enums";
import type { TableSessionWithOrders } from "~~/types/table_session_with_orders";

definePageMeta({ layout: "dashboard-layout" });


const route = useRoute();
const sessionId = computed(() => route.params.session_id?.toString() ?? "");

const { data: session, status, error: sessionError, refresh } = await useFetch<TableSessionWithOrders>(
    () => `/api/table-sessions/${sessionId.value}`,

);



const statusClasses: Record<string, string> = {
    COMPLETED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
};

const quickAmounts = [10, 20, 50, 100];
const paymentMethod = ref<PaymentMethod>("CASH");
const tenderedAmount = ref<number | null>(null);
const isSubmitting = ref(false);
const paymentError = ref("");

const allOrders = computed(() => session.value?.orders ?? []);
const payableOrders = computed(() =>
    allOrders.value.filter((order) => order.paymentStatus === "UNPAID")
);
const sessionTotalCents = computed(() =>
    allOrders.value.reduce((total, order) => total + order.totalAmountCents, 0)
);
const payableTotalCents = computed(() =>
    payableOrders.value.reduce((total, order) => total + order.totalAmountCents, 0)
);
const tenderedCents = computed(() => Math.round((tenderedAmount.value ?? 0) * 100));
const changeDueCents = computed(() =>
    paymentMethod.value === "CASH" ? Math.max(tenderedCents.value - payableTotalCents.value, 0) : 0
);
const canPay = computed(() => {
    if (!payableOrders.value.length) {
        return false;
    }

    if (paymentMethod.value === "CARD_TERMINAL") {
        return true;
    }

    return tenderedCents.value >= payableTotalCents.value;
});

function addQuickAmount(amount: number) {
    tenderedAmount.value = Number(((tenderedAmount.value ?? 0) + amount).toFixed(2));
}

async function settle() {
    if (!session.value || !canPay.value || isSubmitting.value) {
        return;
    }

    isSubmitting.value = true;
    paymentError.value = "";

    try {
        await $fetch("/api/orders/checkout/table/mark-paid", {
            method: "POST",
            body: {
                tableSessionId: sessionId.value,
                orderIds: payableOrders.value.map((order) => order.id),
                paymentMethod: paymentMethod.value,
            },
        });

        tenderedAmount.value = null;
        await refresh();
    } catch (error) {
        paymentError.value = error instanceof Error ? error.message : "Unable to record payment.";
    } finally {
        isSubmitting.value = false;
    }
}

function printReceipt() {
    window.print();
}
</script>

<template>
    <div v-if="session" class="print-receipt-root hidden print:block">
        <div class="mx-auto w-[80mm] space-y-3 bg-white px-4 py-6 font-mono text-[11px] leading-[1.45] text-black">
            <div class="text-center">
                <p class="text-[13px] font-bold uppercase tracking-widest">RestoQuick</p>
                <p class="text-[10px] text-black/60">Table Session Receipt</p>
            </div>

            <div class="space-y-1 border-y border-dashed border-black/30 py-2">
                <div class="flex justify-between">
                    <span>Table</span>
                    <span class="font-semibold">{{ session.table.number }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Session</span>
                    <span>{{ session.status }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Opened</span>
                    <NuxtTime :datetime="session.openedAt" locale="en-AU" day="2-digit" month="short" year="numeric"
                        hour="2-digit" minute="2-digit" />
                </div>
            </div>

            <div class="space-y-3">
                <template v-for="order in allOrders" :key="order.id">
                    <div>
                        <div class="flex justify-between font-semibold">
                            <span>Order #{{ order.orderNo }}</span>
                            <span>${{ (order.totalAmountCents / 100).toFixed(2) }}</span>
                        </div>
                        <div class="flex justify-between text-[10px] text-black/60">
                            <span>{{ order.customerName }}</span>
                            <span>{{ order.paymentStatus }}</span>
                        </div>
                        <div v-for="item in order.items" :key="item.id" class="mt-1 pl-2">
                            <div class="flex justify-between">
                                <span>{{ item.quantity }}x {{ item.itemName }}</span>
                                <span>${{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}</span>
                            </div>
                            <div v-for="option in item.orderItemOptions" :key="option.id" class="pl-3 text-black/60">
                                + {{ option.quantity }}x {{ option.menuOption?.name ?? "Option" }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="space-y-1 border-y border-dashed border-black/30 py-2">
                <div class="flex justify-between font-semibold">
                    <span>Session total</span>
                    <span>${{ (sessionTotalCents / 100).toFixed(2) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Outstanding</span>
                    <span>${{ (payableTotalCents / 100).toFixed(2) }}</span>
                </div>
            </div>
        </div>
    </div>

    <main class="space-y-6 print:hidden">
        <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-4">
                <NuxtLink to="/dashboard/cashier"
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <i class="pi pi-arrow-left text-xs"></i>
                    Back to tables
                </NuxtLink>

                <div class="flex flex-wrap items-center gap-3">
                    <h1 class="text-2xl md:text-5xl">Table {{ session?.table.number ?? "—" }}</h1>
                    <span v-if="session"
                        class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                        {{ session.status.toLowerCase() }} session
                    </span>
                </div>

                <p v-if="session" class="text-sm text-muted-foreground">
                    Opened
                    <NuxtTime :datetime="session.openedAt" locale="en-AU" day="2-digit" month="short" year="numeric"
                        hour="2-digit" minute="2-digit" />
                    <span v-if="session.table.capacity"> · Capacity {{ session.table.capacity }}</span>
                </p>
            </div>

            <button v-if="session" type="button"
                class="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent"
                @click="printReceipt">
                <i class="pi pi-print text-sm"></i>
                Print receipt
            </button>
        </div>

        <CashierTableCheckoutSkeleton v-if="status === 'pending'" />

        <div v-else-if="!session" class="rounded-4xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <i class="pi pi-receipt text-4xl text-muted-foreground"></i>
            <p class="mt-4 text-lg font-semibold text-foreground">No active session</p>
            <p class="mt-1 text-sm text-muted-foreground">
                {{ sessionError?.statusMessage || "This session may have already been closed." }}
            </p>
            <NuxtLink to="/dashboard/cashier"
                class="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                <i class="pi pi-arrow-left text-xs"></i>
                Back to tables
            </NuxtLink>
        </div>

        <div v-else class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div class="space-y-4">
                <section class="rounded-3xl border border-border bg-card">
                    <div class="flex items-center justify-between gap-4 px-6 py-5">
                        <div>
                            <p class="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                Session orders
                            </p>
                            <h2 class="mt-0.5 text-lg font-semibold text-foreground">All orders in this session</h2>
                        </div>
                        <span class="text-2xl font-semibold tabular-nums text-foreground">{{ allOrders.length }}</span>
                    </div>

                    <div v-if="!allOrders.length" class="px-6 pb-10 pt-4 text-center">
                        <i class="pi pi-inbox text-2xl text-muted-foreground/50"></i>
                        <p class="mt-3 text-sm text-muted-foreground">No orders in this session yet</p>
                    </div>

                    <ul v-else class="divide-y divide-border px-0">
                        <li v-for="order in allOrders" :key="order.id" class="px-6 py-5">
                            <div class="flex flex-wrap items-start justify-between gap-2">
                                <div class="flex flex-wrap items-center gap-2">
                                    <p class="text-sm font-semibold text-foreground">Order #{{ order.orderNo }}</p>
                                    <span class="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                        :class="statusClasses[order.status] || 'text-muted-foreground'">
                                        {{ order.status.charAt(0) + order.status.slice(1).toLowerCase() }}
                                    </span>
                                    <span v-if="order.paymentStatus === 'PAID'"
                                        class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                                        Paid
                                    </span>
                                </div>

                                <div class="text-right">
                                    <p class="text-sm font-semibold text-foreground">
                                        $ {{ (order.totalAmountCents / 100) }}
                                    </p>
                                    <p class="text-[11px] text-muted-foreground">
                                        {{ order.customerName }}
                                        <span aria-hidden="true"> · </span>
                                        <NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short"
                                            hour="2-digit" minute="2-digit" />
                                    </p>
                                </div>
                            </div>

                            <ul class="mt-3 space-y-0 divide-y divide-border/50">
                                <li v-for="item in order.items" :key="item.id"
                                    class="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                                    <div class="min-w-0">
                                        <p class="text-sm text-foreground">
                                            <span class="mr-1.5 tabular-nums text-muted-foreground">
                                                {{ item.quantity }}×
                                            </span>
                                            {{ item.itemName }}
                                        </p>
                                        <p v-if="item.specialInstructions"
                                            class="mt-0.5 text-xs italic text-muted-foreground">
                                            {{ item.specialInstructions }}
                                        </p>
                                        <p v-for="option in item.orderItemOptions" :key="option.id"
                                            class="mt-0.5 text-[11px] text-muted-foreground/70">
                                            + {{ option.quantity }}× {{ option.menuOption?.name ?? "Option" }}
                                        </p>
                                    </div>

                                    <p class="shrink-0 text-sm tabular-nums text-muted-foreground">
                                        ${{ ((item.unitPriceCents * item.quantity) / 100) }}
                                    </p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </section>
            </div>

            <div class="space-y-4">
                <section class="rounded-4xl border border-border bg-card p-5 md:p-6">
                    <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment</p>
                    <h2 class="mt-1 text-xl font-medium tracking-tight text-foreground/70">Collect payment</h2>

                    <div class="mt-5 rounded-3xl border border-border bg-secondary px-5 py-4 shadow-sm">
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Balance due</p>
                        <p class="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                            $ {{ (payableTotalCents / 100) }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ payableOrders.length }} payable order{{ payableOrders.length !== 1 ? "s" : "" }}
                        </p>
                    </div>

                    <div class="mt-5 flex gap-2">
                        <button type="button"
                            class="flex-1 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors"
                            :class="paymentMethod === 'CASH'
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-secondary text-foreground hover:bg-accent'"
                            @click="paymentMethod = 'CASH'">
                            <i class="pi pi-money-bill mr-1.5 text-sm"></i>
                            Cash
                        </button>
                        <button type="button"
                            class="flex-1 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors"
                            :class="paymentMethod === 'CARD_TERMINAL'
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border bg-secondary text-foreground hover:bg-accent'"
                            @click="paymentMethod = 'CARD_TERMINAL'">
                            <i class="pi pi-credit-card mr-1.5 text-sm"></i>
                            Card
                        </button>
                    </div>

                    <div v-if="paymentMethod === 'CASH'" class="mt-5 space-y-4">
                        <label class="block space-y-1.5">
                            <span class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Tendered amount
                            </span>
                            <input v-model.number="tenderedAmount" type="number" min="0" step="0.01" inputmode="decimal"
                                placeholder="0.00"
                                class="h-12 w-full rounded-2xl border border-border bg-secondary px-4 text-lg font-semibold text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
                        </label>

                        <div class="grid grid-cols-4 gap-2">
                            <button v-for="amount in quickAmounts" :key="amount" type="button"
                                class="rounded-2xl border border-border bg-secondary py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                @click="addQuickAmount(amount)">
                                +{{ amount }}
                            </button>
                        </div>

                        <div class="rounded-3xl border border-border bg-secondary px-4 py-3.5 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Change due
                            </p>
                            <p class="mt-1 text-2xl font-semibold" :class="tenderedCents >= payableTotalCents && payableTotalCents > 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-foreground'">
                                $ {{ (changeDueCents / 100) }}
                            </p>
                        </div>
                    </div>

                    <div v-else
                        class="mt-5 rounded-3xl border border-border bg-secondary px-4 py-4 text-sm text-muted-foreground">
                        Present the EFTPOS terminal to the customer. Confirm payment, then record it below.
                    </div>

                    <p v-if="paymentError" class="mt-4 text-sm text-red-600 dark:text-red-400">
                        {{ paymentError }}
                    </p>

                    <button type="button" :disabled="!canPay || isSubmitting"
                        class="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="settle">
                        <i v-if="isSubmitting" class="pi pi-spinner animate-spin text-sm"></i>
                        <span>{{ isSubmitting ? "Closing sales..." : "Close Sales" }}</span>
                    </button>

                </section>
            </div>
        </div>
    </main>
</template>

<style>
@page {
    size: 80mm auto;
    margin: 0;
}

@media print {

    html,
    body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }

    body * {
        visibility: hidden !important;
    }

    .print-receipt-root,
    .print-receipt-root * {
        visibility: visible !important;
    }

    .print-receipt-root {
        position: absolute;
        left: 0;
        top: 0;
        display: block !important;
        width: 80mm;
        min-width: 80mm;
        max-width: 80mm;
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
    }

    .print-receipt-root>div {
        margin: 0 !important;
        box-shadow: none !important;
    }
}
</style>
