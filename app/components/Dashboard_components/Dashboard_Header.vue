
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
		label: 'Open kitchen board',
		to: '/dashboard/kitchen',
		icon: 'pi-objects-column',
	},
	{
		label: 'Manage menu',
		to: '/dashboard/menu',
		icon: 'pi-book',
	},
] 
</script>

<template>
    	<section class="relative overflow-hidden rounded-[2rem] border border-border/70 bg-gradient-to-br from-card via-card to-primary/10 text-card-foreground shadow-sm">
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.14),transparent_24%)]" />

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
							Keep service smooth with a clear view of bookings, staff, and kitchen activity.
						</h1>
						<p class="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
							Monitor today’s performance, jump into the busiest workflows, and keep the whole restaurant aligned from one place.
						</p>
					</div>

					<div class="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
						<div class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
							<i class="pi pi-calendar text-xs text-primary" />
							<span>{{ todayLabel }}</span>
						</div>
						<div class="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
							<i class="pi pi-bolt text-xs text-amber-500" />
							<span>Peak prep window starts in 45 minutes</span>
						</div>
					</div>
				</div>

				<div class="grid gap-3 sm:grid-cols-3 xl:w-[420px] xl:grid-cols-1">
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