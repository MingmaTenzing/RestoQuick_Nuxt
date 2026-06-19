<script setup lang="ts">
import { OrderStatus } from '~/generated/prisma/enums'
import type { OrderDetailsWithInclude } from '~~/types/orderwithInclude'

const props = defineProps<{
    open: boolean
    order: OrderDetailsWithInclude | null
}>()

const emit = defineEmits<{
    close: []
}>()

const toast = useToast()
const itemQuantities = reactive<Record<string, number>>({})
const itemSpecialInstructions = reactive<Record<string, string>>({})
const optionQuantities = reactive<Record<string, number>>({})
const selectedOrderStatus = ref<OrderStatus>()
const availableStatuses = Object.values(OrderStatus) as OrderStatus[]

watch(
    () => props.order,
    (order) => {
        if (!order) return

        selectedOrderStatus.value = order.status

        for (const item of order.items) {
            itemQuantities[item.id] = item.quantity
            itemSpecialInstructions[item.id] = item.specialInstructions ?? ''

            for (const option of item.orderItemOptions) {
                optionQuantities[option.id] = option.quantity
            }
        }
    },
    { immediate: true }
)

function closeModal() {
    emit('close')
}

async function removeOrderItem(itemId: string) {
    await $fetch(`/api/orders/items/${itemId}`, {
        method: 'DELETE',
    })
    toast.success({ title: 'Order item removed' })
}

async function saveOrderItemQuantity(itemId: string) {
    await $fetch(`/api/orders/items/${itemId}/quantity`, {
        method: 'PATCH',
        body: {
            quantity: itemQuantities[itemId],
        },
    })
    toast.success({ title: 'Item quantity updated' })
}

async function saveOrderItemSpecialInstructions(itemId: string) {
    await $fetch(`/api/orders/items/${itemId}/special-instructions`, {
        method: 'PATCH',
        body: {
            specialInstructions: itemSpecialInstructions[itemId],
        },
    })
    toast.success({ title: 'Special instructions updated' })
}

async function saveOptionQuantity(itemId: string, optionId: string) {
    await $fetch(`/api/orders/items/${itemId}/options/${optionId}/quantity`, {
        method: 'PATCH',
        body: {
            quantity: optionQuantities[optionId],
        },
    })
    toast.success({ title: 'Option quantity updated' })
}

async function removeOptionFromItem(itemId: string, optionId: string) {
    await $fetch(`/api/orders/items/${itemId}/options/${optionId}`, {
        method: 'DELETE',
    })
    toast.success({ title: 'Option removed' })
}

async function saveOrderStatus() {
    if (!props.order || !selectedOrderStatus.value) return

    await $fetch(`/api/orders/${props.order.id}/status`, {
        method: 'PATCH',
        body: {
            status: selectedOrderStatus.value,
        },
    })
    toast.success({ title: 'Order status updated' })
}
</script>

<template>
    <div v-if="open && order" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button type="button" @click="closeModal" class="absolute inset-0 bg-black/40"
            aria-label="Close edit order modal"></button>

        <div
            class="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-primary">Edit Order</h3>
                <button type="button" @click="closeModal"
                    class="h-8 w-8 rounded-md border border-border hover:bg-accent">
                    <i class="pi pi-times text-sm"></i>
                </button>
            </div>

            <div class="space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div class="space-y-1.5 md:col-span-1">
                        <label class="text-sm font-medium">Customer Name</label>
                        <p class="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">{{
                            order.customerName ?? 'Guest' }}</p>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Order Type</label>
                        <p class="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">{{
                            order.orderType }}</p>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Status</label>
                        <div class="flex gap-2">
                            <select v-model="selectedOrderStatus"
                                class="min-w-0 flex-1 rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30">
                                <option v-for="statusOption in availableStatuses" :key="statusOption"
                                    :value="statusOption">
                                    {{ statusOption }}
                                </option>
                            </select>
                            <button type="button" @click="saveOrderStatus"
                                class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                                Save
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-muted-foreground uppercase">Order Items and Options</h4>

                    <div v-for="item in order.items" :key="item.id"
                        class="rounded-xl border border-border p-3 space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="font-semibold">{{ item.itemName }}</p>
                            </div>
                            <button type="button" @click="removeOrderItem(item.id)"
                                class="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-60">
                                Remove Item
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
                            <div class="md:col-span-5 space-y-1">
                                <label class="text-xs text-muted-foreground">Qty</label>
                                <div class="flex gap-2">
                                    <input v-model.number="itemQuantities[item.id]" type="number" min="1"
                                        class="min-w-0 flex-1 rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                                    <button type="button" @click="saveOrderItemQuantity(item.id)"
                                        class="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="space-y-1">
                            <label class="text-xs text-muted-foreground">Special Instructions</label>
                            <div class="flex flex-col gap-2 md:flex-row md:items-start">
                                <textarea v-model="itemSpecialInstructions[item.id]" rows="2"
                                    class="min-w-0 flex-1 resize-none rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"></textarea>
                                <button type="button" @click="saveOrderItemSpecialInstructions(item.id)"
                                    class="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                                    Save
                                </button>
                            </div>
                        </div>

                        <div v-if="item.orderItemOptions.length" class="space-y-2">
                            <p class="text-xs font-semibold text-muted-foreground uppercase">Options</p>
                            <div v-for="option in item.orderItemOptions" :key="option.id"
                                class="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-lg border border-border p-2">
                                <div class="md:col-span-5 space-y-1">
                                    <label class="text-xs text-muted-foreground">Name</label>
                                    <p class="w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm">{{
                                        option.name }}</p>
                                </div>
                                <div class="md:col-span-4 space-y-1">
                                    <label class="text-xs text-muted-foreground">Qty</label>
                                    <div class="flex gap-2">
                                        <input v-model.number="optionQuantities[option.id]" type="number" min="1"
                                            class="min-w-0 flex-1 rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                                        <button type="button" @click="saveOptionQuantity(item.id, option.id)"
                                            class="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
                                            Save
                                        </button>
                                    </div>
                                </div>
                                <div class="md:col-span-1 flex items-end">
                                    <button type="button" @click="removeOptionFromItem(item.id, option.id)"
                                        class="w-full rounded-lg border border-red-500/30 px-2 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-60">
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="closeModal"
                        class="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
