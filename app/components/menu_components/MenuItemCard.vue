<script setup lang="ts">
import type { MenuItem } from '~/generated/prisma/client';

interface MenuCategory {
	name: string
	icon?: string
}

const props = defineProps<{
	item: MenuItem
	category?: MenuCategory
}>()

const emit = defineEmits<{
	toggleAvailability: [id: string]
}>()

const fallbackImage =
	"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"

const isAvailable = computed(() => props.item.isAvailable ?? true)

const categoryLabel = computed(() => {
	if (props.category?.name) return props.category.name
	return props.item.category.replaceAll('_', ' ')
})

const categoryIcon = computed(() => props.category?.icon ?? '🥗')

const formattedPrice = computed(() => `$${(props.item.priceCents / 100).toFixed(2)}`)


</script>

<template>
	<div class="group w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
		<div class="relative h-44 w-full overflow-hidden">
			<img
				:src="item.imageUrl || fallbackImage"
				:alt="item.name"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			
			>

			<div class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-card/90 px-2.5 py-1 text-xs font-medium text-card-foreground">
				{{ categoryIcon }} {{ categoryLabel }}
			</div>

			<div v-if="!isAvailable" class="absolute inset-0 flex items-center justify-center bg-black/30">
				<span class="rounded-md bg-card px-3 py-1 text-xs font-semibold text-card-foreground">
					Unavailable
				</span>
			</div>
		</div>

		<div class="space-y-3 p-4">
			<div class="flex items-start justify-between gap-3">
				<h3 class="text-lg font-semibold leading-tight">
					{{ item.name }}
				</h3>

				<p class="text-lg font-semibold">
					{{ formattedPrice }}
				</p>
			</div>

			<p class="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
				{{ item.description || "No description provided." }}
			</p>

			<div class="flex items-center justify-between border-t border-border pt-3">
				<span class="text-sm" :class="isAvailable ? 'text-primary' : 'text-muted-foreground'">
					{{ isAvailable ? 'Available' : 'Unavailable' }}
				</span>

				<button
					type="button"
					class="inline-flex h-6 w-11 items-center rounded-full bg-muted p-0.5 transition-colors"
					role="switch"
					:aria-checked="isAvailable"
					:class="isAvailable ? 'bg-primary' : 'bg-muted'"
					@click="emit('toggleAvailability', item.id)"
				>
					<span
						class="h-5 w-5 rounded-full bg-card shadow transition-transform"
						:class="isAvailable ? 'translate-x-5' : 'translate-x-0'"
					/>
				</button>
			</div>
		</div>
	</div>
</template>
