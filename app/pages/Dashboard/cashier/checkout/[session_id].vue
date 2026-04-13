<script setup lang="ts">
definePageMeta({ layout: "dashboard-layout" });

// ── Dummy data ────────────────────────────────────────────────────────────────
const session = {
    id: "sess_001",
    tableId: "tbl_01",
    status: "ACTIVE",
    openedAt: new Date("2026-04-13T18:30:00"),
    table: { number: "5", capacity: 4 },
    orders: [
        {
            id: "ord_1",
            orderNo: 101,
            status: "COMPLETED",
            paymentStatus: "UNPAID",
            customerName: "Alice",
            totalAmountCents: 4850,
            createdAt: new Date("2026-04-13T18:35:00"),
            items: [
                {
                    id: "item_1",
                    itemName: "Wagyu Burger",
                    quantity: 1,
                    unitPriceCents: 2800,
                    specialInstructions: "No onions",
                    orderItemOptions: [
                        { id: "opt_1", quantity: 1, menuOption: { name: "Extra cheese", priceCents: 300 } },
                    ],
                },
                {
                    id: "item_2",
                    itemName: "Sweet Potato Fries",
                    quantity: 1,
                    unitPriceCents: 900,
                    specialInstructions: null,
                    orderItemOptions: [],
                },
                {
                    id: "item_3",
                    itemName: "Lemonade",
                    quantity: 2,
                    unitPriceCents: 425,
                    specialInstructions: null,
                    orderItemOptions: [],
                },
            ],
        },
        {
            id: "ord_2",
            orderNo: 102,
            status: "COMPLETED",
            paymentStatus: "UNPAID",
            customerName: "Bob",
            totalAmountCents: 3200,
            createdAt: new Date("2026-04-13T19:05:00"),
            items: [
                {
                    id: "item_4",
                    itemName: "Grilled Salmon",
                    quantity: 1,
                    unitPriceCents: 3200,
                    specialInstructions: null,
                    orderItemOptions: [],
                },
            ],
        },
        {
            id: "ord_3",
            orderNo: 99,
            status: "PENDING",
            paymentStatus: "UNPAID",
            customerName: "Table",
            totalAmountCents: 1200,
            createdAt: new Date("2026-04-13T19:20:00"),
            items: [
                {
                    id: "item_5",
                    itemName: "Sparkling Water x2",
                    quantity: 2,
                    unitPriceCents: 600,
                    specialInstructions: null,
                    orderItemOptions: [],
                },
            ],
        },
    ],
};

const allOrders = computed(() => session.orders);
const payableOrders = computed(() =>
    allOrders.value.filter((o) => o.status === "COMPLETED" && o.paymentStatus === "UNPAID")
);
const payableTotalCents = computed(() =>
    payableOrders.value.reduce((s, o) => s + o.totalAmountCents, 0)
);

const paymentMethod = ref<"CASH" | "CARD_TERMINAL">("CASH");
const tenderedInput = ref("");
const tenderedCents = computed(() => {
    const n = parseFloat(tenderedInput.value);
    return isNaN(n) ? 0 : Math.round(n * 100);
});
const changeDueCents = computed(() =>
    paymentMethod.value === "CASH" ? Math.max(tenderedCents.value - payableTotalCents.value, 0) : 0
);

const isSubmitting = ref(false);
const receipt = ref<null | {
    totalPaidCents: number;
    paidAt: Date;
    paymentMethod: "CASH" | "CARD_TERMINAL";
    tenderedCents: number;
    changeDueCents: number;
    orders: typeof session.orders;
}>(null);

const canPay = computed(() => {
    if (!payableOrders.value.length) return false;
    if (paymentMethod.value === "CARD_TERMINAL") return true;
    return tenderedCents.value >= payableTotalCents.value;
});

function addQuick(cents: number) {
    tenderedInput.value = ((tenderedCents.value + cents) / 100).toFixed(2);
}

function fmt(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
}

