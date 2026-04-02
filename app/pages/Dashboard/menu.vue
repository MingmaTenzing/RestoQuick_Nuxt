<script setup lang="ts">
import type { MenuCategory, MenuItem, MenuOption } from '~/generated/prisma/browser'
import type { MenuItemCreateInput, MenuItemUpdateInput } from '~/generated/prisma/models'
import type {  MenuItemWithOptions } from '~~/types/menu'




definePageMeta({
    layout: 'dashboard-layout'
})


const { data: menuItems, pending: isMenuItemsPending, refresh } = await useFetch<MenuItemWithOptions[]>('/api/menu', {
    lazy:true 
})

const { data: menu_category } = await useFetch<MenuCategory[]>('/api/menu/category', {
    lazy: true
})

const toast = useToast()
const searchQuery = ref('')
const selectedCategory = ref<MenuCategory | ''>('')

const showMenuSkeletons = computed(() => isMenuItemsPending.value && !(menuItems.value?.length))

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
const selectedMenuItem = ref<MenuItemWithOptions | null>(null)
const showViewSidebar = ref(false)
const selectedViewMenuItem = ref<MenuItemWithOptions | null>(null)
const isUpdatingMenuItem = ref(false)
const isDeletingMenuItem = ref(false)
const showAddModal = ref(false)
const isCreatingMenuItem = ref(false)




const openEditModal = (item: MenuItem) => {
    selectedMenuItem.value = menuItems.value?.find(menuItem => menuItem.id === item.id) ?? {
        ...item,
        options: [],
    }

    showEditModal.value = true
}

const openViewSidebar = (item: MenuItem) => {
    selectedViewMenuItem.value = menuItems.value?.find(menuItem => menuItem.id === item.id) ?? {
        ...item,
        options: [],
    }

    showViewSidebar.value = true
}

const openAddModal = () => {
    showAddModal.value = true
}

const closeEditModal = () => {
    showEditModal.value = false
    selectedMenuItem.value = null
}

const closeViewSidebar = () => {
    showViewSidebar.value = false
    selectedViewMenuItem.value = null
}

const closeAddModal = () => {
    showAddModal.value = false
}

const createMenuItem = async (payload: MenuItemCreateInput) => {
    isCreatingMenuItem.value = true

    try {
        await $fetch<MenuItemWithOptions>('/api/menu', {
            method: 'POST',
            body: payload
        })

        await refresh()

        toast.success({
            title: 'Menu item created'
        })

        closeAddModal()
    } catch (error) {
        toast.error({
            title: 'Failed to create menu item'
        })
    } finally {
        isCreatingMenuItem.value = false
    }
}

const updateEditedMenuItem = async (payload: { id: string, form: MenuItemUpdateInput }) => {
    isUpdatingMenuItem.value = true

    try {
        const updatedItem = await $fetch<MenuItemWithOptions>(`/api/menu/${payload.id}`, {
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

        <div class=" flex justify-between items-center">
                    <h1 class="text-2xl md:text-6xl">Manage Menu</h1>

                    <div @click="openAddModal" class="border border-border px-3 space-x-2 py-2 rounded-3xl bg-secondary hover:scale-105 transition-all ease-linear  text-card-foreground hover:border-ring ">
                        <i class="pi pi-file-plus"> </i>

                        <button class=" ">Add Menu Item</button>
                    </div>


        </div>
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div class="w-full xl:max-w-sm">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search menu item"
                    class="w-full rounded-2xl border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground outline-none focus:border-ring"
                >
            </div>

            <div class="flex flex-wrap gap-2 xl:justify-end">
                <button
                    type="button"
                    class="rounded-2xl border uppercase px-3 py-1 text-sm transition-colors"
                    :class="selectedCategory === '' ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'"
                    @click="selectedCategory = ''"
                >
                   All Categories
                </button>

                <button
                    v-for="category in (menu_category ?? [])"
                    :key="category"
                    type="button"
                    class="rounded-2xl border px-3 py-1 text-sm transition-colors"
                    :class="selectedCategory === category ? 'bg-primary text-primary-foreground border-primary' : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'"
                    @click="selectedCategory = category"
                >
                    {{ category.replaceAll('_', ' ') }}
                </button>
            </div>
        </div>

        <div v-if="showMenuSkeletons" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <MenuComponentsMenuItemCardSkeleton
                v-for="index in 10"
                :key="`menu-skeleton-${index}`"
            />
        </div>

        <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4  xl:grid-cols-5">
            <div v-for="item in filteredMenuItems" :key="item.id" class="w-full max-w-85">
                <MenuComponentsMenuItemCard
                    :item="item"
                    @edit="openEditModal"
                    @view="openViewSidebar"
                    @toggle-availability="update_availability"
                />
            </div>
        </div>
 
        <div v-if="!showMenuSkeletons && filteredMenuItems.length === 0" class=" flex justify-center items-center  h-[80vh]"> 
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

        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <MenuComponentsMenuItemDetailsSidebar
                v-if="showViewSidebar && selectedViewMenuItem"
                :item="selectedViewMenuItem"
                @close="closeViewSidebar"
            />
        </Transition>

        <Transition>
            <MenuComponentsAddMenuItemModal
                v-if="showAddModal"
                :is-creating="isCreatingMenuItem"
                @close="closeAddModal"
                @create="createMenuItem"
            />
        </Transition>
    </main>
</template>