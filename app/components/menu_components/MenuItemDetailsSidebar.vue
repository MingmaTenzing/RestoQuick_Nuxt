<script setup lang="ts">
import type { MenuItem, MenuOption } from '~/generated/prisma/browser'

type MenuItemWithOptions = MenuItem & {
  options: MenuOption[]
}

const props = defineProps<{
  item: MenuItemWithOptions
}>()

const emit = defineEmits<{
  close: []
}>()

const fallbackImage =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'

const formattedPrice = computed(() => `$${(props.item.priceCents / 100).toFixed(2)}`)
const formattedCategory = computed(() => props.item.category.replaceAll('_', ' '))
</script>

<template>
  <div class="fixed inset-0 z-50">
    <div class="absolute inset-0 bg-black/40" @click="emit('close')" />

    <aside
      class="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl"
    >
      <div class="space-y-6 p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-2">
            <div class="inline-flex items-center rounded-full border border-sidebar-border bg-sidebar-accent px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-sidebar-accent-foreground">
              {{ formattedCategory }}
            </div>

            <div>
              <h2 class="text-2xl font-semibold tracking-tight text-sidebar-foreground">
                {{ item.name }}
              </h2>
              <p class="text-sm text-muted-foreground">
                {{ item.isAvailable ? 'Available for ordering' : 'Currently unavailable' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md border border-sidebar-border px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            @click="emit('close')"
          >
            Close
          </button>
        </div>

        <div class="overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar-accent/40">
          <NuxtImg
            :src="item.imageUrl || fallbackImage"
            :alt="item.name"
            class="h-64 w-full object-cover"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Base Price</p>
            <p class="mt-2 text-3xl font-semibold text-sidebar-foreground">
              {{ formattedPrice }}
            </p>
          </div>

          <div class="rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-muted-foreground">Options</p>
            <p class="mt-2 text-3xl font-semibold text-sidebar-foreground">
              {{ item.options.length }}
            </p>
          </div>
        </div>

        <section class="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-5">
          <div class="mb-3 flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Description
            </h3>
          </div>

          <p class="text-sm leading-7 text-sidebar-foreground/90">
            {{ item.description || 'No description provided for this menu item.' }}
          </p>
        </section>

        <section class="rounded-2xl border border-sidebar-border bg-sidebar-accent/30 p-5">
          <div class="mb-4 flex items-center justify-between gap-3">
            <h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Menu Options
            </h3>
            <span class="text-xs text-muted-foreground">
              {{ item.options.length ? 'Available add-ons' : 'No add-ons configured' }}
            </span>
          </div>

          <div v-if="item.options.length" class="space-y-3">
            <div
              v-for="option in item.options"
              :key="option.id"
              class="flex items-center justify-between rounded-xl border border-sidebar-border bg-sidebar px-4 py-3"
            >
              <div>
                <p class="text-sm font-medium text-sidebar-foreground">
                  {{ option.name }}
                </p>
                <p class="text-xs text-muted-foreground">Optional upgrade</p>
              </div>

              <div class="text-sm font-semibold text-sidebar-foreground">
                ${{ (option.priceCents / 100).toFixed(2) }}
              </div>
            </div>
          </div>

          <div
            v-else
            class="rounded-xl border border-dashed border-sidebar-border bg-sidebar px-4 py-6 text-sm text-muted-foreground"
          >
            This menu item does not have any options yet.
          </div>
        </section>
      </div>
    </aside>
  </div>
</template>