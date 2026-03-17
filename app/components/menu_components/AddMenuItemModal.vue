<script setup lang="ts">
import type { MenuItemCreateInput, MenuOptionCreateWithoutMenuItemInput } from '~/generated/prisma/models'
import { cloudinary_image_upload} from "../../client_utils/cloudinary_upload_image"
import type { MenuCategory } from '~/generated/prisma/enums';

import type { MenuOptionDraft, MenuItemFormState } from "../../../types/menu"


const props = defineProps<{
  isCreating?: boolean
}>()

const emit = defineEmits<{
  close: []
  create: [payload: MenuItemCreateInput]
}>()

const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const image_uploading = ref(false)
const image_upload_success = ref(false)


const menu_options = ref<MenuOptionDraft[]>([])
const isAddingMenuOption = ref(false)


const draft_menu_option = reactive<MenuOptionDraft>({
  name: '',
  price: 0,
})




const form = reactive<MenuItemFormState>({
  name: '',
  description: '',
  price: 0,
  category: 'MAIN_COURSE' as MenuCategory,
  imageUrl: '',
  isAvailable: true,
})


const { data: menu_category } = await useFetch<MenuCategory[]>('/api/menu/category')

const addMenuOption = () => {
  isAddingMenuOption.value = true
  draft_menu_option.name = ''
  draft_menu_option.price = 0
}

const toCents = (value: number) => Math.round((Number(value) || 0) * 100)

const saveMenuOption = () => {
  if (!draft_menu_option.name.trim()) return
  menu_options.value.push({
    name: draft_menu_option.name.trim(),
    price: Number(draft_menu_option.price),
  })
  isAddingMenuOption.value = false
  draft_menu_option.name = ''
  draft_menu_option.price = 0
}

const removeDraftMenuOption = () => {
  isAddingMenuOption.value = false
  draft_menu_option.name = ''
  draft_menu_option.price = 0
}

const removeMenuOption = (index: number) => {
  menu_options.value.splice(index, 1)
}

const submitAddMenuItem = () => {
  if (props.isCreating) return

  const menuOptionsCreateInput: MenuOptionCreateWithoutMenuItemInput[] = menu_options.value.map(option => ({
    name: option.name,
    priceCents: toCents(option.price),
  }))

  emit('create', {
    name: form.name,
    description: form.description ,
    priceCents: toCents(form.price),
    category: form.category,
    imageUrl: form.imageUrl,
    isAvailable: form.isAvailable,
    options: {
      create: menuOptionsCreateInput,
    },
  })
}

async function upload_menu_item_image(event: Event) {
  image_upload_success.value = false
  image_uploading.value = true

  try {
     const image_secure_url = await cloudinary_image_upload(event, {
    cloudName: runtimeConfig.public.CLOUDINARY_CLOUD_NAME,
    uploadPreset: runtimeConfig.public.CLOUDINARY_UPLOAD_PRESET_MENU_ITEMS,
    maxSizeInKb: 300,
  })

    form.imageUrl = image_secure_url
    image_upload_success.value = true
  } catch (error) {
    toast.error({
      message: error instanceof Error ? error.message : 'Image upload failed'
    })
  } finally {
    image_uploading.value = false
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center   justify-center bg-background/80 p-4"
    @click.self="!props.isCreating && emit('close')"
  >
    <div class="w-full h-[90vh] overflow-y-scroll  max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
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
              <label class="text-sm font-medium">Price</label>
              <input
                v-model.number="form.price"
                type="number"
                min="0"
                step="0.01"
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

          <div class="space-y-3 rounded-md border border-border p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <label class="text-sm font-medium">Menu Options</label>
                <p class="text-xs text-muted-foreground">Add optional extras or upgrades for this menu item.</p>
              </div>

              <button
                v-if="!isAddingMenuOption"
                type="button"
                class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                @click="addMenuOption"
              >
                Add Option
              </button>
            </div>

            <div
              v-if="isAddingMenuOption"
              class="grid grid-cols-1 gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_140px_auto_auto]"
            >
              <input
                v-model="draft_menu_option.name"
                type="text"
                placeholder="e.g. Extra cheese"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:ring-2 focus:ring-ring"
              >

              <input
                v-model.number="draft_menu_option.price"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 1.50"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >

              <button
                type="button"
                class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                @click="saveMenuOption"
              >
                Save
              </button>

              <button
                type="button"
                class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
                @click="removeDraftMenuOption"
              >
                Remove
              </button>
            </div>

            <div v-if="menu_options.length" class="space-y-3">
              <div
                v-for="(option, index) in menu_options"
                :key="index"
                class="grid grid-cols-1 gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_140px_auto]"
              >
                <div class="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground">
                  {{ option.name }}
                </div>

                <div class="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground">
                  {{ option.price.toFixed(2) }}
                </div>

                <button
                  type="button"
                  class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
                  @click="removeMenuOption(index)"
                >
                  Remove
                </button>
              </div>
            </div>

            <p v-else-if="!isAddingMenuOption" class="text-sm text-muted-foreground">
              No menu options added yet.
            </p>
          </div>

          <div class="space-y-2">
            <div class="flex space-x-2">
              <label class="text-sm font-medium">Menu Image (Max - 300KB)</label>
              <i v-if="image_uploading" class="pi pi-spinner animate-spin"></i>
              <i v-if="image_upload_success" class="pi pi-check-circle text-green-600"></i>
            </div>

            <input
              required
              type="file"
              accept="image/*"
              @change="upload_menu_item_image($event)"
              id="menu_item_image_input"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring"
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
