<script setup lang="ts">
defineProps<{
	title?: string
	value?: string
	change?: string
	headline?: string
	description?: string
}>()
</script>

<template>
	<div class="rounded-lg border border-border/70 bg-card text-card-foreground shadow-sm">
		<div class="p-4 sm:p-6">
			<div class="space-y-2">
				<div>
					<div class="flex items-start justify-between gap-4">
						<div class="space-y-4">
							<div class="text-sm text-foreground/80 dark:text-muted-foreground">
								{{ title ?? 'Active Users' }}
							</div>
							<div class="text-4xl font-bold tabular-nums text-foreground sm:text-3xl">
								{{ value ?? '2,450' }}
							</div>
						</div>

						<span class="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground ring-1 ring-inset ring-border">
							{{ change ?? '+18.2%' }}
						</span>
					</div>
				</div>

				<div class="space-y-2">
					<div class="flex items-center gap-2 font-medium text-foreground">
						<span class="line-clamp-1">{{ headline ?? 'Growing steadily' }}</span>
						<i class="pi pi-chart-line text-sm" />
					</div>
					<div class="text-sm text-muted-foreground">
						{{ description ?? 'Active users in the last 30 days' }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
