<script setup lang="ts">
import type { MenuItem } from '~/generated/prisma/browser'

defineProps<{
    item: MenuItem
    quantityInCart: number
}>()

const emit = defineEmits<{
    (e: 'add'): void
    (e: 'increase'): void
    (e: 'decrease'): void
}>()

const formatCategory = (category: string) => category.replaceAll('_', ' ')
</script>

<template>
    <article class="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-ring hover:shadow-md">
        <div class="relative aspect-[4/3] overflow-hidden bg-accent/40">
            <NuxtImg
                v-if="item.imageUrl"
                :src="item.imageUrl"
                width="640"
                height="400"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div v-else class="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image available
            </div>

            <div class="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                {{ formatCategory(item.category) }}
            </div>
        </div>

        <div class="space-y-4 p-4">
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-1.5">
                    <h3 class="text-lg font-semibold leading-tight text-foreground">{{ item.name }}</h3>
                    <p class="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                        {{ item.description || 'Chef-ready item with no extra notes added yet.' }}
                    </p>
                </div>

                <div class="shrink-0 rounded-2xl border border-border bg-background px-3 py-2 text-right">
                    <p class="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Price</p>
                    <p class="mt-1 text-base font-semibold text-foreground">${{ (item.priceCents / 100).toFixed(2) }}</p>
                </div>
            </div>

            <div class="flex items-center justify-between gap-3">
                <p class="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {{ quantityInCart }} in current order
                </p>

                <div v-if="quantityInCart > 0" class="flex items-center gap-2 rounded-full border border-border bg-background p-1">
                    <button
                        type="button"
                        class="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent"
                        @click="emit('decrease')"
                    >
                        <i class="pi pi-minus text-xs"></i>
                    </button>
                    <span class="min-w-6 text-center text-sm font-semibold text-foreground">{{ quantityInCart }}</span>
                    <button
                        type="button"
                        class="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                        @click="emit('increase')"
                    >
                        <i class="pi pi-plus text-xs"></i>
                    </button>
                </div>

                <button
                    v-else
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                    @click="emit('add')"
                >
                    <i class="pi pi-plus text-xs"></i>
                    <span>Add item</span>
                </button>
            </div>
        </div>
    </article>
</template>