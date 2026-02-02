<script setup lang="ts">
export interface StockItem {
  id: string
  name: string
  category: 'ingredients' | 'beverages' | 'supplies' | 'other'
  currentStock: number
  unit: string
  reorderLevel: number
  reorderQuantity: number
  supplier?: string
  lastRestocked: string
}

interface Props {
  item: StockItem
}

interface Emits {
  (e: 'update-stock', id: string, change: number): void
  (e: 'restock', item: StockItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLowStock = (item: StockItem) => item.currentStock <= item.reorderLevel

const getCategoryColor = (category: StockItem['category']) => {
  switch (category) {
    case 'ingredients':
      return 'bg-orange-500/10 text-orange-600 border-orange-500/20'
    case 'beverages':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'supplies':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    case 'other':
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }
}
</script>

<template>
  <div
    :class="[
      'rounded-lg border p-6 space-y-4 bg-card hover:shadow-md transition-shadow hover:border-ring',
     
    ]"
  >
    <!-- Item Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <h3 class="text-lg font-semibold">{{ item.name }}</h3>
        <p v-if="item.supplier" class="text-xs text-muted-foreground mt-1">{{ item.supplier }}</p>
      </div>
      <span :class="['px-2 py-1 rounded text-xs font-medium border', getCategoryColor(item.category)]">
        {{ item.category }}
      </span>
    </div>

    <!-- Stock Info -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <span class="text-sm text-muted-foreground">Current Stock</span>
        <span
          v-if="isLowStock(item)"
          class="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 flex items-center gap-1"
        >
          <i class="pi pi-exclamation-triangle text-xs" />
          Low
        </span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="text-3xl font-bold">{{ item.currentStock }}</span>
        <span class="text-muted-foreground">{{ item.unit }}</span>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          :class="[
            'h-2 rounded-full transition-all',
            isLowStock(item) ? 'bg-yellow-500' : 'bg-green-500'
          ]"
          :style="{ width: `${Math.min((item.currentStock / item.reorderQuantity) * 100, 100)}%` }"
        />
      </div>

      <div class="flex justify-between text-xs text-muted-foreground">
        <span>Reorder at: {{ item.reorderLevel }} {{ item.unit }}</span>
        <span>Target: {{ item.reorderQuantity }} {{ item.unit }}</span>
      </div>
    </div>

    <p v-if="item.lastRestocked" class="text-xs text-muted-foreground">
      Last restocked: {{ new Date(item.lastRestocked).toLocaleDateString() }}
    </p>

    <!-- Actions -->
    <div class="flex gap-2 pt-2 border-t">
      <button
        @click="emit('update-stock', item.id, -1)"
        class="flex-1 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors text-sm font-medium flex items-center justify-center gap-1"
      >
        <i class="pi pi-minus" />
        Remove
      </button>
      <button
        @click="emit('update-stock', item.id, 1)"
        class="flex-1 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors text-sm font-medium flex items-center justify-center gap-1"
      >
        <i class="pi pi-plus" />
        Add
      </button>
      <button
        @click="emit('restock', item)"
        class="flex-1 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
      >
        Restock
      </button>
    </div>
  </div>
</template>
