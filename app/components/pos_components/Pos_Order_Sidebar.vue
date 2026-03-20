<script setup lang="ts">
import type { Table } from '~/generated/prisma/browser'
import type Order_Cart_Item from '~~/types/order-cart'

const props = defineProps<{
    table: Table | null | undefined
    cartItems: Order_Cart_Item[]
    totalItems: number
    subtotalCents: number
    isSubmitting: boolean
    serviceLabel?: string
}>()

const emit = defineEmits<{
    (e: 'increase', item: Order_Cart_Item): void
    (e: 'decrease', item: Order_Cart_Item): void
    (e: 'remove', item: Order_Cart_Item): void
    (e: 'clear'): void
    (e: 'submit'): void
}>()

const orderHeading = computed(() => props.serviceLabel ?? `Table ${props.table?.number ?? '--'}`)

const emptyStateCopy = computed(() => props.serviceLabel
    ? 'Add dishes from the menu to build the current takeaway order.'
    : 'Add dishes from the menu to build the current table order.')
</script>

<template>
    <aside class="w-90 h-[95vh]">
        <section class="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div class="border-b border-border p-4">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Order cart</p>
                        <h2 class="mt-1 text-xl font-semibold text-foreground">{{ orderHeading }}</h2>
                        <p class="mt-1 text-sm text-muted-foreground">Live order for the current service.</p>
                    </div>

                    <span class="rounded-full bg-accent px-3 py-1 text-sm font-medium text-foreground">
                        {{ totalItems }} items
                    </span>
                </div>
            </div>

            <div v-if="cartItems.length" class="flex-1 min-h-0 overflow-y-auto  px-4 py-4 md:px-5">
                <div class="space-y-3">
                    <article
                        v-for="item in cartItems"
                        :key="item.menuItemId"
                        class="rounded-2xl border border-border bg-background p-3"
                    >
                        <div class="flex items-start gap-2.5">
                            <NuxtImg
                                v-if="item.image_url"
                                :src="item.image_url"
                                width="96"
                                height="96"
                                class="h-16 w-16 rounded-xl object-cover"
                            />
                            <div v-else class="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent text-[11px] text-muted-foreground">
                                No image
                            </div>
    
                            <div class="min-w-0 flex-1 space-y-2">
                                <div class="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 class="text-sm font-semibold leading-tight text-foreground">{{ item.itemName }}</h3>
                                        <p class="text-xs text-muted-foreground">${{ (item.unitPrice / 100).toFixed(2) }} each</p>
                                    </div>
    
                                    <button
                                        type="button"
                                        class="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-destructive"
                                        @click="emit('remove', item)"
                                    >
                                        <i class="pi pi-trash text-xs"></i>
                                    </button>
                                </div>
    
                                <p v-if="item.specialInstructions" class="text-xs leading-5 text-muted-foreground">
                                    {{ item.specialInstructions }}
                                </p>

                                <div v-if="item.selected_options.length" class="space-y-1">
                                    <p
                                        v-for="option in item.selected_options"
                                        :key="option.id"
                                        class="text-xs text-muted-foreground"
                                    >
                                        {{ option.quantity }}x {{ option.name }}
                                    </p>
                                </div>
    
                                <div class="flex items-center justify-between gap-2">
                                    <div class="flex items-center gap-1.5 rounded-full border border-border bg-card p-0.5">
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
                                            @click="emit('decrease', item)"
                                        >
                                            <i class="pi pi-minus text-xs"></i>
                                        </button>
                                        <span class="min-w-5 text-center text-xs font-semibold text-foreground">{{ item.quantity }}</span>
                                        <button
                                            type="button"
                                            class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                                            @click="emit('increase', item)"
                                        >
                                            <i class="pi pi-plus text-xs"></i>
                                        </button>
                                    </div>
    
                                    <p class="text-sm font-semibold text-foreground">${{ ((item.unitPrice * item.quantity) / 100).toFixed(2) }}</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            <div v-else class="flex flex-1 min-h-0 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-foreground">
                    <i class="pi pi-shopping-cart text-xl"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-foreground">No items in the order yet</h3>
                    <p class="mt-2 text-sm leading-6 text-muted-foreground">
                        {{ emptyStateCopy }}
                    </p>
                </div>
            </div>


            <div class="border-t border-border p-4">
                <div class="space-y-2 rounded-2xl bg-background p-3">
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

                <div class="mt-3 grid gap-2">
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