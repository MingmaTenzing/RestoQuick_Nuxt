<script setup lang="ts">
import { type MenuCategory, type MenuItem } from '~/generated/prisma/client'
import type { MenuItemCreateInput } from '~/generated/prisma/models'

definePageMeta({
    layout: 'dashboard-layout'
})



const { data: menuItems, refresh } = await useFetch<MenuItem[]>('/api/menu')

const { data: menu_category } = await useFetch<MenuCategory[]>('/api/menu/category')

const toast = useToast()
const searchQuery = ref('')
const selectedCategory = ref<MenuCategory | ''>('')

const filteredMenuItems = computed(() => {
    const items = menuItems.value ?? []
    const normalizedSearch = searchQuery.value.trim().toLowerCase()

    return items.filter((item) => {
        const matchesCategory = selectedCategory.value
            ? item.category === selectedCategory.value
            : true

        const matchesSearch = normalizedSearch
            ? item.name.toLowerCase().includes(normalizedSearch) ||
              (item.description?.toLowerCase().includes(normalizedSearch) ?? false)
            : true

        return matchesCategory && matchesSearch
    })
})

const showEditModal = ref(false)
const selectedMenuItem = ref<MenuItem | null>(null)
const isUpdatingMenuItem = ref(false)
const isDeletingMenuItem = ref(false)




const openEditModal = (item: MenuItem) => {
    selectedMenuItem.value = item
    showEditModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
    selectedMenuItem.value = null
}

const updateEditedMenuItem = async (payload: { id: string, form: MenuItemCreateInput }) => {
    isUpdatingMenuItem.value = true

    try {
        const updatedItem = await $fetch<MenuItem>(`/api/menu/${payload.id}`, {
            method: 'PUT',
            body: payload.form
        })


        if (updatedItem) {
            await refresh()
            
                    toast.success({
                        title: 'Menu item updated'
                    })
            
                    closeEditModal()
        }

    } catch (error) {
        console.log(error)
        toast.error({
            title: 'Failed to update menu item'
        })
    } finally {
        isUpdatingMenuItem.value = false
    }
}

const deleteMenuItem = async (menuItemId: string) => {
    isDeletingMenuItem.value = true

    try {
        const deleteEndpoint: string = `/api/menu/${menuItemId}`

        await $fetch(deleteEndpoint, {
            method: 'DELETE'
        })

        await refresh()

        toast.success({
            title: 'Menu item deleted'
        })

        closeEditModal()
    } catch (error) {
        console.log(error)
        toast.error({
            title: 'Failed to delete menu item'
        })
    } finally {
        isDeletingMenuItem.value = false
    }
}

const update_availability = async (menu_item: MenuItem) => {
    const updated_item = await $fetch<MenuItem>(`/api/menu/update_availability/${menu_item.id}`, {
        method: 'PATCH',
        body: {
            isAvailable: !menu_item.isAvailable 
        }
    })

    if (updated_item) {
        
        return await refresh();
    }

    
}

</script>

<template>
    <main class=" space-y-6">

        <div>
                    <h1 class="text-2xl md:text-6xl">Manage Menu</h1>

        </div>
        <div class=" flex items-center justify-between">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search menu item"
                class="w-1/3 rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-ring"
            >

            <div class="flex flex-wrap gap-2 ">
                <button
                    type="button"
                    class="rounded-md border uppercase px-3 py-1 text-sm transition-colors"
                    :class="selectedCategory === '' ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'"
                    @click="selectedCategory = ''"
                >
                   All Categories
                </button>

                <button
                    v-for="category in (menu_category ?? [])"
                    :key="category"
                    type="button"
                    class="rounded-md border px-3 py-1 text-sm transition-colors"
                    :class="selectedCategory === category ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'"
                    @click="selectedCategory = category"
                >
                    {{ category.replaceAll('_', ' ') }}
                </button>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ">
            <div v-for="item in filteredMenuItems" :key="item.id" class="w-full max-w-85">
                <MenuComponentsMenuItemCard
                    :item="item"
                    @edit="openEditModal"
                    @toggle-availability="update_availability"
                />
            </div>
        </div>
 
        <div      v-if="filteredMenuItems.length === 0" class=" flex justify-center items-center  h-[80vh]"> 
            <p
           
                class="mt-6 font-light text-muted-foreground"
            >
                No menu items found for current filters.
            </p>

        </div>

        <Transition>
            <MenuComponentsEditMenuItemModal
                v-if="showEditModal && selectedMenuItem"
                :item="selectedMenuItem"
                :is-saving="isUpdatingMenuItem"
                :is-deleting="isDeletingMenuItem"
                @close="closeEditModal"
                @update="updateEditedMenuItem"
                @delete="deleteMenuItem"
            />
        </Transition>
    </main>
</template>