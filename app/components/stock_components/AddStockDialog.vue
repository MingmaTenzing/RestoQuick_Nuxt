<script setup lang="ts">
import { reactive, ref } from 'vue'
import { StockCategory } from '~/generated/prisma/enums';
import type { StockItemCreateInput } from '~/generated/prisma/models';

interface Props {
  open: boolean
  isLoading?: boolean
}



const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'add-item', value: StockItemCreateInput): void
}>()

const props = defineProps<Props>()

const formData = reactive<StockItemCreateInput>({
  name: '',
  category: StockCategory.INGREDIENTS, //default value
  currentStock: 0,
  unit: '',
  reorderLevel: 0,
  reorderQuantity: 0,
  supplier: '',
   createdAt: new Date(),
    updatedAt: new Date(),
})


const resetForm = () => {
  formData.name = ''
  formData.category = StockCategory.INGREDIENTS, //default value
  formData.currentStock = 0
  formData.unit = ''
  formData.reorderLevel = 0
  formData.reorderQuantity = 0
  formData.supplier = ''
}
const handleSubmit = () => {
  emit('add-item', {
   ...formData
   
  })
  resetForm()

}

const closeDialog = () => {
  emit('update:open', false)
  resetForm()
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm sm:p-6">
    <div class="w-full max-w-2xl rounded-4xl border border-border bg-card p-6 shadow-sm sm:p-7">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-foreground">Add Stock Item</h2>
          <p class="mt-1 text-sm text-muted-foreground">Add a new item to inventory.</p>
        </div>
        <button
          type="button"
          @click="closeDialog"
          class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <i class="pi pi-times text-sm" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Item Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Category</label>
          <select
            v-model="formData.category"
            class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            <option :value="StockCategory.INGREDIENTS">Ingredients</option>
            <option :value="StockCategory.BEVERAGES">Beverages</option>
            <option :value="StockCategory.SUPPLIES">Supplies</option>
            <option :value="StockCategory.OTHER">Other</option>
          </select>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">Current Stock</label>
            <input
              v-model.number="formData.currentStock"
              type="number"
              min="0"
              required
              class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Unit</label>
            <input
              v-model="formData.unit"
              type="text"
              placeholder="kg, liters, etc."
              required
              class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm font-medium">Reorder Level</label>
            <input
              v-model.number="formData.reorderLevel"
              type="number"
              min="0"
              required
              class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Reorder Qty</label>
            <input
              v-model.number="formData.reorderQuantity"
              type="number"
              min="0"
              required
              class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Supplier (Optional)</label>
          <input
            v-model="formData.supplier"
            type="text"
            class="w-full rounded-2xl border border-border bg-muted/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div class="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
          <button
            type="button"
            @click="closeDialog"
            class="flex-1 rounded-2xl border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="props.isLoading"
            class="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i v-if="props.isLoading" class="pi pi-spinner animate-spin" />
            {{ props.isLoading ? 'Adding...' : 'Add Item' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
