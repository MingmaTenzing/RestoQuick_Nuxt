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
    <article class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div class="relative aspect-4/3 overflow-hidden bg-accent/40">
            <NuxtImg
                v-if="item.imageUrl"
                :src="item.imageUrl"
                width="640"
                height="400"
                class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-sm text-muted-foreground">
                No image available
            </div>

            <div class="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur-sm">
                {{ formatCategory(item.category) }}
            </div>
        </div>

        <div class="space-y-4 p-4">
            <div class="flex items-center justify-between ">
                <div class="">
                    <h3 class="text-lg font-semibold leading-tight text-foreground">{{ item.name }}</h3>
             
                </div>

                <div class="shrink-0 rounded-2xl border border-border bg-accent px-3 py-2 text-right">
                    <p class=" text-base font-semibold text-foreground">${{ (item.priceCents / 100).toFixed(2) }}</p>
                </div>
            </div>

            <div class="">
             


                <button
                  
                    type="button"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    @click="emit('add')"
                >
                    <i class="pi pi-plus text-xs"></i>
                    <span>Add item</span>
                </button>
            </div>
        </div>
    </article>
</template>