function fmtDate(v: Date | string | null | undefined) {
    if (!v) return "—";
    return new Date(v).toLocaleString("en-AU", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

function statusChip(status: string) {
    const map: Record<string, string> = {
        COMPLETED: "bg-emerald-500/10 text-emerald-600",
        PENDING: "bg-amber-500/10 text-amber-600",
        PREPARING: "bg-blue-500/10 text-blue-600",
        CANCELLED: "bg-red-500/10 text-red-600",
    };
    return map[status] ?? "text-muted-foreground";
}

function settle() {
    if (!canPay.value || isSubmitting.value) return;
    isSubmitting.value = true;
    setTimeout(() => {
        receipt.value = {
            totalPaidCents: payableTotalCents.value,
            paidAt: new Date(),
            paymentMethod: paymentMethod.value,
            tenderedCents: paymentMethod.value === "CASH" ? tenderedCents.value : payableTotalCents.value,
            changeDueCents: changeDueCents.value,
            orders: payableOrders.value,
        };
        tenderedInput.value = "";
        isSubmitting.value = false;
    }, 800);
}

function printReceipt() {
    window.print();
}

const sessionError = "";
const status = ref<"idle" | "pending" | "success" | "error">("success");
</script>

<template>
    <!-- ---- PRINT-ONLY RECEIPT ---------------------------------------- -->
    <div v-if="receipt" class="hidden print:block">
        <div class="mx-auto w-[80mm] space-y-3 bg-white px-4 py-6 font-mono text-[11px] leading-[1.45] text-black">
            <div class="text-center">
                <p class="text-[13px] font-bold uppercase tracking-widest">RestoQuick</p>
                <p class="text-[10px] text-black/60">Cashier Receipt</p>
            </div>

            <div class="border-y border-dashed border-black/30 py-2 space-y-1">
                <div class="flex justify-between">
                    <span>Table</span>
                    <span class="font-semibold">{{ session?.table.number }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Opened</span>
                    <span>{{ fmtDate(session?.openedAt) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Paid at</span>
                    <span>{{ fmtDate(receipt.paidAt) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Method</span>
                    <span>{{ receipt.paymentMethod === "CASH" ? "Cash" : "Card Terminal" }}</span>
                </div>
            </div>

            <div class="space-y-3">
                <template v-for="order in receipt.orders" :key="order.id">
                    <div>
                        <div class="flex justify-between font-semibold">
                            <span>Order #{{ order.orderNo }}</span>
                            <span>{{ fmt(order.totalAmountCents) }}</span>
                        </div>
                        <div v-for="item in order.items" :key="item.id" class="pl-2 mt-1">
                            <div class="flex justify-between">
                                <span>{{ item.quantity }}x {{ item.itemName }}</span>
                                <span>{{ fmt(item.unitPriceCents * item.quantity) }}</span>
                            </div>
                            <div v-for="opt in item.orderItemOptions" :key="opt.id" class="pl-3 text-black/60">
                                + {{ opt.quantity }}x {{ opt.menuOption?.name }}
                            </div>
                        </div>
                    </div>
                </template>
            </div>

            <div class="border-y border-dashed border-black/30 py-2 space-y-1">
                <div class="flex justify-between font-semibold">
                    <span>Total</span><span>{{ fmt(receipt.totalPaidCents) }}</span>
                </div>
                <template v-if="receipt.paymentMethod === 'CASH'">
                    <div class="flex justify-between">
                        <span>Tendered</span><span>{{ fmt(receipt.tenderedCents) }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>Change</span><span>{{ fmt(receipt.changeDueCents) }}</span>
                    </div>
                </template>
            </div>

            <p class="text-center text-[10px] text-black/50">Thank you for dining with us!</p>
        </div>
    </div>

    <!-- ---- SCREEN UI -------------------------------------------------- -->
    <div class="print:hidden">
        <!-- Back + Header -->
        <div class="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div class="space-y-2">
                <NuxtLink to="/dashboard/cashier"
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                    <i class="pi pi-arrow-left text-xs"></i> Back to tables
                </NuxtLink>
                <div class="flex flex-wrap items-center gap-3">
                    <h1 class="text-3xl font-semibold tracking-tight text-foreground">
                        Table {{ session?.table.number ?? "—" }}
                    </h1>
                    <span
                        class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-emerald-600">
                        Active session
                    </span>
                </div>
                <p class="text-sm text-muted-foreground">
                    Opened {{ fmtDate(session?.openedAt) }}
                    <span v-if="session?.table.capacity"> · Capacity {{ session.table.capacity }}</span>
                </p>
            </div>

            <!-- receipt print button (only after settling) -->
            <button v-if="receipt" type="button" @click="printReceipt"
                class="inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent">
                <i class="pi pi-print text-sm"></i> Print receipt
            </button>
        </div>

        <!-- Loading skeleton -->
        <div v-if="status === 'pending'" class="grid gap-6 xl:grid-cols-[1fr_380px]">
            <div class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-40 animate-pulse rounded-3xl border border-border bg-card"></div>
            </div>
            <div class="h-96 animate-pulse rounded-3xl border border-border bg-card"></div>
        </div>

        <!-- No session -->
        <div v-else-if="!session" class="rounded-4xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <i class="pi pi-receipt text-4xl text-muted-foreground"></i>
            <p class="mt-4 text-lg font-semibold text-foreground">No active session</p>
            <p class="mt-1 text-sm text-muted-foreground">
                {{ sessionError || "This session may have already beenclosed" }}</p>
            <NuxtLink to="/dashboard/cashier"
                class="mt-6 inline-flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                <i class="pi pi-arrow-left text-xs"></i> Back to tables
            </NuxtLink>
        </div>

        <!-- Main layout: orders left, payment right -->
        <div v-else class="grid gap-6 xl:grid-cols-[1fr_380px]">

            <!-- LEFT: Orders list -->
            <div class="space-y-4">
                <div class="rounded-3xl border border-border bg-card">
                    <div class="flex items-center justify-between gap-4 px-6 py-5">
                        <div>
                            <p class="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Session
                                orders</p>
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
                            <!-- Order row header -->
                            <div class="flex flex-wrap items-start justify-between gap-2">
                                <div class="flex flex-wrap items-center gap-2">
                                    <p class="text-sm font-semibold text-foreground">Order #{{ order.orderNo }}</p>
                                    <span class="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                        :class="statusChip(order.status)">
                                        {{ order.status.charAt(0) + order.status.slice(1).toLowerCase() }}
                                    </span>
                                    <span v-if="order.paymentStatus === 'PAID'"
                                        class="rounded-full px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                                        · Paid
                                    </span>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-semibold text-foreground">{{ fmt(order.totalAmountCents) }}
                                    </p>
                                    <p class="text-[11px] text-muted-foreground">{{ order.customerName }} · {{
                                        fmtDate(order.createdAt) }}</p>
                                </div>
                            </div>

                            <!-- Items: flat list with separator lines -->
                            <ul class="mt-3 space-y-0 divide-y divide-border/50">
                                <li v-for="item in order.items" :key="item.id"
                                    class="flex items-start justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                                    <div class="min-w-0">
                                        <p class="text-sm text-foreground">
                                            <span class="mr-1.5 tabular-nums text-muted-foreground">{{ item.quantity
                                            }}×</span>{{ item.itemName }}
                                        </p>
                                        <p v-if="item.specialInstructions"
                                            class="mt-0.5 text-xs italic text-muted-foreground">
                                            {{ item.specialInstructions }}
                                        </p>
                                        <p v-for="opt in item.orderItemOptions" :key="opt.id"
                                            class="mt-0.5 text-[11px] text-muted-foreground/70">
                                            + {{ opt.quantity }}× {{ opt.menuOption?.name ?? "Option" }}
                                        </p>
                                    </div>
                                    <p class="shrink-0 text-sm tabular-nums text-muted-foreground">
                                        {{ fmt(item.unitPriceCents * item.quantity) }}
                                    </p>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- RIGHT: Payment panel -->
            <div class="space-y-4">
                <div class="rounded-4xl border border-border bg-card p-5 md:p-6">
                    <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Payment</p>
                    <h2 class="mt-1 text-xl font-semibold tracking-tight text-foreground">Collect payment</h2>

                    <!-- Balance due -->
                    <div class="mt-5 rounded-3xl border border-border bg-background px-5 py-4 shadow-sm">
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Balance due</p>
                        <p class="mt-1 text-4xl font-semibold tracking-tight text-foreground">{{ fmt(payableTotalCents)
                        }}
                        </p>
                        <p class="mt-1 text-sm text-muted-foreground">
                            {{ payableOrders.length }} payable order{{ payableOrders.length !== 1 ? "s" : "" }}
                        </p>
                    </div>

                    <!-- Payment method toggle -->
                    <div class="mt-5 flex gap-2">
                        <button type="button"
                            class="flex-1 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors"
                            :class="paymentMethod === 'CASH' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-accent'"
                            @click="paymentMethod = 'CASH'">
                            <i class="pi pi-money-bill mr-1.5 text-sm"></i> Cash
                        </button>
                        <button type="button"
                            class="flex-1 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors"
                            :class="paymentMethod === 'CARD_TERMINAL' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-foreground hover:bg-accent'"
                            @click="paymentMethod = 'CARD_TERMINAL'">
                            <i class="pi pi-credit-card mr-1.5 text-sm"></i> Card
                        </button>
                    </div>

                    <!-- Cash calculator -->
                    <div v-if="paymentMethod === 'CASH'" class="mt-5 space-y-4">
                        <label class="block space-y-1.5">
                            <span class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tendered
                                amount</span>
                            <input v-model="tenderedInput" type="number" min="0" step="0.01" inputmode="decimal"
                                placeholder="0.00"
                                class="h-12 w-full rounded-2xl border border-border bg-background px-4 text-lg font-semibold text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20" />
                        </label>

                        <!-- Quick-add buttons -->
                        <div class="grid grid-cols-4 gap-2">
                            <button v-for="quick in [1000, 2000, 5000, 10000]" :key="quick" type="button"
                                class="rounded-2xl border border-border bg-background py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                                @click="addQuick(quick)">
                                +{{ fmt(quick) }}
                            </button>
                        </div>

                        <!-- Change due -->
                        <div class="rounded-3xl border border-border bg-background px-4 py-3.5 shadow-sm">
                            <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Change due
                            </p>
                            <p class="mt-1 text-2xl font-semibold"
                                :class="tenderedCents >= payableTotalCents && payableTotalCents > 0 ? 'text-emerald-600' : 'text-foreground'">
                                {{ fmt(changeDueCents) }}
                            </p>
                        </div>
                    </div>

                    <!-- Card info -->
                    <div v-else
                        class="mt-5 rounded-3xl border border-border bg-background px-4 py-4 text-sm text-muted-foreground">
                        Present the EFTPOS terminal to the customer. Confirm payment, then record it below.
                    </div>

                    <!-- Settle button -->
                    <button type="button" :disabled="!canPay || isSubmitting"
                        class="mt-5 w-full rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        @click="settle">
                        <span v-if="isSubmitting">Processing…</span>
                        <span v-else-if="!payableOrders.length">No payable orders</span>
                        <span v-else>Mark {{ payableOrders.length }} order{{ payableOrders.length !== 1 ? "s" : "" }} as
                            paid</span>
                    </button>

                    <!-- After payment: print -->
                    <div v-if="receipt"
                        class="mt-4 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-center">
                        <p class="text-sm font-semibold text-emerald-700">Payment recorded successfully</p>
                        <p class="mt-0.5 text-xs text-emerald-600">{{ fmt(receipt.totalPaidCents) }} · {{
                            receipt.paymentMethod === "CASH" ? "Cash" : "Card terminal" }}</p>
                        <button type="button" @click="printReceipt"
                            class="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-white/60 px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-white/90">
                            <i class="pi pi-print text-sm"></i> Print receipt
                        </button>
                    </div>
                </div>


            </div>

        </div>
    </div>
</template>
