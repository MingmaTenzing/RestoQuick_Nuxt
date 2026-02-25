<script setup lang="ts">
import type { MenuItem } from '~/generated/prisma/client'

definePageMeta({
    layout: 'dashboard-layout'
})

const exampleMenuItem: MenuItem = {
    id: 'example-menu-item-1',
    name: 'Classic Margherita Pizza',
    description: 'Fresh basil, tomato sauce, and mozzarella cheese.',
    priceCents: 1599,
    category: 'MAIN_COURSE',
    imageUrl: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
    isAvailable: true
}

const { data: menuItems } = await useFetch<MenuItem[]>('/api/menu-items')

const itemsToRender = computed(() => {
    if (menuItems.value?.length) return menuItems.value
    return [exampleMenuItem]
})
</script>

<template>
    <main class="min-h-screen p-4 sm:p-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            <div v-for="item in itemsToRender" :key="item.id" class="w-full max-w-85">
                <MenuComponentsMenuItemCard :item="item" />
            </div>
        </div>
    </main>
</template>