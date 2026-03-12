<script setup lang="ts">
import type { Table } from '~/generated/prisma/browser'
import type Order_Cart_Item from '~~/types/order-cart'

defineProps<{
    table: Table | null | undefined
    cartItems: Order_Cart_Item[]
    totalItems: number
    subtotalCents: number
    isSubmitting: boolean
}>()

const emit = defineEmits<{
    (e: 'increase', item: Order_Cart_Item): void
    (e: 'decrease', item: Order_Cart_Item): void
    (e: 'remove', item: Order_Cart_Item): void
    (e: 'clear'): void
    (e: 'submit'): void
}>()
</script>

<template>
    <aside class="h-[calc(100vh-5.5rem)] min-w-[400px]">
        <section class="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div class="border-b border-border px-5 py-5 md:px-6">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Order cart</p>
                        <h2 class="mt-1 text-xl font-semibold text-foreground">Table {{ table?.number ?? '--' }}</h2>
                        <p class="mt-1 text-sm text-muted-foreground">Live order for the current service.</p>
                    </div>

                    <span class="rounded-full bg-accent px-3 py-1 text-sm font-medium text-foreground">
                        {{ totalItems }} items
                    </span>
                </div>
            </div>

            <div v-if="cartItems.length" class="flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5">
                <article
                    v-for="item in cartItems"
                    :key="item.menuItemId"
                    class="rounded-2xl border border-border bg-background p-4"
                >
                    <div class="flex items-start gap-3">
                        <NuxtImg
                            v-if="item.image_url"
                            :src="item.image_url"
                            width="96"
                            height="96"
                            class="h-20 w-20 rounded-2xl object-cover"
                        />
                        <div v-else class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-accent text-xs text-muted-foreground">
                            No image
                        </div>

                        <div class="min-w-0 flex-1 space-y-3">
                            <div class="flex items-start justify-between gap-3">
                                <div>
                                    <h3 class="text-sm font-semibold text-foreground md:text-base">{{ item.itemName }}</h3>
                                    <p class="text-sm text-muted-foreground">${{ (item.unitPrice / 100).toFixed(2) }} each</p>
                                </div>

                                <button
                                    type="button"
                                    class="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                                    @click="emit('remove', item)"
                                >
                                    <i class="pi pi-trash text-sm"></i>
                                </button>
                            </div>

                            <p v-if="item.specialInstructions" class="text-sm leading-6 text-muted-foreground">
                                {{ item.specialInstructions }}
                            </p>

                            <div class="flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2 rounded-full border border-border bg-card p-1">
                                    <button
                                        type="button"
                                        class="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
                                        @click="emit('decrease', item)"
                                    >
                                        <i class="pi pi-minus text-xs"></i>
                                    </button>
                                    <span class="min-w-6 text-center text-sm font-semibold text-foreground">{{ item.quantity }}</span>
                                    <button
                                        type="button"
                                        class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                                        @click="emit('increase', item)"
                                    >
                                        <i class="pi pi-plus text-xs"></i>
                                    </button>
                                </div>

                                <p class="text-base font-semibold text-foreground">${{ ((item.unitPrice * item.quantity) / 100).toFixed(2) }}</p>
                            </div>
                        </div>
                    </div>
                </article>
            </div>

            <div v-else class="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-foreground">
                    <i class="pi pi-shopping-cart text-xl"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-foreground">No items in the order yet</h3>
                    <p class="mt-2 text-sm leading-6 text-muted-foreground">
                        Add dishes from the menu to build the current table order.
                    </p>
                </div>
            </div>

            <div class="border-t border-border px-5 py-5 md:px-6">
                <div class="space-y-3 rounded-2xl bg-background p-4">
                    <div class="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Items</span>
                        <span>{{ totalItems }}</span>
                    </div>
                    <div class="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Tax</span>
                        <span>$0.00</span>
                    </div>
                    <div class="flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-foreground">
                        <span>Total</span>
                        <span>${{ (subtotalCents / 100).toFixed(2) }}</span>
                    </div>
                </div>

                <div class="mt-4 grid gap-3">
                    <button
                        type="button"
                        class="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="cartItems.length === 0 || isSubmitting"
                        @click="emit('submit')"
                    >
                        <i v-if="isSubmitting" class="pi pi-spin pi-spinner text-sm"></i>
                        <span>{{ isSubmitting ? 'Sending order...' : 'Send order to kitchen' }}</span>
                    </button>

                    <button
                        type="button"
                        class="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="cartItems.length === 0 || isSubmitting"
                        @click="emit('clear')"
                    >
                        Clear order
                    </button>
                </div>
            </div>
        </section>
    </aside>
</template>