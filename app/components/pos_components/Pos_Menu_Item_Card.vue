<script setup lang="ts">
import type { MenuOption } from '~/generated/prisma/client';
import type { MenuOptionCreateWithoutMenuItemInput, MenuOptionCreateWithoutOrderItemOptionsInput, MenuOptionUncheckedCreateInput, MenuOptionUncheckedCreateWithoutMenuItemInput } from '~/generated/prisma/models';
import type { MenuItemWithOptions } from '~~/types/menu';

const props = defineProps<{
    item: MenuItemWithOptions
    quantityInCart: number
}>()

const emit = defineEmits<{
    (e: 'add'): void
    (e: 'increase'): void
    (e: 'decrease'): void
}>()

const formatCategory = (category: string) => category.replaceAll('_', ' ')

console.log(props.item.options)

const selected_menu_options = ref<MenuOption[]>([])


const add_option = (option: MenuOption) => {
    const existing_option_index = selected_menu_options.value.findIndex((item) => item.id === option.id)

    if (existing_option_index === -1) {
        selected_menu_options.value.push(option)
        return
    }

    selected_menu_options.value.splice(existing_option_index, 1)
}
const show_menu_options = ref(false)
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

            <div class=" flex flex-row  justify-between items-center ">
             


                <button
                  
                    type="button"
                    class="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-2 text-sm font-medium text-primary-foreground"
                    @click="show_menu_options = true"
                >
                    <i class="pi pi-plus text-xs"></i>
                    <span>Add item</span>
                </button>
             
            </div>
        </div>
    </article>



    <!--the add menu options modal...  -->

    <div v-if="show_menu_options" class="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/40 p-4" :aria-hidden="!show_menu_options">
        <div class="w-full max-w-lg rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-6">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Menu options</p>
                    <h4 class="mt-1 text-xl font-semibold text-foreground">{{ item.name }} options</h4>
                </div>
                <button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground" @click="show_menu_options = false">
                    <i class="pi pi-times text-sm"></i>
                </button>
            </div>

            <div class="mt-5 space-y-3">
                <p class="text-sm font-medium text-foreground">Select options</p>
                <div v-if="item.options?.length" class="max-h-80 space-y-2 overflow-y-auto pr-1">
                    <label
                        v-for="option in item.options"
                        :key="option.id"
                        class="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-accent/40 px-3 py-2.5 transition-colors hover:bg-accent/70"
                    >
                        <span class="flex items-center gap-2 text-sm text-foreground">
                            <input
                                type="checkbox"
                                class="h-4 w-4 accent-primary"
                                :checked="selected_menu_options.some((selected_option) => selected_option.id === option.id)"
                                @change="add_option(option)"
                            />
                            <span>{{ option.name }}</span>
                        </span>
                        <p class="text-sm font-medium text-muted-foreground">${{ (option.priceCents / 100).toFixed(2) }}</p>
                    </label>
                </div>
                <div v-else class="rounded-2xl border border-dashed border-border px-3 py-5 text-center text-sm text-muted-foreground">
                    No options added yet.
                </div>
            </div>

            <div class="mt-6 space-y-3 border-t border-border pt-5">
             

                <div class="flex flex-wrap items-center justify-end gap-2 pt-2">
                    <button type="button" class="inline-flex h-10 items-center justify-center rounded-full border border-border bg-secondary px-4 text-sm font-medium text-secondary-foreground hover:bg-accent hover:text-accent-foreground" @click="show_menu_options = false">
                        Cancel
                    </button>
                    <button type="button" class="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground">
                        Add Item
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>