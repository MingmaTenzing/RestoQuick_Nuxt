<script setup lang="ts">
import { ref, watch } from 'vue'
import type { StockItem } from '~/generated/prisma/client'

interface Props {
  open: boolean
  item: StockItem | null
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'restock', item: StockItem, quantity: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const adjustment = ref(0)

watch(() => props.item, (newItem) => {
  if (newItem) {
    adjustment.value = newItem.reorderQuantity
  }
})

const incrementStock = () => {
  adjustment.value++
}

const decrementStock = () => {
  if (adjustment.value > -props.item!.currentStock) {
    adjustment.value--
  }
}

const handleConfirm = () => {
  if (props.item) {
    emit('restock', props.item, adjustment.value)
    adjustment.value = 0
  }
}

const closeDialog = () => {
  emit('update:open', false)
  adjustment.value = 0
}
</script>

<template>
  <div v-if="open && item" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-md">
      <h2 class="text-lg font-semibold mb-2">Manage Stock - {{ item.name }}</h2>
      <p class="text-sm text-muted-foreground mb-4">Adjust inventory levels</p>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Stock Adjustment</label>
          <div class="flex items-center gap-4">
            <button
              @click="decrementStock"
              class="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors text-lg font-semibold"
            >
              <i class="pi pi-minus" />
            </button>
            <input
              v-model.number="adjustment"
              type="number"
              class="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground text-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              @click="incrementStock"
              class="px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors text-lg font-semibold"
            >
              <i class="pi pi-plus" />
            </button>
          </div>
          <p class="text-sm text-muted-foreground">
            Recommended reorder: {{ item.reorderQuantity }} {{ item.unit }}
          </p>
        </div>

        <div class="bg-muted rounded-lg p-4 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Current stock:</span>
            <span class="font-medium">{{ item.currentStock }} {{ item.unit }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-muted-foreground">Adjustment:</span>
            <span :class="['font-medium', adjustment >= 0 ? 'text-green-600' : 'text-red-600']">
              {{ adjustment >= 0 ? '+' : '' }}{{ adjustment }} {{ item.unit }}
            </span>
          </div>
          <div class="flex justify-between text-base font-bold border-t pt-2">
            <span>New stock level:</span>
            <span>{{ item.currentStock + adjustment }} {{ item.unit }}</span>
          </div>
        </div>

        <div class="flex gap-2 pt-4 border-t">
          <button
            @click="closeDialog"
            class="flex-1 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            :disabled="adjustment === 0"
            class="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
