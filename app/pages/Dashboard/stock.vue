<script setup lang="ts">
import { ref, computed } from 'vue'
import AddStockDialog from '~/components/stock_components/AddStockDialog.vue'
import RestockDialog from '~/components/stock_components/RestockDialog.vue'
import StockEmptyState from '~/components/stock_components/StockEmptyState.vue'
import StockFilterBar from '~/components/stock_components/StockFilterBar.vue'
import type { StockItem } from '~/components/stock_components/StockItemCard.vue'
import StockItemCard from '~/components/stock_components/StockItemCard.vue'
import StockStatsCard from '~/components/stock_components/StockStatsCard.vue'

definePageMeta({
  layout: 'dashboard-layout'
})

const stockItems = ref<StockItem[]>([
  {
    id: '1',
    name: 'Olive Oil',
    category: 'ingredients',
    currentStock: 5,
    unit: 'liters',
    reorderLevel: 10,
    reorderQuantity: 20,
    supplier: 'Premium Oils Inc',
    lastRestocked: '2026-02-01'
  },
  {
    id: '2',
    name: 'Tomato Sauce',
    category: 'ingredients',
    currentStock: 15,
    unit: 'cans',
    reorderLevel: 20,
    reorderQuantity: 50,
    supplier: 'Fresh Foods Co',
    lastRestocked: '2026-01-28'
  },
  {
    id: '3',
    name: 'Cola',
    category: 'beverages',
    currentStock: 8,
    unit: 'bottles',
    reorderLevel: 15,
    reorderQuantity: 30,
    supplier: 'Beverage Distributors',
    lastRestocked: '2026-01-30'
  },
  {
    id: '4',
    name: 'Paper Napkins',
    category: 'supplies',
    currentStock: 25,
    unit: 'packs',
    reorderLevel: 10,
    reorderQuantity: 40,
    supplier: 'Supply Hub',
    lastRestocked: '2026-02-02'
  },
  {
    id: '5',
    name: 'Flour',
    category: 'ingredients',
    currentStock: 3,
    unit: 'kg',
    reorderLevel: 10,
    reorderQuantity: 25,
    supplier: 'Premium Oils Inc',
    lastRestocked: '2026-01-25'
  },
])

const filter = ref<'all' | 'low' | 'ingredients' | 'beverages' | 'supplies'>('all')
const searchQuery = ref('')
const isAddDialogOpen = ref(false)
const isRestockDialogOpen = ref(false)
const selectedItem = ref<StockItem | null>(null)

const isLowStock = (item: StockItem) => item.currentStock <= item.reorderLevel

const filteredItems = computed(() => {
  return stockItems.value.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    if (filter.value === 'all') return matchesSearch
    if (filter.value === 'low') return matchesSearch && isLowStock(item)
    return matchesSearch && item.category === filter.value
  })
})

const lowStockCount = computed(() => stockItems.value.filter(isLowStock).length)
const totalItems = computed(() => stockItems.value.length)
const totalValue = computed(() => stockItems.value.reduce((sum, item) => sum + item.currentStock, 0))

const filterOptions = computed(() => [
  { value: 'all', label: 'All Items' },
  { value: 'low', label: 'Low Stock', count: lowStockCount.value },
  { value: 'ingredients', label: 'Ingredients' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'supplies', label: 'Supplies' },
])

const updateStock = (id: string, change: number) => {
  const item = stockItems.value.find(i => i.id === id)
  if (item) {
    item.currentStock = Math.max(0, item.currentStock + change)
    item.lastRestocked = new Date().toISOString().split('T')[0] || ''
  }
}

const openRestockDialog = (item: StockItem) => {
  selectedItem.value = item
  isRestockDialogOpen.value = true
}

const handleRestock = (id: string, quantity: number) => {
  updateStock(id, quantity)
  isRestockDialogOpen.value = false
  selectedItem.value = null
}

const handleAddItem = (itemData: Omit<StockItem, 'id' | 'lastRestocked'>) => {
  const newItem: StockItem = {
    id: `s${Date.now()}`,
    ...itemData,
    lastRestocked: new Date().toISOString().split('T')[0] || '',
  }
  stockItems.value.push(newItem)
  isAddDialogOpen.value = false
}
</script>

<template>
  <div class="space-y-6 p-6 min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Stock Management</h1>
        <p class="text-muted-foreground mt-1">Track inventory levels and manage supplies</p>
      </div>
      <button
        @click="isAddDialogOpen = true"
        class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2"
      >
        <i class="pi pi-plus" />
        Add Item
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-4">
      <StockStatsCard
        title="Total Items"
        :value="totalItems"
        description="In inventory"
        icon="pi pi-box"
      />
      <StockStatsCard
        title="Low Stock Items"
        :value="lowStockCount"
        description="Need reordering"
        icon="pi pi-exclamation-triangle"
        icon-color="text-yellow-600"
      />
      <StockStatsCard
        title="Stock Units"
        :value="totalValue"
        description="Total units in stock"
        icon="pi pi-chart-line"
      />
      <StockStatsCard
        title="Categories"
        :value="4"
        description="Item categories"
        icon="pi pi-shopping-cart"
      />
    </div>

    <!-- Search & Filters -->
    <StockFilterBar
      v-model="filter"
      v-model:search-query="searchQuery"
      :filters="filterOptions"
    />

    <!-- Stock Items Grid -->
    <div v-if="filteredItems.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <StockItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @update-stock="updateStock"
        @restock="openRestockDialog"
      />
    </div>

    <!-- Empty State -->
    <StockEmptyState v-else />

    <!-- Add Item Dialog -->
    <AddStockDialog
      v-model:open="isAddDialogOpen"
      @add-item="handleAddItem"
    />

    <!-- Restock Dialog -->
    <RestockDialog
      v-model:open="isRestockDialogOpen"
      :item="selectedItem"
      @restock="handleRestock"
    />
  </div>
</template>
