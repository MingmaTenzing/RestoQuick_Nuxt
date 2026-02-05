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
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-md">
      <h2 class="text-lg font-semibold mb-2">Add Stock Item</h2>
      <p class="text-sm text-muted-foreground mb-4">Add a new item to inventory</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Item Name</label>
          <input
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Category</label>
          <select
            v-model="formData.category"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option :value="StockCategory.INGREDIENTS">Ingredients</option>
            <option :value="StockCategory.BEVERAGES">Beverages</option>
            <option :value="StockCategory.SUPPLIES">Supplies</option>
            <option :value="StockCategory.OTHER">Other</option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Current Stock</label>
            <input
              v-model.number="formData.currentStock"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Unit</label>
            <input
              v-model="formData.unit"
              type="text"
              placeholder="kg, liters, etc."
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Reorder Level</label>
            <input
              v-model.number="formData.reorderLevel"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Reorder Qty</label>
            <input
              v-model.number="formData.reorderQuantity"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium">Supplier (Optional)</label>
          <input
            v-model="formData.supplier"
            type="text"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div class="flex gap-2 pt-4 border-t">
          <button
            type="button"
            @click="closeDialog"
            class="flex-1 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="props.isLoading"
            class="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="props.isLoading" class="pi pi-spinner animate-spin" />
            {{ props.isLoading ? 'Adding...' : 'Add Item' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
