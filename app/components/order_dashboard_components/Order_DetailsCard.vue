<script setup lang="ts">
import type {OrderDetailsWithInclude} from "../../../types/orderwithInclude";

defineProps<{ order_details: OrderDetailsWithInclude }>();

const getStatusColor = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'CANCELLED':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

const getOrderTypeLabel = (orderType: string) => {
  switch (orderType) {
    case 'UBER':
      return 'Uber Eats'
    case 'DINING':
      return 'Dine In'
    case 'TAKEAWAY':
      return 'Takeaway'
    default:
      return orderType
  }
}

const formatStatusLabel = (status: string) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
}


const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

</script>

<template>
  <section>
          <NuxtLink :to="`/dashboard/orders/${order_details.id}`" class="block">
              <div class="group rounded-3xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-accent/30 hover:shadow-md sm:p-5">
                <div class="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto]">
                  <div class="flex items-center gap-3 md:items-start md:pr-1">
                    <div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-accent text-base font-semibold text-primary">
                      #{{ order_details.orderNo }}
                    </div>

                    <div class="md:hidden min-w-0">
                      <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Order</p>
                      <p class="truncate text-sm font-semibold text-foreground">{{ order_details.customerName }}</p>
                    </div>
                  </div>

                  <div class="min-w-0 space-y-3">
                    <div class="hidden md:block">
                      <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Customer</p>
                      <p class="truncate text-base font-semibold text-foreground">{{ order_details.customerName }}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                      <span class="inline-flex items-center gap-1.5 rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        <i class="pi pi-list text-[11px]"></i>
                        {{ order_details.items?.length || 0 }} item{{ order_details.items?.length !== 1 ? 's' : '' }}
                      </span>
                      <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <i class="pi pi-clock text-[10px]"></i>
                        <NuxtTime :datetime="new Date(order_details.createdAt).getTime()" relative />
                      </span>
                      <span class="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <i class="pi pi-map-marker text-[10px]"></i>
                        Table {{ order_details.table?.number || 'N/A' }}
                      </span>
                    </div>
                  </div>

                  <div class="flex flex-col gap-3 border-t border-border pt-4 md:col-span-2 md:flex-row md:items-center md:justify-between xl:col-span-1 xl:min-w-52 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
                    <div class="flex flex-wrap items-center gap-2 xl:justify-end">
                      <span class="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        {{ getOrderTypeLabel(order_details.orderType) }}
                      </span>
                      <span :class="['inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium', getStatusColor(order_details.status)]">
                        <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                        {{ formatStatusLabel(order_details.status) }}
                      </span>
                    </div>

                    <div class="rounded-2xl bg-background px-3.5 py-2.5 md:text-right xl:min-w-28">
                      <p class="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Total</p>
                      <p class="text-lg font-semibold text-foreground">{{ formatCurrency(order_details.totalAmountCents/100) }}</p>
                    </div>
                  </div>
                </div>
              </div>
        </NuxtLink>
  </section>
</template>

