<script setup lang="ts">
definePageMeta({
	layout: 'dashboard-layout',
	middleware: ['is-admin']
})

import Dashboard_Header from '~/components/Dashboard_components/Dashboard_Header.vue'
import Dashboard_KPI from '~/components/Dashboard_components/Dashboard_KPI.vue'
import Monthly_Revenue from '~/components/Dashboard_components/Monthly_Revenue.vue'
import Recent_Orders from '~/components/Dashboard_components/Recent_Orders.vue'
import SoldbyCategory_Piechart from '~/components/Dashboard_components/SoldbyCategory_Piechart.vue'
import TopSelling_Items from '~/components/Dashboard_components/TopSelling_Items.vue'


type WeeklyKpi = {
	revenueCents: number
	weeklyOrderCount: number
	todayBookingsCount: number
	weeklyShiftCostCents: number
	startofWeek: string | Date
	endOfWeek: string | Date
}

const { data: weeklyKpi } = await useFetch<WeeklyKpi>('/api/dashboard/stats/weekly-kpi')

const formatCurrency = (cents: number) => {
	return `$${(cents / 100).toFixed(2)}`
}

const stats = computed(() => {
	const revenueCents = weeklyKpi.value?.revenueCents ?? 0
	const weeklyOrderCount = weeklyKpi.value?.weeklyOrderCount ?? 0
	const todayBookingsCount = weeklyKpi.value?.todayBookingsCount ?? 0
	const weeklyShiftCostCents = weeklyKpi.value?.weeklyShiftCostCents ?? 0

	return [
		{
			title: 'Weekly revenue',
			value: formatCurrency(revenueCents),
			change: 'This week',
			headline: 'Completed orders captured',
			description: 'Revenue from completed orders during the current week',
		},
		{
			title: 'Weekly orders',
			value: String(weeklyOrderCount),
			change: 'This week',
			headline: 'Orders placed so far',
			description: 'All order statuses counted for the current week',
		},
		{
			title: 'Today\'s bookings',
			value: String(todayBookingsCount),
			change: 'Today',
			headline: 'Bookings on the floor',
			description: 'Reservations scheduled between today\'s opening and close',
		},
		{
			title: 'Weekly shift cost',
			value: formatCurrency(weeklyShiftCostCents),
			change: 'Labour',
			headline: 'Rostered payroll estimate',
			description: 'Calculated from shift duration and each staff hourly rate',
		},
	]
})

</script>

<template>
	<div class="space-y-6 pb-8 w-full">
		<Dashboard_Header></Dashboard_Header>

		<!-- <DashboardComponentsDashboardHeader></DashboardComponentsDashboardHeader> -->
		<section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<Dashboard_KPI v-for="stat in stats" :key="stat.title" :title="stat.title" :value="stat.value"
				:change="stat.change" :headline="stat.headline" :description="stat.description" />
		</section>

		<section class="grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-stretch">
			<TopSelling_Items class="min-w-0 w-full" />
			<Monthly_Revenue class="min-w-0 w-full" />
		</section>


		<SoldbyCategory_Piechart></SoldbyCategory_Piechart>
		<Recent_Orders />



	</div>
</template>