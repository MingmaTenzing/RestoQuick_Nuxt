<script lang="ts" setup>
import type { MenuCategory, Table } from '~/generated/prisma/browser'
import type { MenuItemWithOptions } from '~~/types/menu'
import type Order_Cart_Item from '~~/types/order-cart'
import Pos_Filter_Bar from '~/components/pos_components/Pos_Filter_Bar.vue'
import Pos_Menu_Item_Card from '~/components/pos_components/Pos_Menu_Item_Card.vue'
import Pos_Order_Header from '~/components/pos_components/Pos_Order_Header.vue'
import Pos_Order_Sidebar from '~/components/pos_components/Pos_Order_Sidebar.vue'



// here the table_id from the route param can be an actual table_id or can be takeaway.. 


const route = useRoute()
const routeTableId = computed(() => String(route.params.table_id ?? ''))
const isTakeawayOrder = computed(() => routeTableId.value === 'takeaway')
const table = ref<Table | null>(null)
const serviceLabel = computed(() => isTakeawayOrder.value ? 'Takeaway' : undefined)
const backTo = computed(() => isTakeawayOrder.value ? '/dashboard/pos' : '/dashboard/pos/tables')
const backLabel = computed(() => isTakeawayOrder.value ? 'Back to POS' : 'Back to tables')

const searchQuery = ref('')
const selectedCategory = ref<MenuCategory | ''>('')
const isSubmittingOrder = ref(false)
const toast = useToast()
const {
    cart_items,
    quantity_for_menu_item,
    subtotal_cents,
    total_item_count,
    add_to_cart,
    remove_from_cart,
    increase_quantity,
    decrease_quantity,
    empty_cart,
} = useOrderCart()



const { data: menuItems, pending: menuPending } = await useFetch<MenuItemWithOptions[]>('/api/menu')
const { data: menuCategories } = await useFetch<MenuCategory[]>('/api/menu/category')

const loadTable = async () => {
    if (isTakeawayOrder.value) {
        table.value = null
        return
    }

    table.value = await $fetch<Table>(`/api/tables/${routeTableId.value}`)
}



const filteredMenuItems = computed(() => {
    const normalizedSearch = searchQuery.value.trim().toLowerCase()

    return (menuItems.value ?? []).filter((item) => {
        const matchesCategory = selectedCategory.value ? item.category === selectedCategory.value : true
        const matchesSearch = normalizedSearch
            ? item.name.toLowerCase().includes(normalizedSearch) || (item.description?.toLowerCase().includes(normalizedSearch) ?? false)
            : true

        return matchesCategory && matchesSearch
    })
})


const submitOrder = async (payload?: { customerName?: string }) => {
    if (!routeTableId.value || cart_items.value.length === 0) {
        return
    }

    isSubmittingOrder.value = true

    try {
        const mappedOrderItems = cart_items.value.map((item) => ({
            itemName: item.itemName,
            quantity: item.quantity,
            unitPriceCents: item.unitPrice,
            specialInstructions: item.specialInstructions || '',
            menuItemId: item.menuItemId,
            orderItemOptions: item.selected_options && item.selected_options.length ? {
                create: item.selected_options.map((opt) => ({
                    name: opt.name,
                    priceCents: opt.priceCents,
                    quantity: opt.quantity,
                    menuOptionId: opt.id,
                })),
            } : undefined,
        }))

        const endpoint = isTakeawayOrder.value ? '/api/orders/pos/takeaway' : '/api/orders/pos/dining'

        const customerNameToSend = isTakeawayOrder.value
            ? (payload?.customerName && payload.customerName.trim() !== '' ? payload.customerName.trim() : 'Takeaway')
            : 'Walk_in'

        await $fetch(endpoint, {
            method: 'POST',
            body: {
                data: {
                    customerName: customerNameToSend,
                    totalAmountCents: subtotal_cents.value,
                    ...(!isTakeawayOrder.value ? { tableId: routeTableId.value } : {}),
                    items: {
                        create: mappedOrderItems,
                    },
                },
            },
        })

        empty_cart()

        toast.success({
            title: isTakeawayOrder.value ? 'Takeaway order sent to kitchen' : 'Order sent to kitchen',
        })
    } catch (error) {
        toast.error({
            title: 'Failed to send order',
        })
    } finally {
        isSubmittingOrder.value = false
    }
}


watch(routeTableId, async () => {
    cart_items.value = []

    await loadTable()
}, { immediate: true })
</script>

<template>

        <section class=" flex p-4 gap-4 ">
            <div class="flex-1 h-[95vh] overflow-y-scroll no-scrollbar">
                <div class="space-y-6 pb-2">

                    <Pos_Order_Header
                        :table="table"
                        :total-items="total_item_count"
                        :subtotal-cents="subtotal_cents"
                        :service-label="serviceLabel"
                        :back-to="backTo"
                        :back-label="backLabel"
                    />
                <Pos_Filter_Bar
                    :categories="menuCategories!"
                    :search-query="searchQuery"
                    :selected-category="selectedCategory"
                    @search-change="searchQuery = $event"
                    @category-change="selectedCategory = $event"
                />

                <section class="space-y-3">
                    <div class="flex items-end justify-between px-1">
                        <div>
                            <p class="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">Live menu</p>
                            <h2 class="mt-1 text-lg font-semibold text-foreground">Tap items to build the order</h2>
                        </div>
                        <p class="text-sm text-muted-foreground">{{ filteredMenuItems.length }} results</p>
                    </div>

                    <div v-if="menuPending" class="grid gap-3 md:grid-cols-3 2xl:grid-cols-3">
                        <div
                            v-for="index in 6"
                            :key="index"
                            class="h-64 animate-pulse rounded-3xl border border-border bg-card"
                        ></div>
                    </div>

                    <div v-else-if="filteredMenuItems.length" class="grid gap-3 md:grid-cols-3 2xl:grid-cols-3">
                        <Pos_Menu_Item_Card
                            v-for="item in filteredMenuItems"
                            :key="item.id"
                            :item="item"
                            :quantity-in-cart="quantity_for_menu_item(item.id)"
                            @add="add_to_cart"
                        />
                    </div>

                    <div v-else class="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
                        <h3 class="text-xl font-semibold text-foreground">No menu items match the current filters</h3>
                        <p class="mt-2 text-sm leading-6 text-muted-foreground">
                            Try another category or clear the search to bring the full service menu back.
                        </p>
                    </div>
                </section>
                </div>
            </div>

    <div class=" h-full">
        <Pos_Order_Sidebar
            :table="table"
            :cart-items="cart_items"
            :total-items="total_item_count"
            :subtotal-cents="subtotal_cents"
            :is-submitting="isSubmittingOrder"
            :service-label="serviceLabel"
            @increase="increase_quantity"
            @decrease="decrease_quantity"
            @remove="remove_from_cart"
            @clear="empty_cart"
            @submit="submitOrder"
        />
   

    </div>

        </section>
</template>