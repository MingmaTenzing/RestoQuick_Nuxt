<script lang="ts" setup>
import type { CashierPaidOrder } from "~~/types/cashier";

definePageMeta({
	layout: "dashboard-layout"
})

const route = useRoute()
const orderId = computed(() => route.params.order_id?.toString() ?? "")

const { data: order, pending, error } = await useFetch<CashierPaidOrder>(
	() => `/api/orders/${orderId.value}`
)

const totalItems = computed(() => {
	return (order.value?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
})

function printReceipt() {
	window.print()
}
</script>


<template>
	<div v-if="order" class="print-receipt-root hidden print:block">
		<div class="mx-auto w-[80mm] space-y-4 bg-white px-4 py-6 font-mono text-[11px] leading-normal text-black">
			<div class="space-y-1 text-center">
				<p class="text-[13px] font-bold uppercase tracking-[0.28em]">RestoQuick</p>
				<p class="text-[10px] uppercase tracking-[0.24em] text-black/55">Takeaway Receipt</p>
			</div>

			<div class="space-y-1.5 border-y border-dashed border-black/30 py-3">
				<div class="flex justify-between">
					<span class="text-black/65">Order</span>
					<span class="font-semibold">#{{ order.orderNo ?? 'Pending' }}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-black/65">Customer</span>
					<span>{{ order.customerName || 'Walk-in' }}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-black/65">Created</span>
					<NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short" year="numeric"
						hour="2-digit" minute="2-digit" />
				</div>
			</div>

			<div class="space-y-3 py-1">
				<template v-for="item in order.items" :key="item.id">
					<div class="space-y-1">
						<div class="flex justify-between gap-3 font-semibold">
							<span>{{ item.quantity }}x {{ item.itemName }}</span>
							<span>${{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}</span>
						</div>
						<div v-if="item.specialInstructions" class="text-[10px] italic text-black/60">
							{{ item.specialInstructions }}
						</div>
						<div v-for="option in item.orderItemOptions" :key="option.id" class="pl-3 text-[10px] text-black/60">
							+ {{ option.quantity }}x {{ option.menuOption?.name ?? option.name ?? 'Option' }}
						</div>
					</div>
				</template>
			</div>

			<div class="space-y-1.5 border-y border-dashed border-black/30 py-3">
				<div class="flex justify-between">
					<span class="text-black/65">Items</span>
					<span>{{ totalItems }}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-black/65">Status</span>
					<span>{{ order.paymentStatus }}</span>
				</div>
				<div class="flex justify-between pt-1 text-[13px] font-bold">
					<span>Total</span>
					<span>${{ (order.totalAmountCents / 100).toFixed(2) }}</span>
				</div>
			</div>

			<p class="pt-1 text-center text-[10px] text-black/45">Prepared via RestoQuick</p>
		</div>
	</div>

	<main class="print:hidden">
		<div class="min-h-screen w-full bg-linear-to-b from-background via-background to-secondary/20 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
			<header class="space-y-8 border-b border-border pb-8">
				<div class="flex flex-wrap items-start justify-between gap-6">
					<div class="max-w-3xl space-y-4">
						<NuxtLink to="/dashboard/cashier/takeaway"
							class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-opacity active:opacity-70">
							<i class="pi pi-arrow-left text-[11px]"></i>
							Takeaway queue
						</NuxtLink>

						<div class="space-y-3">
							<div class="flex flex-wrap items-center gap-3">
								<p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
									Takeaway Checkout
								</p>
								<span v-if="order"
									class="rounded-full border border-border bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground">
									{{ order.paymentStatus }}
								</span>
							</div>

							<h1 class="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
								Order #{{ order?.orderNo ?? '—' }}
							</h1>

							<p v-if="order" class="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
								{{ order.customerName || 'Walk-in order' }}
								<span class="mx-2 text-border">/</span>
								<NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short" year="numeric"
									hour="2-digit" minute="2-digit" />
							</p>
						</div>
					</div>

					<button v-if="order" type="button"
						class="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background shadow-sm transition-transform active:scale-[0.98]"
						@click="printReceipt">
						<i class="pi pi-print text-sm"></i>
						Print receipt
					</button>
				</div>

				<div v-if="order" class="grid gap-3 sm:grid-cols-3 xl:grid-cols-4">
					<div class="border border-border/70 bg-background/70 px-4 py-4 backdrop-blur">
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Customer</p>
						<p class="mt-2 text-base font-semibold text-foreground">{{ order.customerName || 'Walk-in' }}</p>
					</div>
					<div class="border border-border/70 bg-background/70 px-4 py-4 backdrop-blur">
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Items</p>
						<p class="mt-2 text-base font-semibold text-foreground">{{ totalItems }}</p>
					</div>
					<div class="border border-border/70 bg-background/70 px-4 py-4 backdrop-blur">
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Payment</p>
						<p class="mt-2 text-base font-semibold uppercase text-foreground">{{ order.paymentStatus }}</p>
					</div>
					<div class="border border-border/70 bg-background/70 px-4 py-4 backdrop-blur sm:col-span-3 xl:col-span-1">
						<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Total Due</p>
						<p class="mt-2 text-2xl font-semibold tracking-tight text-foreground">
							${{ (order.totalAmountCents / 100).toFixed(2) }}
						</p>
					</div>
				</div>
			</header>

			<div v-if="pending" class="space-y-6 py-8">
				<div class="h-28 animate-pulse rounded-3xl bg-secondary"></div>
				<div class="h-40 animate-pulse rounded-3xl bg-secondary"></div>
				<div class="h-56 animate-pulse rounded-3xl bg-secondary"></div>
			</div>

			<div v-else-if="!order" class="flex min-h-105 flex-col items-center justify-center px-6 py-20 text-center sm:px-10">
				<div class="rounded-full border border-border bg-secondary p-4 text-muted-foreground">
					<i class="pi pi-receipt text-3xl"></i>
				</div>
				<p class="mt-6 text-2xl font-semibold tracking-tight text-foreground">Order not found</p>
				<p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
					{{ error?.statusMessage || 'This takeaway order could not be loaded.' }}
				</p>
				<NuxtLink to="/dashboard/cashier/takeaway"
					class="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground active:scale-[0.98]">
					<i class="pi pi-arrow-left text-xs"></i>
					Return to queue
				</NuxtLink>
			</div>

			<div v-else class="grid gap-10 py-10 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-14">
				<section class="space-y-4">
					<div class="flex items-end justify-between gap-4 border-b border-border pb-5">
						<div>
							<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
								Order Details
							</p>
							<h2 class="mt-1 text-2xl font-semibold tracking-tight text-foreground">
								Items on this order
							</h2>
						</div>
						<p class="text-sm text-muted-foreground">
							{{ totalItems }} item<span v-if="totalItems !== 1">s</span>
						</p>
					</div>

					<ul class="divide-y divide-border/80">
						<li v-for="item in order.items" :key="item.id" class="grid gap-4 py-6 lg:grid-cols-[72px_minmax(0,1fr)_140px] lg:gap-6">
							<div class="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-background text-lg font-semibold tabular-nums text-foreground">
								{{ item.quantity }}×
							</div>

							<div class="min-w-0 space-y-2">
								<div>
									<p class="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
										{{ item.itemName }}
									</p>
									<p v-if="item.specialInstructions" class="mt-1 text-sm italic leading-6 text-muted-foreground">
										{{ item.specialInstructions }}
									</p>
								</div>

								<div v-if="item.orderItemOptions.length" class="flex flex-wrap gap-2 pt-1">
									<span v-for="option in item.orderItemOptions" :key="option.id"
										class="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
										{{ option.quantity }}× {{ option.menuOption?.name ?? option.name ?? 'Option' }}
									</span>
								</div>
							</div>

							<div class="flex items-start justify-start lg:justify-end">
								<p class="text-xl font-semibold tabular-nums tracking-tight text-foreground">
									${{ ((item.unitPriceCents * item.quantity) / 100).toFixed(2) }}
								</p>
							</div>
						</li>
					</ul>
				</section>

				<aside class="xl:pt-1">
					<div class="overflow-hidden rounded-4xl border border-border bg-card shadow-[0_20px_60px_-32px_rgba(0,0,0,0.35)] xl:sticky xl:top-8">
						<div class="border-b border-border bg-background/70 px-6 py-5 backdrop-blur">
							<p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
								Summary
							</p>
							<h2 class="mt-1 text-2xl font-semibold tracking-tight text-foreground">Receipt overview</h2>
						</div>

						<div class="space-y-6 px-6 py-6">
							<div class="space-y-4">
								<div class="flex items-start justify-between gap-4 text-sm">
									<span class="text-muted-foreground">Customer</span>
									<span class="text-right font-semibold text-foreground">{{ order.customerName || 'Walk-in' }}</span>
								</div>
								<div class="flex items-start justify-between gap-4 text-sm">
									<span class="text-muted-foreground">Items</span>
									<span class="font-semibold text-foreground">{{ totalItems }}</span>
								</div>
								<div class="flex items-start justify-between gap-4 text-sm">
									<span class="text-muted-foreground">Payment</span>
									<span class="font-semibold uppercase text-foreground">{{ order.paymentStatus }}</span>
								</div>
								<div class="flex items-start justify-between gap-4 text-sm">
									<span class="text-muted-foreground">Created</span>
									<span class="text-right font-semibold text-foreground">
										<NuxtTime :datetime="order.createdAt" locale="en-AU" day="2-digit" month="short"
											hour="2-digit" minute="2-digit" />
									</span>
								</div>
							</div>

							<div class="rounded-3xl bg-secondary/70 px-5 py-5">
								<p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
									Total Due
								</p>
								<p class="mt-2 text-4xl font-semibold tracking-tight text-foreground">
									${{ (order.totalAmountCents / 100).toFixed(2) }}
								</p>
							</div>

							<button type="button"
								class="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-transform active:scale-[0.98]"
								@click="printReceipt">
								<i class="pi pi-print text-sm"></i>
								Print receipt
							</button>
						</div>
					</div>
				</aside>
			</div>
		</div>
	</main>
</template>

<style scoped>
@media print {

	.print-receipt-root,
	.print-receipt-root * {
		visibility: visible;
	}

	.print-receipt-root {
		position: fixed;
		inset: 0;
		display: block !important;
		background: white;
		z-index: 9999;
	}

	.print-receipt-root>div {
		margin: 0 auto;
	}
}
</style>