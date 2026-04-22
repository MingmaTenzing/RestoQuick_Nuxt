<script lang="ts" setup>
import type { PaymentMethod } from "~/generated/prisma/enums";
import type { CashierPaidOrder } from "~~/types/cashier";

definePageMeta({
    layout: "dashboard-layout"
})

const route = useRoute()
const orderId = computed(() => route.params.order_id?.toString() ?? "")

const { data: order, pending, error, refresh } = await useFetch<CashierPaidOrder>(
    () => `/api/orders/${orderId.value}`
)

const paymentMethod = ref<PaymentMethod>("CASH")
const isSubmitting = ref(false)
const paymentError = ref("")

const totalItems = computed(() => {
    return (order.value?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
})


async function closeSale() {
    if (!order.value || isSubmitting.value) {
        return
    }

    isSubmitting.value = true
    paymentError.value = ""

    try {
        order.value = await $fetch<CashierPaidOrder>('/api/orders/checkout/takeaway/closesales', {
            method: 'POST',
            body: {
                orderId: orderId.value,
                paymentMethod: paymentMethod.value,
            },
        })

        await refresh()
    } catch (error) {
        paymentError.value = error instanceof Error ? error.message : 'Unable to close sale.'
    } finally {
        isSubmitting.value = false
    }
}
function printReceipt() {
    window.print()
}
</script>


<template>
    <div v-if="order" class="print-receipt-root hidden print:block">
        <div class="mx-auto w-[80mm] space-y-3 bg-white px-4 py-6 font-mono text-[11px] leading-normal text-black">
            <div class="text-center">
                <p class="text-[13px] font-bold uppercase tracking-widest">RestoQuick</p>
                <p class="text-[10px] text-black/60">Takeaway Receipt</p>
            </div>

            <div class="space-y-1 border-y border-dashed border-black/30 py-2">
                <div class="flex justify-between">
                    <span>Order</span>
                    <span class="font-semibold">#{{ order.orderNo ?? 'Pending' }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Customer</span>
                    <span>{{ order.customerName || 'Walk-in' }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Created</span>
                    <NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short" year="numeric"
                        hour="2-digit" minute="2-digit" />
                </div>
            </div>

            <div class="space-y-3">
                <div v-for="item in order.items" :key="item.id">
                    <div class="flex justify-between font-semibold">
                        <span>{{ item.quantity }}x {{ item.itemName }}</span>
                        <span>${{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}</span>
                    </div>
                    <div v-if="item.specialInstructions" class="text-[10px] text-black/60">
                        {{ item.specialInstructions }}
                    </div>
                    <div v-for="option in item.orderItemOptions" :key="option.id"
                        class="pl-3 text-[10px] text-black/60">
                        + {{ option.quantity }}x {{ option.menuOption?.name ?? option.name ?? 'Option' }}
                    </div>
                </div>
            </div>

            <div class="space-y-1 border-y border-dashed border-black/30 py-2">
                <div class="flex justify-between">
                    <span>Items</span>
                    <span>{{ totalItems }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Status</span>
                    <span>{{ order.paymentStatus }}</span>
                </div>
                <div class="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${{ (order.totalAmountCents / 100).toFixed(2) }}</span>
                </div>
            </div>
        </div>
    </div>

    <main class="space-y-8 print:hidden">
        <div class="border-b border-border px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
            <div class="flex flex-wrap items-start justify-between gap-4">
                <div class="space-y-3">
                    <NuxtLink to="/dashboard/cashier/takeaway"
                        class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-opacity active:opacity-70">
                        <i class="pi pi-arrow-left text-xs"></i>
                        Back to takeaway queue
                    </NuxtLink>

                    <div class="space-y-2">
                        <div class="flex flex-wrap items-center gap-3">
                            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                Takeaway Order
                            </p>
                            <span v-if="order"
                                class="rounded-full border border-border bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground">
                                {{ order.paymentStatus }}
                            </span>
                        </div>

                        <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            Order #{{ order?.orderNo ?? '—' }}
                        </h1>

                        <p v-if="order" class="text-sm text-muted-foreground sm:text-base">
                            {{ order.customerName || 'Walk-in order' }}
                            <span aria-hidden="true"> · </span>
                            <NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short"
                                year="numeric" hour="2-digit" minute="2-digit" />
                        </p>
                    </div>
                </div>

                <button v-if="order" type="button"
                    class="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform active:scale-[0.98]"
                    @click="printReceipt">
                    <i class="pi pi-print text-sm"></i>
                    Print receipt
                </button>
            </div>
        </div>

        <div class="px-4 pb-8 sm:px-6 lg:px-10 lg:pb-10">
            <div v-if="pending" class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <div class="space-y-4">
                    <div v-for="index in 2" :key="index"
                        class="h-40 animate-pulse rounded-3xl border border-border bg-card"></div>
                </div>
                <div class="h-80 animate-pulse rounded-3xl border border-border bg-card"></div>
            </div>

            <div v-else-if="!order"
                class="rounded-4xl border border-dashed border-border bg-card px-6 py-20 text-center">
                <i class="pi pi-receipt text-4xl text-muted-foreground"></i>
                <p class="mt-4 text-lg font-semibold text-foreground">Order not found</p>
                <p class="mt-1 text-sm text-muted-foreground">
                    {{ error?.statusMessage || 'This takeaway order could not be loaded.' }}
                </p>
            </div>

            <div v-else class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <section class="rounded-3xl border border-border bg-card">
                    <div class="flex items-center justify-between gap-4 border-b border-border px-6 py-5">
                        <div>
                            <p class="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                                Order details
                            </p>
                            <h2 class="mt-1 text-lg font-semibold text-foreground">Items on this order</h2>
                        </div>
                        <span class="text-2xl font-semibold tabular-nums text-foreground">{{ totalItems }}</span>
                    </div>

                    <ul class="divide-y divide-border">
                        <li v-for="item in order.items" :key="item.id" class="px-6 py-5">
                            <div class="flex items-start justify-between gap-4">
                                <div class="min-w-0 flex-1">
                                    <p class="text-sm font-semibold text-foreground sm:text-base">
                                        <span class="mr-2 tabular-nums text-muted-foreground">{{ item.quantity
                                        }}×</span>
                                        {{ item.itemName }}
                                    </p>
                                    <p v-if="item.specialInstructions"
                                        class="mt-1 text-xs italic text-muted-foreground">
                                        {{ item.specialInstructions }}
                                    </p>
                                    <p v-for="option in item.orderItemOptions" :key="option.id"
                                        class="mt-1 text-[11px] text-muted-foreground/80">
                                        + {{ option.quantity }}× {{ option.menuOption?.name ?? option.name ?? 'Option'
                                        }}
                                    </p>
                                </div>

                                <p class="shrink-0 text-sm font-medium tabular-nums text-foreground">
                                    ${{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                <aside class="space-y-4">
                    <section class="rounded-4xl border border-border bg-card p-5 md:p-6">
                        <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Summary</p>
                        <h2 class="mt-1 text-xl font-medium tracking-tight text-foreground">Receipt overview</h2>

                        <div class="mt-5 space-y-3 rounded-3xl border border-border bg-secondary px-5 py-4">
                            <div class="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Customer</span>
                                <span class="font-medium text-foreground">{{ order.customerName || 'Walk-in' }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Items</span>
                                <span class="font-medium text-foreground">{{ totalItems }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Payment</span>
                                <span class="font-medium text-foreground">{{ order.paymentStatus }}</span>
                            </div>
                            <div class="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Method</span>
                                <span class="font-medium text-foreground">{{ paymentMethod === 'CARD_TERMINAL' ? 'Card'
                                    : 'Cash' }}</span>
                            </div>
                            <div class="border-t border-border pt-3">
                                <p class="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total
                                    due</p>
                                <p class="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                                    ${{ (order.totalAmountCents / 100).toFixed(2) }}
                                </p>
                            </div>
                        </div>

                        <div v-if="order.paymentStatus !== 'PAID'" class="mt-5 flex gap-2">
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

                        <button type="button" :disabled="isSubmitting || order.paymentStatus === 'PAID'"
                            class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-foreground transition-colors active:opacity-80"
                            @click="closeSale">
                            <i class="pi pi-check text-sm"></i>
                            <span>{{ isSubmitting ? 'Closing sale...' : order.paymentStatus === 'PAID' ? 'Sale Closed' :
                                'Close Sale' }}</span>
                        </button>

                        <p v-if="paymentError" class="mt-4 text-sm text-red-600 dark:text-red-400">
                            {{ paymentError }}
                        </p>
                    </section>
                </aside>
            </div>
        </div>
    </main>
</template>

<style scoped>
@media print {

    .print-receipt-root,
    .print-receipt-root * {
        visibility: visible;
    }

    .print-receipt-root {
        position: fixed;
        inset: 0;
        display: block !important;
        background: white;
        z-index: 9999;
    }

    .print-receipt-root>div {
        margin: 0 auto;
    }
}
</style>