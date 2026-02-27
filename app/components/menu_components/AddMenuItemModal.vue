<script setup lang="ts">
import { type MenuCategory } from '~/generated/prisma/enums';
import type { MenuItemCreateInput } from '~/generated/prisma/models'



const props = defineProps<{
  isCreating?: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [payload: MenuItemCreateInput]
}>()

const form = reactive<MenuItemCreateInput>({
  name: '',
  description: '',
  priceCents: 0,
  category: 'MAIN_COURSE' as MenuCategory,
  imageUrl: '',
  isAvailable: true,
})

const { data: menu_category } = await useFetch<MenuCategory[]>('/api/menu/category')

const submitAddMenuItem = () => {
  if (props.isCreating) return

  emit('create', {
    name: form.name,
    description: form.description || null,
    priceCents: Number(form.priceCents),
    category: form.category,
    imageUrl: form.imageUrl || null,
    isAvailable: form.isAvailable,
  })
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
    @click.self="!props.isCreating && emit('close')"
  >
    <div class="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">Add Menu Item</h2>
          <p class="text-sm text-muted-foreground">Create a new menu item.</p>
        </div>

        <button
          type="button"
          :disabled="props.isCreating"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="emit('close')"
        >
          <i class="pi pi-times" />
        </button>
      </div>

      <form @submit.prevent="submitAddMenuItem" class="space-y-5">
        <div class="space-y-4" :class="{ 'pointer-events-none opacity-50': props.isCreating }">
          <div class="space-y-2">
            <label class="text-sm font-medium">Item Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. Chicken Burger"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="Short description for customers"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm font-medium">Price (cents)</label>
              <input
                v-model.number="form.priceCents"
                type="number"
                min="0"
                required
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium">Category</label>
              <select
                v-model="form.category"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                <option v-for="category in menu_category" :key="category" :value="category">
                  {{ category.replaceAll('_', ' ') }}
                </option>
              </select>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Image URL</label>
            <input
              v-model="form.imageUrl"
              type="url"
              placeholder="https://..."
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            >
          </div>

          <div class="rounded-md border border-border p-3">
            <label class="inline-flex items-center gap-2 text-sm font-medium">
              <input v-model="form.isAvailable" type="checkbox" class="h-4 w-4">
              Available for ordering
            </label>
          </div>
        </div>

        <div class="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            :disabled="props.isCreating"
            class="rounded-md border border-input bg-background px-4 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('close')"
          >
            Cancel
          </button>

          <button
            v-if="!props.isCreating"
            type="submit"
            class="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create Menu Item
          </button>

          <div v-else class="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground">
            <i class="pi pi-spinner animate-spin" />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
