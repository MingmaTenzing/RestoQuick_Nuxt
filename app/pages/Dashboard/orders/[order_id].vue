<script setup lang="ts">
import { computed } from 'vue'
import { de } from 'zod/v4/locales'
import { OrderStatus } from '~/generated/prisma/enums'
import type { OrderDetailsWithInclude } from '~~/types/orderwithInclude'

definePageMeta({
	layout: 'dashboard-layout'
})

const route = useRoute()
const toast = useToast()

const order_id = route.params.order_id

const { data: order_details, status, refresh } = await useFetch<OrderDetailsWithInclude>(`/api/orders/${order_id}`)

const formatStatusLabel = (statusValue: string) => {
	return statusValue.charAt(0) + statusValue.slice(1).toLowerCase()
}

const placedAt = computed(() => {
	if (!order_details.value) return ''
	return new Date(order_details.value.createdAt).toLocaleString('en-AU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
})

const updatedAt = computed(() => {
	if (!order_details.value) return ''
	return new Date(order_details.value.updatedAt).toLocaleString('en-AU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
})

const itemCount = computed(() => {
	if (!order_details.value) return 0
	return order_details.value.items.reduce((sum, item) => sum + item.quantity, 0)
})

const orderTotal = computed(() => {
	if (!order_details.value) return 0
	return order_details.value.totalAmountCents / 100
})

const isUpdatingStatus = ref(false)
const availableStatuses = Object.values(OrderStatus) as OrderStatus[]

async function updateOrderStatus(nextStatus: OrderStatus) {
	if (!order_details.value || isUpdatingStatus.value) return

	try {
		isUpdatingStatus.value = true

		await $fetch('/api/orders', {
			method: 'PUT',
			body: {
				order_id: order_details.value.id,
				status: nextStatus,
			},
		})

		await refresh()

		toast.success({
			title: `Order ${formatStatusLabel(nextStatus)}`
		})
	} catch {
		toast.error({
			title: 'Failed to update order status'
		})
	} finally {
		isUpdatingStatus.value = false
	}
}
</script>

<template>
	<main class="space-y-6">
		<section class="flex items-center gap-2 text-sm text-muted-foreground">
			<NuxtLink to="/dashboard/orders" class="hover:text-foreground">Orders</NuxtLink>
			<i class="pi pi-angle-right text-xs"></i>
			<span class="font-semibold text-primary" v-if="order_details">#{{ order_details.orderNo }}</span>
		</section>

		<section v-if="status === 'pending'" class="space-y-4">
			<div class="h-10 w-52 rounded bg-muted animate-pulse"></div>
			<div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
				<div class="xl:col-span-2 h-60 rounded-2xl border border-border bg-card animate-pulse"></div>
				<div class="space-y-4">
					<div class="h-40 rounded-2xl border border-border bg-card animate-pulse"></div>
					<div class="h-56 rounded-2xl border border-border bg-card animate-pulse"></div>
				</div>
			</div>
		</section>

		<section v-else-if="order_details" class="space-y-5">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h1 class="text-3xl font-semibold">Details of Order No: {{ order_details.orderNo }}</h1>
					<p class="text-muted-foreground text-sm mt-1">
						<i class="pi pi-clock text-xs"></i>
						Placed <NuxtTime :datetime="new Date(order_details.createdAt).getTime()" relative /> • {{ placedAt }}
					</p>
				</div>

				<div class="flex items-center gap-2">
					<span class="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
						{{ order_details.orderType === 'UBER' ? 'Uber Eats' : order_details.orderType === 'DINING' ? 'Dine In' : 'Takeaway' }}
					</span>
					<span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium"
						:class="order_details.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
						order_details.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
						'bg-red-500/10 text-red-500 border-red-500/20'"
					>
						<span class="h-1.5 w-1.5 rounded-full bg-current"></span>
						{{ formatStatusLabel(order_details.status) }}
					</span>
				</div>
			</div>

			<div class="grid grid-cols-1 xl:grid-cols-3 gap-5">
				<div class="xl:col-span-2 space-y-4">
					<div class="rounded-2xl border border-border bg-card overflow-hidden">
						<div class="p-5 border-b border-border flex items-center justify-between">
							<h2 class="text-xl font-semibold text-primary">Order Items</h2>
							<span class="text-sm text-muted-foreground">({{ itemCount }} items)</span>
						</div>

						<div class="p-5 space-y-4">
							<div class="grid grid-cols-12 text-xs font-semibold text-muted-foreground uppercase border-b border-dashed border-border pb-3">
								<p class="col-span-6">Item</p>
								<p class="col-span-2 text-center">Qty</p>
								<p class="col-span-2 text-right">Unit</p>
								<p class="col-span-2 text-right">Total</p>
							</div>

							<div
								v-for="item in order_details.items"
								:key="item.id"
								class="grid grid-cols-12 items-start py-2 border-b border-dashed border-border last:border-b-0"
							>
								<div class="col-span-6 pr-3">
									<p class="font-semibold">{{ item.itemName }}</p>
									<p v-if="item.specialInstructions" class="text-xs italic text-destructive mt-0.5">
										{{ item.specialInstructions }}
									</p>
								</div>
								<p class="col-span-2 text-center font-semibold">x{{ item.quantity }}</p>
								<p class="col-span-2 text-right">${{ item.unitPriceCents / 100 }}</p>
								<p class="col-span-2 text-right font-semibold">${{ (item.unitPriceCents * item.quantity) / 100 }}</p>
							</div>

							<div class="border-t border-dashed border-border pt-4">
								<div class="flex justify-between text-lg font-semibold">
									<span>Total</span>
									<span class="text-primary">${{ orderTotal }}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="rounded-2xl border border-border bg-card p-5 space-y-4">
						<h3 class="text-xl font-semibold text-primary">Update Status</h3>
						<p class="text-sm text-muted-foreground">Current: {{ formatStatusLabel(order_details.status) }}</p>

						<div class="flex flex-wrap gap-2">
							<button
								v-for="statusOption in availableStatuses"
								:key="statusOption"
								type="button"
								:disabled="isUpdatingStatus"
								@click="updateOrderStatus(statusOption)"
								class="rounded-2xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
								:class="order_details.status === statusOption ? 'bg-primary text-primary-foreground border-primary hover:bg-primary' : ''"
							>
								{{ formatStatusLabel(statusOption) }}
							</button>
						</div>
					</div>
				</div>

				<div class="space-y-4">
					<div class="rounded-2xl border border-border bg-card p-5 space-y-4">
						<h3 class="text-xl font-semibold text-primary">Customer</h3>

						<div class="flex items-center gap-3">
							<div class="h-11 w-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
								{{ order_details.customerName?.slice(0, 2).toUpperCase() }}
							</div>
							<div>
								<p class="font-semibold">{{ order_details.customerName }}</p>
								<p class="text-sm text-muted-foreground">{{ order_details.orderType === 'DINING' ? 'Walk-in customer' : 'Online customer' }}</p>
							</div>
						</div>

						<div>
							<p class="text-sm text-muted-foreground">Order Type</p>
							<p class="font-semibold">{{ order_details.orderType === 'UBER' ? 'Uber Eats' : order_details.orderType === 'DINING' ? 'Dine In' : 'Takeaway' }}</p>
						</div>
					</div>

					<div class="rounded-2xl border border-border bg-card p-5 space-y-3">
						<h3 class="text-xl font-semibold text-primary">Order Info</h3>

						<div>
							<p class="text-sm text-muted-foreground">Order No.</p>
							<p class="font-semibold">#{{ order_details.orderNo }}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Status</p>
							<p class="font-semibold">{{ formatStatusLabel(order_details.status) }}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Placed</p>
							<p class="font-semibold">{{ placedAt }}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Last Updated</p>
							<p class="font-semibold">{{ updatedAt }}</p>
						</div>
						<div>
							<p class="text-sm text-muted-foreground">Session ID</p>
							<p class="font-semibold break-all">{{ order_details.checkoutSessionId }}</p>
						</div>
					</div>

					<div class="rounded-2xl bg-primary text-primary-foreground p-5">
						<p class="text-sm opacity-90">Order Total</p>
						<p class="text-5xl font-semibold leading-tight mt-1">${{ orderTotal }}</p>
						<p class="text-sm opacity-90 mt-1">incl. GST • {{ itemCount }} items</p>
					</div>
				</div>
			</div>
		</section>
	</main>
</template>
