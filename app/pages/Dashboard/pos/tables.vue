<script lang="ts" setup>
import type { Table } from '~/generated/prisma/browser'
import Table_Card from '~/components/pos_components/Table_Card.vue'

definePageMeta({
	layout: 'dashboard-layout'
})

const { data: tables, pending } = await useFetch<Table[]>('/api/tables')
</script>


<template>
	<main class="space-y-8">
		<section class="max-w-3xl space-y-3">
			<NuxtLink
				to="/dashboard/pos"
				class="inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
			>
				<i class="pi pi-arrow-left text-sm"></i>
				<span>Back to POS</span>
			</NuxtLink>

			<p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Dining service</p>
			<h1 class="text-2xl md:text-4xl">Choose a table</h1>
			<p class="text-sm leading-6 text-muted-foreground md:text-base">
				Select a table here and you will be redirected to the order page for that table.
			</p>
		</section>

		<section v-if="pending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<div
				v-for="index in 8"
				:key="index"
				class="h-56 animate-pulse rounded-3xl border border-border bg-card"
			></div>
		</section>

		<section v-else-if="tables?.length" class="grid gap-6 md:grid-cols-4 xl:grid-cols-4">
			<NuxtLink
				v-for="table in tables"
				:key="table.id"
				:to="`/dashboard/pos/order/${table.id}`"
				class=""
			>
				<Table_Card :table="table" />
			</NuxtLink>
		</section>

		<section v-else class="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
			<h2 class="text-xl font-semibold text-foreground">No tables available</h2>
			<p class="mt-2 text-sm leading-6 text-muted-foreground">
				Add your tables first before starting a dining order.
			</p>
		</section>
	</main>
</template>
