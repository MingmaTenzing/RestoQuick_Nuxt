<script setup lang="ts">

// Note: Order and OrderStatus types will be available after running: npx prisma generate
// For now using any - regenerate Prisma client to get proper types


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


//need to have a look at the formate currency later on 
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

</script>

<template>
  <section>
    <div
      class="border border-border rounded-lg bg-card p-4 hover:bg-accent/30 transition-colors"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
              <i class="pi pi-shopping-cart text-accent-foreground"></i>
            </div>
            <div>
              <h3 class="font-bold text-base">{{ order_details.orderNumber }}</h3>
              <p class="text-xs text-muted-foreground">
                {{ new Date(order_details.createdAt).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
        <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(order_details.status)]">
          {{ order_details.status }}
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
        <div class="flex items-center gap-2 text-sm">
          <i class="pi pi-table text-muted-foreground"></i>
          <span>{{ order_details.table?.number || 'No Table' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="pi pi-list text-muted-foreground"></i>
          <span>{{ order_details.items?.length || 0 }} item{{ order_details.items?.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="flex items-center gap-2 text-sm">
          <i class="pi pi-dollar text-muted-foreground"></i>
          <span class="font-semibold">{{ formatCurrency(order_details.totalAmountCents/100) }}</span>
        </div>
      </div>

      <!-- Order Items -->
      <div class="mb-4 space-y-2">
        <p class="text-xs text-muted-foreground mb-2 font-medium">Order Items:</p>
        <div v-for="item in order_details.items" :key="item.id" class="flex items-start justify-between p-2 bg-accent/50 rounded-lg">
          <div class="flex-1">
            <p class="text-sm font-medium">{{ item.itemName }}</p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-muted-foreground">Qty: {{ item.quantity }}</span>
              <span class="text-xs text-muted-foreground">×</span>
              <span class="text-xs text-muted-foreground">{{ formatCurrency(item.unitPriceCents/100) }}</span>
            </div>
            <p v-if="item.specialInstructions" class="text-xs text-amber-500 mt-1">
              <i class="pi pi-info-circle"></i> {{ item.specialInstructions }}
            </p>
          </div>
          <span class="text-sm font-semibold">{{ formatCurrency((item.unitPriceCents/100) * item.quantity) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

