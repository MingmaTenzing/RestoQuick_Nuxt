<script setup lang="ts">
import { type MenuCategory, type MenuItem } from '~/generated/prisma/client'
import type { MenuItemCreateInput } from '~/generated/prisma/models';

const props = defineProps<{
  item: MenuItem
  isSaving?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  close: []
  update: [payload: { id: string, form: MenuItemCreateInput }]
  delete: [id: string]
}>()

const showDeleteConfirm = ref(false)

const form = reactive<MenuItemCreateInput>({
   
  name: props.item.name,
  description: props.item.description ?? '',
  priceCents: props.item.priceCents,
  category: props.item.category,
  imageUrl: props.item.imageUrl ?? '',
  isAvailable: props.item.isAvailable ?? true,
})
const {data:menu_category} = await useFetch<MenuCategory[]>('/api/menu/category')


const submitEditMenuItem = async () => {
  if (props.isSaving || props.isDeleting) return

  emit('update', {
    id: props.item.id,
    form: {
      name: form.name,
      description: form.description ,
      priceCents: Number(form.priceCents),
      category: form.category,
      imageUrl: form.imageUrl ,
      isAvailable: form.isAvailable,
    }
  })
}

const openDeleteConfirm = () => {
  if (props.isSaving || props.isDeleting) return

  showDeleteConfirm.value = true
}

const closeDeleteConfirm = () => {
  if (props.isDeleting) return

  showDeleteConfirm.value = false
}

const confirmDeleteMenuItem = () => {
  if (props.isSaving || props.isDeleting) return

  emit('delete', props.item.id)
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4" @click.self="!props.isSaving && !props.isDeleting && !showDeleteConfirm && emit('close')">
    <div class="w-full max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
      <div class="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold">Edit Menu Item</h2>
          <p class="text-sm text-muted-foreground">Update menu information and availability.</p>
        </div>

        <button
          type="button"
          :disabled="props.isSaving || props.isDeleting"
          class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input transition-colors hover:bg-accent hover:text-accent-foreground"
          @click="emit('close')"
        >
          <i class="pi pi-times" />
        </button>
      </div>

      <form @submit.prevent="submitEditMenuItem" class="space-y-5">
        <div class="space-y-4" :class="{ 'pointer-events-none opacity-50': props.isSaving || props.isDeleting }">
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
            v-if="!props.isDeleting"
            type="button"
            :disabled="props.isSaving"
            class="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-destructive transition-colors hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-50"
            @click="openDeleteConfirm"
          >
            Delete
          </button>

          <div
            v-else
            class="flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-destructive-foreground"
          >
            <i class="pi pi-spinner animate-spin" />
          </div>

          <button
            type="button"
            :disabled="props.isSaving || props.isDeleting"
            class="rounded-md border border-input bg-background px-4 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
            @click="emit('close')"
          >
            Cancel
          </button>

          <button
            v-if="!props.isSaving"
            type="submit"
            :disabled="props.isDeleting"
            class="rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save Changes
          </button>

          <div v-else class="flex items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground">
            <i class="pi pi-spinner animate-spin" />
          </div>
        </div>
      </form>
    </div>

    <MenuComponentsDeleteMenuItemConfirmModal
      v-if="showDeleteConfirm"
      :item-name="item.name"
      :is-deleting="props.isDeleting"
      @cancel="closeDeleteConfirm"
      @confirm="confirmDeleteMenuItem"
    />
  </div>
</template>