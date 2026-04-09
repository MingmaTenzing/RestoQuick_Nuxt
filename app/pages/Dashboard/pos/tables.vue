<script lang="ts" setup>
definePageMeta({
	layout: 'dashboard-layout'
})

import type { Table } from '~/generated/prisma/browser'
import Table_Card from '~/components/pos_components/Table_Card.vue'

const { data: tables, pending } = await useFetch<Table[]>('/api/tables')

const searchQuery = ref('')

const filteredTables = computed(() => {
	const allTables = tables.value ?? []
	const normalizedQuery = searchQuery.value.trim().toLowerCase()

	if (!normalizedQuery) {
		return allTables
	}

	return allTables.filter((table) => {
		return table.number.toLowerCase().includes(normalizedQuery) || String(table.capacity).includes(normalizedQuery)
	})
})
</script>


<template>
	<main class="space-y-8">
		<section class="rounded-4xl border border-border bg-card p-6 shadow-sm md:p-8">
			<div class="max-w-3xl space-y-4">
			<NuxtLink
				to="/dashboard/pos"
				class="inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
			>
				<i class="pi pi-arrow-left text-sm"></i>
				<span>Back to POS</span>
			</NuxtLink>

			<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dining service</p>
			<h1 class="text-2xl font-semibold text-foreground md:text-4xl">Choose a table</h1>
			<p class="text-sm leading-6 text-muted-foreground md:text-base">
				Select a table here and you will be redirected to the order page for that table.
			</p>
			</div>
		</section>

		<section class="rounded-4xl border border-border bg-card p-5 shadow-sm md:p-6">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p class="text-sm font-medium text-foreground">Table overview</p>
					<p class="mt-1 text-sm text-muted-foreground">Browse active dining tables and start a new order in one tap.</p>
				</div>

				<div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
					<label class="relative block w-full max-w-md">
						<span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
							<i class="pi pi-search text-sm"></i>
						</span>
						<input
							v-model="searchQuery"
							type="search"
							placeholder="Search by table number or capacity"
							class="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
						>
					</label>

					<div class="inline-flex items-center gap-2 rounded-2xl bg-accent px-3 py-2 text-sm text-foreground">
						<i class="pi pi-th-large text-xs"></i>
						<span>{{ filteredTables.length }} of {{ tables?.length ?? 0 }} tables</span>
					</div>
				</div>
			</div>
		</section>

		<section v-if="pending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div
				v-for="index in 8"
				:key="index"
				class="h-56 animate-pulse rounded-4xl border border-border bg-card"
			></div>
		</section>

		<section v-else-if="filteredTables.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<NuxtLink
				v-for="table in filteredTables"
				:key="table.id"
				:to="`/dashboard/pos/order/${table.id}`"
				class="block h-full"
			>
				<Table_Card :table="table" />
			</NuxtLink>
		</section>

		<section v-else-if="tables?.length" class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
			<h2 class="text-xl font-semibold text-foreground">No matching tables</h2>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">
				Try another table number or search by seat capacity.
			</p>
		</section>

		<section v-else class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
			<h2 class="text-xl font-semibold text-foreground">No tables available</h2>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">
				Add your tables first before starting a dining order.
			</p>
		</section>
	</main>
</template>
