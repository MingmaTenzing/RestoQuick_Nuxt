<script setup lang="ts">
type RecentOrder = {
	id: string
	orderNo: number
	customerName: string
	status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
	orderType: 'TAKEAWAY' | 'DINING' | 'UBER'
	totalAmountCents: number
	createdAt: string | Date
	tableNumber: string | null
	itemCount: number
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const { data: recentOrders, status } = await useLazyFetch<RecentOrder[]>('/api/dashboard/stats/recent-order')

const statusClasses: Record<RecentOrder['status'], string> = {
	PENDING: 'bg-amber-500/12 text-amber-700 dark:text-amber-300',
	COMPLETED: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300',
	CANCELLED: 'bg-rose-500/12 text-rose-700 dark:text-rose-300',
}

const orderTypeClasses: Record<RecentOrder['orderType'], string> = {
	DINING: 'bg-sky-500/12 text-sky-700 dark:text-sky-300',
	TAKEAWAY: 'bg-violet-500/12 text-violet-700 dark:text-violet-300',
	UBER: 'bg-fuchsia-500/12 text-fuchsia-700 dark:text-fuchsia-300',
}

const formatOrderDate = (value: string | Date) => {
	const date = new Date(value)
	return `${date.getDate()} ${monthLabels[date.getMonth()]} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}
</script>

<template>
	<section class="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm">
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div>
				<h2 class="text-xl font-semibold tracking-tight text-card-foreground">
					Recent Orders
				</h2>
				<p class="text-sm text-muted-foreground">
					The latest five orders across dine-in, takeaway, and delivery.
				</p>
			</div>

			<div class="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
				{{ recentOrders?.length ?? 0 }} recent orders
			</div>
		</div>

		<div class="mt-6 overflow-x-auto">
			<table class="min-w-180 w-full border-separate border-spacing-y-3 xl:min-w-0">
				<thead>
					<tr class="text-left text-xs uppercase tracking-[0.2em] text-muted-foreground">
						<th class="px-4 py-2 font-medium">
							Order
						</th>
						<th class="px-4 py-2 font-medium">
							Customer
						</th>
						<th class="px-4 py-2 font-medium">
							Type
						</th>
						<th class="px-4 py-2 font-medium">
							Items
						</th>
						<th class="px-4 py-2 font-medium">
							Table
						</th>
						<th class="px-4 py-2 font-medium">
							Total
						</th>
						<th class="px-4 py-2 font-medium">
							Status
						</th>
						<th class="px-4 py-2 font-medium">
							Time
						</th>
					</tr>
				</thead>

				<tbody>
					<tr
						v-for="order in recentOrders ?? []"
						:key="order.id"
						class="rounded-2xl bg-muted/40"
					>
						<td class="rounded-l-3xl px-4 py-4 align-top">
							<div>
								<p class="font-medium text-card-foreground">
									#{{ order.orderNo }}
								</p>
							
							</div>
						</td>
						<td class="px-4 py-4 text-sm text-card-foreground align-top">
							{{ order.customerName }}
						</td>
						<td class="px-4 py-4 align-top">
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="orderTypeClasses[order.orderType]">
								{{ order.orderType }}
							</span>
						</td>
						<td class="px-4 py-4 text-sm font-medium text-card-foreground align-top">
							{{ order.itemCount }}
						</td>
						<td class="px-4 py-4 text-sm text-muted-foreground align-top">
							{{ order.tableNumber ?? '—' }}
						</td>
						<td class="px-4 py-4 text-sm font-medium text-card-foreground align-top">
							${{ (order.totalAmountCents / 100).toFixed(2) }}
						</td>
						<td class="px-4 py-4 align-top">
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold" :class="statusClasses[order.status]">
								{{ order.status }}
							</span>
						</td>
						<td class="rounded-r-3xl px-4 py-4 text-sm text-muted-foreground align-top">
							{{ formatOrderDate(order.createdAt) }}
						</td>
					</tr>

					<tr v-if="status === 'pending'">
						<td colspan="8" class="rounded-3xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
							Loading recent orders...
						</td>
					</tr>

					<tr v-else-if="!(recentOrders?.length)">
						<td colspan="8" class="rounded-3xl bg-muted/40 px-4 py-10 text-center text-sm text-muted-foreground">
							No recent orders found.
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
