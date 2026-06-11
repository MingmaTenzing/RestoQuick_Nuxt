<script setup lang="ts">
import type { OrderDetailsWithInclude } from '~~/types/orderwithInclude'

const props = defineProps<{
    open: boolean
    order: OrderDetailsWithInclude | null
}>()

const emit = defineEmits<{
    close: []
    saved: []
}>()

const toast = useToast()
const itemActionState = reactive<Record<string, boolean>>({})
const removedOptionIdsByItem = reactive<Record<string, string[]>>({})

const form = reactive({
    customerName: '',
    orderType: '',
    status: '',
    items: [] as Array<{
        id: string
        itemName: string
        quantity: number
        unitPriceCents: number
        options: Array<{
            id: string
            name: string
            quantity: number
            priceCents: number
        }>
    }>
})

const hasItemActionInProgress = computed(() => Object.values(itemActionState).some(Boolean))

watch(
    () => [props.open, props.order] as const,
    ([isOpen, order]) => {
        if (!isOpen || !order) return

        form.customerName = order.customerName ?? ''
        form.orderType = order.orderType
        form.status = order.status
        form.items = order.items.map((item) => ({
            id: item.id,
            itemName: item.itemName,
            quantity: item.quantity,
            unitPriceCents: item.unitPriceCents,
            options: item.orderItemOptions.map((option) => ({
                id: option.id,
                name: option.name,
                quantity: option.quantity,
                priceCents: option.priceCents,
            })),
        }))

        for (const key of Object.keys(removedOptionIdsByItem)) {
            delete removedOptionIdsByItem[key]
        }
    },
    { immediate: true }
)

function closeModal() {
    if (hasItemActionInProgress.value) return
    emit('close')
}

function removeOptionFromItem(itemId: string, optionId: string) {
    const item = form.items.find((entry) => entry.id === itemId)
    if (!item) return

    item.options = item.options.filter((entry) => entry.id !== optionId)
    if (!removedOptionIdsByItem[itemId]) {
        removedOptionIdsByItem[itemId] = []
    }
    removedOptionIdsByItem[itemId].push(optionId)
}

async function saveItemChanges(itemId: string) {
    if (!props.order || itemActionState[itemId]) return

    const item = form.items.find((entry) => entry.id === itemId)
    if (!item) return

    const optionIds = new Set<string>()
    const hasDuplicateOptions = item.options.some((option) => {
        if (optionIds.has(option.id)) return true
        optionIds.add(option.id)
        return false
    })

    if (hasDuplicateOptions) {
        toast.error({
            title: 'Duplicate options found for this item'
        })
        return
    }

    try {
        itemActionState[itemId] = true

        const response = await fetch(`/api/orders/${props.order.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    id: item.id,
                    quantity: Number(item.quantity),
                    removeOptionIds: removedOptionIdsByItem[item.id] ?? [],
                    options: item.options.map((option) => ({
                        id: option.id,
                        quantity: Number(option.quantity),
                    })),
                }],
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to update item')
        }

        removedOptionIdsByItem[item.id] = []
        toast.success({
            title: 'Item updated'
        })
        emit('saved')
    } catch {
        toast.error({
            title: 'Failed to update item'
        })
    } finally {
        itemActionState[itemId] = false
    }
}

async function removeOrderItem(itemId: string) {
    if (!props.order || itemActionState[itemId]) return

    try {
        itemActionState[itemId] = true

        const response = await fetch(`/api/orders/${props.order.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [
                    {
                        id: itemId,
                        remove: true,
                    },
                ],
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to remove order item')
        }

        form.items = form.items.filter((entry) => entry.id !== itemId)
        delete removedOptionIdsByItem[itemId]

        toast.success({
            title: 'Order item removed'
        })
        emit('saved')
    } catch {
        toast.error({
            title: 'Failed to remove order item'
        })
    } finally {
        itemActionState[itemId] = false
    }
}
</script>

<template>
    <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center p-4">
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
                            form.customerName }}</p>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Order Type</label>
                        <p class="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">{{
                            form.orderType }}</p>
                    </div>

                    <div class="space-y-1.5">
                        <label class="text-sm font-medium">Status</label>
                        <p class="w-full rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">{{ form.status
                            }}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <h4 class="text-sm font-semibold text-muted-foreground uppercase">Order Items and Options (Qty only)
                    </h4>

                    <div v-for="item in form.items" :key="item.id"
                        class="rounded-xl border border-border p-3 space-y-3">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <p class="font-semibold">{{ item.itemName }}</p>
                                <p class="text-xs text-muted-foreground">Unit price: {{ item.unitPriceCents }} cents</p>
                            </div>
                            <button type="button" @click="removeOrderItem(item.id)"
                                class="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 disabled:opacity-60"
                                :disabled="itemActionState[item.id]">
                                Remove Item
                            </button>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-12 gap-2">
                            <div class="md:col-span-3 space-y-1">
                                <label class="text-xs text-muted-foreground">Qty</label>
                                <input v-model.number="item.quantity" type="number" min="1"
                                    class="w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                            </div>
                            <div class="md:col-span-9 flex items-end justify-end">
                                <button type="button" @click="saveItemChanges(item.id)"
                                    class="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
                                    :disabled="itemActionState[item.id]">
                                    {{ itemActionState[item.id] ? 'Saving...' : 'Save Item Changes' }}
                                </button>
                            </div>
                        </div>

                        <div v-if="item.options.length" class="space-y-2">
                            <p class="text-xs font-semibold text-muted-foreground uppercase">Options</p>
                            <div v-for="option in item.options" :key="option.id"
                                class="grid grid-cols-1 md:grid-cols-12 gap-2 rounded-lg border border-border p-2">
                                <div class="md:col-span-5 space-y-1">
                                    <label class="text-xs text-muted-foreground">Name</label>
                                    <p class="w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm">{{
                                        option.name }}</p>
                                </div>
                                <div class="md:col-span-3 space-y-1">
                                    <label class="text-xs text-muted-foreground">Qty</label>
                                    <input v-model.number="option.quantity" type="number" min="1"
                                        class="w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30" />
                                </div>
                                <div class="md:col-span-3 space-y-1">
                                    <label class="text-xs text-muted-foreground">Price (cents)</label>
                                    <p class="w-full rounded-lg border border-border bg-muted/40 px-2.5 py-2 text-sm">{{
                                        option.priceCents }}</p>
                                </div>
                                <div class="md:col-span-1 flex items-end">
                                    <button type="button" @click="removeOptionFromItem(item.id, option.id)"
                                        class="w-full rounded-lg border border-red-500/30 px-2 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                                        :disabled="itemActionState[item.id]">
                                        X
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="closeModal"
                        class="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-accent"
                        :disabled="hasItemActionInProgress">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
