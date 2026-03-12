<script setup lang="ts">
import type { MenuCategory } from '~/generated/prisma/browser'

defineProps<{
    categories: MenuCategory[]
    searchQuery: string
    selectedCategory: MenuCategory | ''
}>()

const emit = defineEmits<{
    (e: 'search-change', value: string): void
    (e: 'category-change', value: MenuCategory | ''): void
}>()

const updateSearch = (event: Event) => {
    emit('search-change', (event.target as HTMLInputElement).value)
}

const formatCategory = (category: string) => category.replaceAll('_', ' ')
</script>

<template>
    <section class="rounded-3xl border border-border bg-card p-4 shadow-sm md:p-5">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p class="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">Menu control</p>
                    <h2 class="mt-1 text-lg font-semibold text-foreground">Search and filter</h2>
                </div>

                <div class="relative w-full lg:max-w-sm">
                    <i class="pi pi-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground"></i>
                    <input
                        :value="searchQuery"
                        type="text"
                        placeholder="Search menu item or description"
                        class="w-full rounded-2xl border border-input bg-background py-3 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                        @input="updateSearch"
                    >
                </div>
            </div>

            <div class="flex flex-wrap gap-2">
                <button
                    type="button"
                    class="rounded-full border px-3 py-2 text-sm font-medium transition-colors"
                    :class="selectedCategory === '' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'"
                    @click="emit('category-change', '')"
                >
                    All items
                </button>

                <button
                    v-for="category in categories"
                    :key="category"
                    type="button"
                    class="rounded-full border px-3 py-2 text-sm font-medium uppercase tracking-[0.1em] transition-colors"
                    :class="selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground'"
                    @click="emit('category-change', category)"
                >
                    {{ formatCategory(category) }}
                </button>
            </div>
        </div>
    </section>
</template>