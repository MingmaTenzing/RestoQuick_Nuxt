<script setup lang="ts">
import type { MenuItemWithOptions } from '~~/types/menu';



const props = defineProps<{
	item: MenuItemWithOptions
}>()

const emit = defineEmits<{
	toggleAvailability: [item: MenuItemWithOptions]
	edit: [item: MenuItemWithOptions]
	view: [item: MenuItemWithOptions]
}>()

const fallbackImage =
	"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"

const isAvailable = computed(() => props.item.isAvailable ?? true)


const formattedPrice = computed(() => `$${(props.item.priceCents / 100).toFixed(2)}`)




</script>

<template>
	<div class="group w-full overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
		<div class="relative h-44 w-full overflow-hidden">
			<img
				:src="item.imageUrl || fallbackImage"
				:alt="item.name"
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			
			>

			<div class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-2xl bg-card/90 px-2.5 py-1 text-xs font-medium text-card-foreground">
				 {{ props.item.category }}
			</div>

			<div v-if="!isAvailable" class="absolute inset-0 flex items-center justify-center bg-black/30">
				<span class="rounded-2xl bg-card px-3 py-1 text-xs font-semibold text-card-foreground">
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
				<div class=" flex items-center space-x-2">

					 <button
		 type="button"
		 class="inline-flex h-6 w-11 items-center rounded-full  p-0.5 transition-colors"
		 role="switch"
		 :aria-checked="isAvailable"
		 :class="isAvailable ? 'bg-green-600' : 'bg-muted'"
		 @click="emit('toggleAvailability', item)"
	 >
		 <span
			 class="h-5 w-5 rounded-full bg-card shadow transition-transform"
			 :class="isAvailable ? 'translate-x-5' : 'translate-x-0'"
		 />
	 </button>
					<span class="text-sm" :class="isAvailable ? 'text-primary' : 'text-muted-foreground'">
						{{ isAvailable ? 'Available' : 'Unavailable' }}
					</span>

				</div>
				<div class="flex items-center space-x-2">
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-2xl border transition-colors hover:bg-accent hover:text-accent-foreground"
						@click="emit('view', item)"
					>
						<i class="pi pi-eye"></i>
					</button>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-2xl border transition-colors hover:bg-accent hover:text-accent-foreground"
						@click="emit('edit', item)"
					>
						<i class="pi pi-pencil"></i>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
