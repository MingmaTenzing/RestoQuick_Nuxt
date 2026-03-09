
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
	    	<section class="relative overflow-hidden rounded-4xl border border-border/70 bg-card text-card-foreground shadow-sm">

			<div class="relative flex flex-col gap-8 p-6 sm:p-8 xl:flex-row xl:items-end xl:justify-between xl:p-10">
				<div class="max-w-3xl space-y-5">
					<div class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
						<span class="h-2 w-2 rounded-full bg-emerald-500" />
						Live dashboard
					</div>

					<div class="space-y-3">
						<p class="text-sm font-medium text-muted-foreground">
							{{ greeting }}, Mingma
						</p>
						<h1 class="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl xl:text-5xl">
							Everything you need for today’s service.
						</h1>
						<p class="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
							Bookings, kitchen, and menu in one place.
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<div class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
							<i class="pi pi-calendar text-xs text-primary" />
							<span>{{ todayLabel }}</span>
						</div>
						<div class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
							<i class="pi pi-bolt text-xs text-amber-500" />
							<span>Peak window in 45 min</span>
						</div>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-3 xl:w-105 xl:grid-cols-1">
					<NuxtLink
						v-for="action in quickActions"
						:key="action.to"
						:to="action.to"
						class="group flex items-center justify-between rounded-2xl border border-border/70 bg-background/80 px-4 py-4 text-sm font-medium text-foreground shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
					>
						<div class="flex items-center gap-3">
							<span class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
								<i class="pi" :class="action.icon" />
							</span>
							<span>{{ action.label }}</span>
						</div>
						<i class="pi pi-arrow-up-right text-xs text-muted-foreground transition group-hover:text-primary" />
					</NuxtLink>
				</div>
			</div>
		</section>

    </template>