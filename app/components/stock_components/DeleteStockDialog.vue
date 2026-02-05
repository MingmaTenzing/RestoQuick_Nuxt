<script setup lang="ts">
import type { StockItem } from '~/generated/prisma/client'

interface Props {
  open: boolean
  item: StockItem | null
  isLoading?: boolean
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'delete', item: StockItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleDelete = () => {
  if (props.item) {
    emit('delete', props.item)
  }
}

const closeDialog = () => {
  emit('update:open', false)
}
</script>

<template>
  <div v-if="open && item" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-md">
      <h2 class="text-lg font-semibold text-destructive mb-2 flex items-center gap-2">
        <i class="pi pi-exclamation-triangle" />
        Delete Stock Item
      </h2>
      <p class="text-sm text-muted-foreground mb-6">
        Are you sure you want to delete <strong>{{ item.name }}</strong>? This action cannot be undone.
      </p>

      <div class="bg-destructive/20 border border-destructive rounded-lg p-4 mb-6">
        <p class="text-sm text-destructive">
          Current stock: <strong>{{ item.currentStock }} {{ item.unit }}</strong>
        </p>
      </div>

      <div class="flex gap-2">
        <button
          @click="closeDialog"
          :disabled="props.isLoading"
          class="flex-1 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          :disabled="props.isLoading"
          class="flex-1 px-4 py-2 rounded-md bg-destructive/20 border border-destructive text-destructive hover:bg-destructive/90 hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          <i v-if="props.isLoading" class="pi pi-spinner animate-spin" />
          {{ props.isLoading ? 'Deleting...' : 'Delete Item' }}
        </button>
      </div>
    </div>
  </div>
</template>
