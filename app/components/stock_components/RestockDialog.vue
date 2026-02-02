<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StockItem } from './StockItemCard.vue'

interface Props {
  open: boolean
  item: StockItem | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'restock', id: string, quantity: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const quantity = ref(0)

watch(() => props.item, (newItem) => {
  if (newItem) {
    quantity.value = newItem.reorderQuantity
  }
})

const handleRestock = () => {
  if (props.item) {
    emit('restock', props.item.id, quantity.value)
  }
}

const closeDialog = () => {
  emit('update:open', false)
}
</script>

<template>
  <div v-if="open && item" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-md">
      <h2 class="text-lg font-semibold mb-2">Restock {{ item.name }}</h2>
      <p class="text-sm text-muted-foreground mb-4">Add stock to inventory</p>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Quantity to Add</label>
          <input
            v-model.number="quantity"
            type="number"
            min="1"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p class="text-sm text-muted-foreground">
            Recommended: {{ item.reorderQuantity }} {{ item.unit }}
          </p>
        </div>

        <div class="bg-muted rounded-lg p-3">
          <p class="text-sm">
            <span class="text-muted-foreground">New stock level: </span>
            <span class="font-bold">{{ item.currentStock + quantity }} {{ item.unit }}</span>
          </p>
        </div>

        <div class="flex gap-2 pt-4 border-t">
          <button
            @click="closeDialog"
            class="flex-1 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleRestock"
            class="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Confirm Restock
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
