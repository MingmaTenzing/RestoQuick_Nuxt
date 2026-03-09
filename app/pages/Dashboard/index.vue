<script setup lang="ts">
import Monthly_Revenue from '~/components/Dashboard_components/Monthly_Revenue.vue'
import DummyStatsCard from '~/components/ui/DummyStatsCard.vue'

definePageMeta({
	layout: 'dashboard-layout',
})


const { data } = await useFetch('/api/orders?range=week')

console.log(data.value)

const stats = [
	{
		title: 'Today\'s bookings',
		value: '48',
		change: '+12%',
		headline: 'Busy lunch service ahead',
		description: 'Confirmed reservations scheduled across all dining zones',
	},
	{
		title: 'Kitchen throughput',
		value: '96%',
		change: '+4%',
		headline: 'Orders moving on time',
		description: 'Average prep pace is holding steady during peak periods',
	},
	{
		title: 'Team coverage',
		value: '18 staff',
		change: 'On track',
		headline: 'Roster fully covered',
		description: 'Front of house and kitchen shifts are staffed for the day',
	},
] 

</script>

<template>
	<div class="space-y-6 pb-8">

	<!-- <DashboardComponentsDashboardHeader></DashboardComponentsDashboardHeader> -->
		<section class="grid gap-4 lg:grid-cols-3">
			<DummyStatsCard
				v-for="stat in stats"
				:key="stat.title"
				:title="stat.title"
				:value="stat.value"
				:change="stat.change"
				:headline="stat.headline"
				:description="stat.description"
			/>
		</section>

		<section>

		<Monthly_Revenue></Monthly_Revenue>
		</section>

	</div>
</template>