<script lang="ts" setup>
import type { MenuCategory, MenuItem, Table } from '~/generated/prisma/browser'
import type Order_Cart_Item from '~~/types/order-cart'
import Pos_Filter_Bar from '~/components/pos_components/Pos_Filter_Bar.vue'
import Pos_Menu_Item_Card from '~/components/pos_components/Pos_Menu_Item_Card.vue'
import Pos_Order_Header from '~/components/pos_components/Pos_Order_Header.vue'
import Pos_Order_Sidebar from '~/components/pos_components/Pos_Order_Sidebar.vue'


const route = useRoute()
const routeTableId = computed(() => {
    const param = route.params.table_id
    return Array.isArray(param) ? param[0] ?? '' : param ?? ''
})

const searchQuery = ref('')
const selectedCategory = ref<MenuCategory | ''>('')
const isSubmittingOrder = ref(false)
const toast = useToast()

const { data: menuItems, pending: menuPending } = await useFetch<MenuItem[]>('/api/menu/order-menu')
const { data: menuCategories } = await useFetch<MenuCategory[]>('/api/menu/category')
const { data: table } = await useFetch<Table>(() => `/api/tables/${routeTableId.value}`)

const {
    cart_items,
    add_to_cart,
    increase_quantity,
    decrease_quantity,
    remove_from_cart,
    empty_cart,
} = useOrderCart()

const { table_id, set_table_id } = useTableId()

watch(
    routeTableId,
    (nextTableId) => {
        if (!nextTableId) {
            return
        }

        const activeTableId = Array.isArray(table_id.value) ? table_id.value[0] : table_id.value

        if (activeTableId && activeTableId !== nextTableId && cart_items.value.length > 0) {
            empty_cart()
        }

        set_table_id(nextTableId)
    },
    { immediate: true }
)

const availableCategories = computed(() => {
    if (menuCategories.value?.length) {
        return menuCategories.value
    }

    return [...new Set((menuItems.value ?? []).map((item) => item.category))] as MenuCategory[]
})

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

const totalItems = computed(() => cart_items.value.reduce((sum, item) => sum + item.quantity, 0))
const subtotalCents = computed(() => cart_items.value.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0))

const findCartItem = (menuItemId: string) => {
    return cart_items.value.find((item) => item.menuItemId === menuItemId)
}

const addMenuItem = (menuItem: MenuItem) => {
    const cartItem: Order_Cart_Item = {
        itemName: menuItem.name,
        quantity: 1,
        unitPrice: menuItem.priceCents,
        specialInstructions: '',
        image_url: menuItem.imageUrl,
        menuItemId: menuItem.id,
    }

    add_to_cart(cartItem)
}

const increaseMenuItem = (menuItem: MenuItem) => {
    const cartItem = findCartItem(menuItem.id)

    if (!cartItem) {
        addMenuItem(menuItem)
        return
    }

    increase_quantity(cartItem)
}

const decreaseMenuItem = (item: Order_Cart_Item | MenuItem) => {
    const menuItemId = 'menuItemId' in item ? item.menuItemId : item.id
    const cartItem = findCartItem(menuItemId)

    if (!cartItem) {
        return
    }

    if (cartItem.quantity <= 1) {
        remove_from_cart(cartItem)
        return
    }

    decrease_quantity(cartItem)
}

const submitOrder = async () => {
    if (!routeTableId.value || cart_items.value.length === 0) {
        return
    }

    isSubmittingOrder.value = true

    try {
        await $fetch('/api/orders', {
            method: 'POST',
            body: {
                cart_items: cart_items.value,
                table_id: routeTableId.value,
                customer_name: 'Walk-in',
            },
        })

        empty_cart()

        toast.success({
            title: 'Order sent to kitchen',
        })
    } catch (error) {
        console.log(error)
        toast.error({
            title: 'Failed to send order',
        })
    } finally {
        isSubmittingOrder.value = false
    }
}
</script>

<template>

        <section class=" flex p-6 gap-6 ">
            <div class="h-[95vh] overflow-y-scroll no-scrollbar">
                <div class="space-y-6 pb-2">
                    <Pos_Order_Header
                        :table="table"
                        :total-items="totalItems"
                        :subtotal-cents="subtotalCents"
                    />
                <Pos_Filter_Bar
                    :categories="availableCategories"
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

                    <div v-if="menuPending" class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
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
                            :quantity-in-cart="findCartItem(item.id)?.quantity ?? 0"
                            @add="addMenuItem(item)"
                            @increase="increaseMenuItem(item)"
                            @decrease="decreaseMenuItem(item)"
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

            <div class=" ">
                <Pos_Order_Sidebar
                    :table="table"
                    :cart-items="cart_items"
                    :total-items="totalItems"
                    :subtotal-cents="subtotalCents"
                    :is-submitting="isSubmittingOrder"
                    @increase="increase_quantity"
                    @decrease="decreaseMenuItem"
                    @remove="remove_from_cart"
                    @clear="empty_cart"
                    @submit="submitOrder"
                />
            </div>
        </section>
</template>