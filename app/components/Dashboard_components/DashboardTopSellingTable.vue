<script setup lang="ts">
import type { DashboardTopSellingItem } from '~~/types/dashboard-analytics'

const props = defineProps<{
	items: DashboardTopSellingItem[]
}>()

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value)
}

const availabilityBadgeClass: Record<'Available' | 'Unavailable', string> = {
	Available: 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-300',
	Unavailable: 'bg-slate-500/12 text-slate-600 dark:text-slate-300'
}
</script>

<template>
	<section class="min-w-0 rounded-4xl border border-border/70 bg-card p-6 shadow-sm">
		<div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
			<div class="space-y-1">
				<h2 class="text-xl font-semibold tracking-tight text-foreground">Top-selling items</h2>
				<p class="text-sm text-muted-foreground">
					Best performers from the last 30 days based on units sold and captured revenue.
				</p>
			</div>

			<div class="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
				{{ items.length }} ranked menu items
			</div>
		</div>

		<div class="mt-6 w-full max-w-full overflow-x-auto">
			<table class="min-w-180 w-full border-separate border-spacing-y-3 xl:min-w-0">
				<colgroup>
					<col class="w-[28%]">
					<col class="w-[18%]">
					<col class="w-[12%]">
					<col class="w-[12%]">
					<col class="w-[15%]">
					<col class="w-[15%]">
				</colgroup>
				<thead>
					<tr class="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
						<th class="px-4 py-2 font-medium">Item</th>
						<th class="px-4 py-2 font-medium">Category</th>
						<th class="px-4 py-2 font-medium">Orders</th>
						<th class="px-4 py-2 font-medium">Units</th>
						<th class="px-4 py-2 font-medium">Revenue</th>
						<th class="px-4 py-2 font-medium">Availability</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="item in items" :key="item.id" class="rounded-2xl bg-muted/40">
						<td class="rounded-l-3xl px-4 py-4 align-top">
							<div class="flex items-start gap-3">
								<div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-sm font-semibold text-primary dark:bg-primary/15">
									{{ item.name.split(' ').map(part => part[0]).join('').slice(0, 2) }}
								</div>
								<div>
									<p class="font-medium text-foreground">{{ item.name }}</p>
									<p class="text-sm text-muted-foreground">{{ item.category }}</p>
								</div>
							</div>
						</td>
						<td class="px-4 py-4 text-sm text-muted-foreground align-top">{{ item.category }}</td>
						<td class="px-4 py-4 text-sm font-medium text-foreground align-top">{{ item.orderCount }}</td>
						<td class="px-4 py-4 text-sm font-medium text-foreground align-top">{{ item.unitsSold }}</td>
						<td class="px-4 py-4 text-sm font-medium text-foreground align-top">{{ formatCurrency(item.revenue) }}</td>
						<td class="rounded-r-3xl px-4 py-4 align-top">
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="availabilityBadgeClass[item.availability]">
								{{ item.availability }}
							</span>
						</td>
					</tr>

					<tr v-if="!items.length">
						<td colspan="6" class="rounded-3xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
							No completed order item data found for the current analytics period.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
