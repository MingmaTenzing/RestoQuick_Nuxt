<script setup lang="ts">
import { ref, computed } from 'vue'
import AddStockDialog from '~/components/stock_components/AddStockDialog.vue'
import RestockDialog from '~/components/stock_components/RestockDialog.vue'
import StockEmptyState from '~/components/stock_components/StockEmptyState.vue'
import StockFilterBar from '~/components/stock_components/StockFilterBar.vue'
import StockItemCard from '~/components/stock_components/StockItemCard.vue'
import StockStatsCard from '~/components/stock_components/StockStatsCard.vue'
import type { StockItem } from '~/generated/prisma/client'
import type { StockItemCreateInput } from '~/generated/prisma/models'

definePageMeta({
  layout: 'dashboard-layout'
})

const {data:stockItems, refresh} = useFetch<StockItem[]>("/api/stock")

const filter = ref<'all' | 'low' | 'INGREDIENTS' | 'BEVERAGES' | 'SUPPLIES'>('all')
const searchQuery = ref('')
const isAddDialogOpen = ref(false)
const isRestockDialogOpen = ref(false)
const isAddItemLoading = ref(false)
const selectedItem = ref<StockItem | null>(null)
const toast = useToast()
const isLowStock = (item: StockItem) => item.currentStock <= item.reorderLevel

const filteredItems = computed(() => {
  if (stockItems.value) {
    return stockItems.value.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      if (filter.value === 'all') return matchesSearch
      if (filter.value === 'low') return matchesSearch && isLowStock(item)
      return matchesSearch && item.category === filter.value
    })
    
  }
  return [];
})

const lowStockCount = computed(() => stockItems.value?.filter(isLowStock).length ?? 0)
const totalItems = computed(() => stockItems.value?.length ?? 0)
const totalValue = computed(() => stockItems.value?.reduce((sum, item) => sum + item.currentStock, 0) ?? 0)

const filterOptions = computed(() => [
  { value: 'all', label: 'All Items' },
  { value: 'low', label: 'Low Stock', count: lowStockCount.value },
  { value: 'INGREDIENTS', label: 'Ingredients' },
  { value: 'BEVERAGES', label: 'Beverages' },
  { value: 'SUPPLIES', label: 'Supplies' },
])

const openRestockDialog = (item: StockItem) => {
  selectedItem.value = item
  isRestockDialogOpen.value = true
}

const handleRestock = async (stock_item: StockItem, quantity: number) => {
  try {
    
 

    const newStock = stock_item.currentStock + quantity
    
    const update_stock = await $fetch(`/api/stock/${stock_item.id}`, {
      method: 'PUT',
      body: {
        currentStock: newStock
      }
    })

    isRestockDialogOpen.value = false
    selectedItem.value = null
    if (update_stock) {
      refresh();
      toast.success({
        title: "Stock Updated"
      })
      
    }


  } catch (error) {
    console.error('Failed to update stock:', error)
  }
}

const handleAddItem = async(itemData: StockItemCreateInput) => {
isAddItemLoading.value = true
try {
  
  const add_stock = await $fetch('/api/stock', {
    method: 'POST',
    body: itemData
  })

  console.log(add_stock)
  refresh() //refresh the fetch if adding stock is successful
  toast.success({
    title: 'stock added'
  })
} catch (error) {
  
} finally {
  isAddItemLoading.value = false
  isAddDialogOpen.value = false

  

}
}
</script>

<template>
  <div class="space-y-6 ">
    <!-- Header -->
    <div class="flex items-center justify-between">

          <div class=" space-y-2 text-2xl md:text-6xl">
          <h1 class="">Stock Management</h1>
          <p class="text-muted-foreground text-lg ">Track inventory levels and manage supplies</p>
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
        @restock="openRestockDialog"
      />
    </div>

    <!-- Empty State -->
    <StockEmptyState v-else />

    <!-- Add Item Dialog -->
    <AddStockDialog
      v-model:open="isAddDialogOpen"
        :is-loading="isAddItemLoading"
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
