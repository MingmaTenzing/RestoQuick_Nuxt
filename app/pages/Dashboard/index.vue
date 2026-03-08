<script setup lang="ts">
import DummyStatsCard from '~/components/ui/DummyStatsCard.vue'

definePageMeta({
	layout: 'dashboard-layout',
})


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

	<DashboardComponentsDashboardHeader></DashboardComponentsDashboardHeader>
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
	</div>
</template>