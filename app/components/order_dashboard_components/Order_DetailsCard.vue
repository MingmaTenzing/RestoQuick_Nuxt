<script setup lang="ts">
import type {OrderDetailsWithInclude} from "../../../types/orderwithInclude";

defineProps<{ order_details: OrderDetailsWithInclude }>();

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'PREPARING':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'READY':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    case 'SERVED':
      return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
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
    <div class="rounded-2xl border border-border bg-card px-5 py-3.5 transition-colors hover:bg-accent/20">
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">
        <div class="w-16 shrink-0 text-center">
          <p class="text-xs text-muted-foreground">Order</p>
          <p class="text-lg font-semibold leading-tight text-primary">#{{ order_details.orderNo }}</p>
        </div>

        <div class="h-10 w-px shrink-0 bg-border hidden xl:block"></div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <p class="truncate text-sm font-semibold">{{ order_details.customerName }}</p>
          </div>

          <div class="mt-0.5 flex flex-wrap items-center gap-2">
            <span class="flex items-center gap-1 text-xs text-muted-foreground">
              <i class="pi pi-list text-[11px]"></i>
              {{ order_details.items?.length || 0 }} item{{ order_details.items?.length !== 1 ? 's' : '' }}
            </span>
            <span class="text-xs text-muted-foreground">·</span>
            <span class="flex items-center gap-1 text-xs text-muted-foreground">
              <i class="pi pi-clock text-[10px]"></i>
              <NuxtTime :datetime="new Date(order_details.createdAt).getTime()" relative />
            </span>
            <span class="text-xs text-muted-foreground">·</span>
            <span class="text-xs text-muted-foreground">Table {{ order_details.table?.number || 'N/A' }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <span class="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {{ getOrderTypeLabel(order_details.orderType) }}
          </span>
          <span :class="['inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium', getStatusColor(order_details.status)]">
            <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
            {{ formatStatusLabel(order_details.status) }}
          </span>
        </div>

        <div class="w-20 shrink-0 text-right">
          <p class="text-base font-semibold">{{ formatCurrency(order_details.totalAmountCents/100) }}</p>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button type="button" class="inline-flex h-7 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            → Confirmed
          </button>
          <button type="button" class="inline-flex h-7 items-center justify-center rounded-md border border-input bg-transparent px-2.5 text-xs font-medium text-destructive hover:bg-accent">
            Cancel
          </button>
        </div>

        <NuxtLink :to="`/dashboard/orders/${order_details.id}`" class="text-muted-foreground shrink-0 hover:text-foreground">
          <i class="pi pi-angle-right"></i>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

