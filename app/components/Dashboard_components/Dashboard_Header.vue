
<script setup lang="ts">

const currentHour = new Date().getHours()


const todayLabel = new Intl.DateTimeFormat('en-AU', {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	year: 'numeric',
}).format(new Date())



const greeting = currentHour < 12
	? 'Good morning'
	: currentHour < 18
		? 'Good afternoon'
		: 'Good evening'

const quickActions = [
	{
		label: 'View bookings',
		to: '/dashboard/bookings',
		icon: 'pi-calendar',
	},
	{
		label: 'Kitchen board',
		to: '/dashboard/kitchen',
		icon: 'pi-objects-column',
	},
	{
		label: 'Menu',
		to: '/dashboard/menu',
		icon: 'pi-book',
	},
] 
</script>

<template>
	<section class="rounded-3xl border border-border/70 bg-card text-card-foreground shadow-sm">
		<div class="flex flex-col gap-6 p-6 sm:p-8 xl:flex-row xl:items-end xl:justify-between">
			<div class="space-y-4">
				<div class="space-y-2">
					<p class="text-sm font-medium text-muted-foreground">
						{{ greeting }}, Mingma
					</p>
					<h1 class="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
						Dashboard overview
					</h1>
					<p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
						Bookings, orders, and service activity for today.
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
					<div class="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
						<i class="pi pi-calendar text-xs" />
						<span>{{ todayLabel }}</span>
					</div>
				</div>
			</div>

			<div class="flex flex-wrap items-center gap-2 xl:justify-end">
				<NuxtLink
					v-for="action in quickActions"
					:key="action.to"
					:to="action.to"
					class="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
				>
					<i class="pi" :class="action.icon" />
					<span>{{ action.label }}</span>
				</NuxtLink>
			</div>
		</div>
	</section>

    </template>