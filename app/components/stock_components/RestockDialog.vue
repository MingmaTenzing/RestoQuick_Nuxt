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
  <div v-if="open && item" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:p-6">
    <div class="w-full max-w-xl rounded-4xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-foreground">Manage Stock</h2>
          <p class="mt-1 text-sm text-muted-foreground">Adjust inventory levels for {{ item.name }}.</p>
        </div>
        <button
          type="button"
          @click="closeDialog"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <i class="pi pi-times text-sm" />
        </button>
      </div>

      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Stock Adjustment</label>
          <div class="flex items-center gap-3 rounded-3xl border border-border bg-muted/50 p-3">
            <button
              @click="decrementStock"
              class="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-lg font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <i class="pi pi-minus" />
            </button>
            <input
              v-model.number="adjustment"
              type="number"
              class="min-w-0 flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-center text-xl font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
            <button
              @click="incrementStock"
              class="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card text-lg font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <i class="pi pi-plus" />
            </button>
          </div>
          <p class="text-sm text-muted-foreground">
            Recommended reorder: {{ item.reorderQuantity }} {{ item.unit }}
          </p>
        </div>

        <div class="space-y-3 rounded-3xl border border-border bg-muted/50 p-5">
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
          <div class="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <span>New stock level:</span>
            <span>{{ item.currentStock + adjustment }} {{ item.unit }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
          <button
            @click="closeDialog"
            class="flex-1 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            @click="handleConfirm"
            :disabled="adjustment === 0"
            class="flex-1 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
