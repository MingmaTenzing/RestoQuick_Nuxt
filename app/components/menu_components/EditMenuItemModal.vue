<script setup lang="ts">
import {  type MenuItemCreateInput, type MenuItemUpdateInput, type MenuOptionUncheckedCreateInput } from "~/generated/prisma/models";
import { cloudinary_image_upload} from "../../client_utils/cloudinary_upload_image"
import type { MenuCategory, MenuOption } from '~/generated/prisma/browser';
import type { MenuItemWithOptions } from "~~/types/menu";

const props = defineProps<{
  item: MenuItemWithOptions
  isSaving?: boolean
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  close: []
  update: [payload: { id: string, form: MenuItemUpdateInput }]
  delete: [id: string]
}>()


const { data: menu_category } = await useFetch<MenuCategory[]>('/api/menu/category')


const showDeleteConfirm = ref(false)
const runtimeConfig = useRuntimeConfig()
const toast = useToast()
const image_uploading = ref(false)
const image_upload_success = ref(false)
const isAddingMenuOption = ref(false)


const draft_menu_option = reactive<MenuOptionUncheckedCreateInput>({
  name: '',
  priceCents: 0,
  menuItemId: props.item.id
})

const open_add_option = () => {
  isAddingMenuOption.value = true
  draft_menu_option.name = ''
  draft_menu_option.priceCents = 0
}

const save_new_menu_option = async() => {
  if (!draft_menu_option.name.trim()) return

  try {
    const add_menu_option = await $fetch<MenuOption>("/api/menu/menu_item_options", {
      method: 'POST',
      body: {
        create_menu_option: {
          name: draft_menu_option.name.trim(),
          priceCents: Number(draft_menu_option.priceCents),
          menuItemId: props.item.id,
        },
      },
    })

    props.item.options.push(add_menu_option)

    isAddingMenuOption.value = false
    draft_menu_option.name = ''
    draft_menu_option.priceCents = 0

    toast.success({
      message: 'Added new option'
    })
  } catch (error) {
    toast.error({
      message: error instanceof Error ? error.message : 'Failed to add menu option'
    })
  }
}

const update_menu_option = async (option: MenuOption) => {
  try {
    const updated_option = await $fetch<MenuOption>(`/api/menu/menu_item_options/${option.id}`, {
      method: 'PUT',
      body: {
        update_menu_option: {
          name: option.name.trim(),
          priceCents: Number(option.priceCents),
        },
      },
    })

    option.name = updated_option.name
    option.priceCents = updated_option.priceCents

    toast.success({
      message: 'Updated menu option'
    })
  } catch (error) {
    toast.error({
      message: error instanceof Error ? error.message : 'Failed to update menu option'
    })
  }
}

const removeMenuOption =  () => {
}

const form = reactive<MenuItemCreateInput>({
   
  name: props.item.name,
  description: props.item.description ?? '',
  priceCents: props.item.priceCents,
  category: props.item.category,
  imageUrl: props.item.imageUrl ?? '',
  isAvailable: props.item.isAvailable ?? true,
})


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
    <div class="w-full h-[90vh] overflow-y-scroll max-w-xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
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

          <div class="space-y-3 rounded-md border border-border p-4">
            <div class="flex items-center justify-between gap-3">
              <div>
                <label class="text-sm font-medium">Menu Options</label>
                <p class="text-xs text-muted-foreground">Edit optional extras or upgrades for this menu item.</p>
              </div>

              <button
                v-if="!isAddingMenuOption"
                type="button"
                class="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                @click="open_add_option"
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
                v-model.number="draft_menu_option.priceCents"
                type="number"
                min="0"
                placeholder="Price in cents"
                class="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-ring"
              >

              <button
                type="button"
                class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                @click="save_new_menu_option"
              >
                Save
              </button>

          
            </div>

            <div v-if="props.item.options.length" class="space-y-3">
              <div
                v-for="option in props.item.options"
                :key="option.id"
                class="grid grid-cols-1 gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_140px_auto_auto]"
              >
                <input
                  v-model="option.name"
                  type="text"
                  class="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >

                <input
                  v-model.number="option.priceCents"
                  type="number"
                  min="0"
                  class="w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >

                <button
                  type="button"
                  class="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
                  @click="update_menu_option(option)"
                  >
                  Update
                </button>

                <button
                  type="button"
                  class="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/20"
                  @click="removeMenuOption"
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
              type="file"
              accept="image/*"
              @change="upload_menu_item_image($event)"
              id="edit_menu_item_image_input"
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