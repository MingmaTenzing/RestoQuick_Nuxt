<script setup lang="ts">
import type { StockItem } from '~/generated/prisma/client'



const route = useRoute()
const toast = useToast()
const stockId =route.params.stock_id  
const adjustedStock = ref<number>(0)
const isSaving = ref(false)

const { data: stockItem, status, error, refresh } = await useFetch<StockItem>(() => `/api/stock/${stockId}`)

watch(
  stockItem,
  (value) => {
    if (value) {
      adjustedStock.value = value.currentStock
    }
  },
  { immediate: true }
)

const decreaseStock = () => {
  adjustedStock.value = Math.max(0, adjustedStock.value - 1)
}

const increaseStock = () => {
  adjustedStock.value = adjustedStock.value + 1
}

const hasChanges = computed(() => {
  if (!stockItem.value) return false
  return adjustedStock.value !== stockItem.value.currentStock
})

const saveStock = async () => {
  if (!stockItem.value || !hasChanges.value) return

  isSaving.value = true
  try {
    await $fetch(`/api/stock/${stockId}`, {
      method: 'PUT',
      body: {
        currentStock: adjustedStock.value
      }
    })

    await refresh()

    toast.success({
      title: 'Stock updated'
    })
  } catch {
    toast.error({
      title: 'Failed to update stock'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <main class="min-h-screen p-4 md:p-6 flex items-center justify-center">
    <div class="w-full max-w-2xl space-y-6">
    <div>
      <div>
        <h1 class="text-2xl md:text-4xl font-bold">Stock Scan Form</h1>
        <p class="text-muted-foreground">Quick adjust view for scanned stock label</p>
      </div>

    </div>

    <div v-if="status === 'pending'" class="rounded-3xl border border-border bg-card p-6 text-muted-foreground">
      Loading stock item...
    </div>

    <div v-else-if="error || !stockItem" class="rounded-3xl border border-border bg-card p-6">
      <p class="text-red-500 font-medium">Stock item not found.</p>
      <p class="text-muted-foreground text-sm mt-2">Please check the QR label or try from the stock list.</p>
    </div>

    <form v-else class="rounded-3xl border border-border bg-card p-6 max-w-2xl space-y-6" @submit.prevent="saveStock">
      <div class="space-y-1">
        <p class="text-sm text-muted-foreground">Scanned Item</p>
        <p class="text-2xl font-semibold">{{ stockItem.name }}</p>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Current Stock (saved)</p>
          <p class="text-lg font-medium">{{ stockItem.currentStock }} {{ stockItem.unit }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Reorder Level</p>
          <p class="text-lg font-medium">{{ stockItem.reorderLevel }} {{ stockItem.unit }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-muted-foreground">Category</p>
          <p class="text-lg font-medium">{{ stockItem.category }}</p>
        </div>
      </div>

      <div class="rounded-3xl border border-border bg-background p-4 space-y-4 w-full">
        <p class="text-sm font-medium text-muted-foreground">Adjusted Stock (form value)</p>

        <div class="flex  items-center gap-3">
          <button
            type="button"
            @click="decreaseStock"
            class="h-12 w-12 rounded-2xl border border-border text-xl font-semibold hover:bg-accent transition-colors"
          >
            -
          </button>

          <input
            v-model.number="adjustedStock"
            type="number"
            min="0"
            class="h-12 w-36 rounded-2xl border border-border bg-card text-center text-xl font-semibold"
          >

          <button
            type="button"
            @click="increaseStock"
            class="h-12 w-12 rounded-2xl border border-border text-xl font-semibold hover:bg-accent transition-colors"
          >
            +
          </button>
        </div>

        <p class="text-xs text-muted-foreground">Adjust quantity, then click Update.</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          type="submit"
          :disabled="isSaving || !hasChanges"
          class="rounded-2xl bg-primary text-primary-foreground px-4 py-2 hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {{ isSaving ? 'Updating...' : 'Update' }}
        </button>
      </div>

      <p class="text-xs text-muted-foreground break-all">Stock ID: {{ stockItem.id }}</p>
    </form>
    </div>
  </main>
</template>
