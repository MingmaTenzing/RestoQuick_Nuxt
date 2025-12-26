<script setup lang="ts">
import { ref, computed } from 'vue'

import type{ OrderDetailsWithInclude } from '~~/types/orderwithInclude';

definePageMeta({
  layout: 'dashboard-layout'
})

const { data: orders, status: orders_loading } = await useFetch<OrderDetailsWithInclude[]>('/api/orders', {
  lazy: true
})

console.log(orders)

// Stats for all orders
const totalRevenue = computed(() => {
return (orders.value?.reduce((sum, order) => sum + order.totalAmountCents, 0) ?? 0) / 100;});

const active_orders = computed(() => {
  return orders.value?.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'].includes(order.status)
  ) || [];
});



const total_completed_orders = computed(() => {
  return orders.value?.filter((order) => order.status == "COMPLETED").length || 0
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex justify-between">
      <div>
        <div class="flex items-center gap-4">
          <h1 class="text-2xl md:text-6xl">Orders</h1>
          <i class="pi pi-shopping-cart text-2xl text-amber-400"></i>
        </div>
        <span class="text-accent-foreground/60">View and manage all customer orders</span>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="flex flex-col gap-4 md:flex-row md:justify-around w-full md:flex-wrap lg:flex-nowrap">
      <!-- Total Orders -->
      <div class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Orders</span>
          <div class="flex flex-col">
            <span v-if="orders_loading == 'pending'" class="w-[100px] h-12 bg-muted-foreground/20 animate-pulse rounded-lg"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ orders?.length || 0 }}</span>
            <span class="text-muted-foreground font-light text-sm">All orders</span>
          </div>
        </div>
        <div>
          <i class="pi pi-shopping-bag text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Revenue</span>
          <div class="flex flex-col">
            <span v-if="orders_loading == 'pending'" class="w-24 h-12 bg-muted-foreground/20 animate-pulse rounded-lg"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium text-green-600">{{ formatCurrency(totalRevenue) }}</span>
            <span class="text-muted-foreground font-light text-sm">Total revenue</span>
          </div>
        </div>
        <div>
          <i class="pi pi-dollar text-[120px] text-green-500 opacity-5"></i>
        </div>
      </div>

      <!-- Active Orders -->
      <div class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Active Orders</span>
          <div class="flex flex-col">
            <span v-if="orders_loading == 'pending'" class="w-14 h-12 bg-muted-foreground/20 animate-pulse rounded-lg"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium text-blue-600">{{ active_orders?.length || 0 }}</span>
            <span class="text-muted-foreground font-light text-sm">In progress</span>
          </div>
        </div>
        <div>
          <i class="pi pi-spinner text-[120px] text-blue-500 opacity-5"></i>
        </div>
      </div>

      <!-- Completed Orders -->
      <div class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Completed</span>
          <div class="flex flex-col">
            <span v-if="orders_loading == 'pending'" class="w-14 h-12 bg-muted-foreground/20 animate-pulse rounded-lg"></span>
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium text-emerald-600">{{ total_completed_orders }}</span>
            <span class="text-muted-foreground font-light text-sm">Finished orders</span>
          </div>
        </div>
        <div>
          <i class="pi pi-check-circle text-[120px] text-emerald-500 opacity-5"></i>
        </div>
      </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div v-if="orders?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
        <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
        <p class="text-muted-foreground">No orders yet</p>
      </div>

      <section v-if="orders_loading == 'pending'">
        <order-components-loading-order></order-components-loading-order>
      </section>

      <section v-if="orders_loading == 'success'" v-for="order in orders" :key="order.id">
        <OrderDashboardComponentsOrderDetailsCard
          :order_details="order"
        ></OrderDashboardComponentsOrderDetailsCard>
      </section>
    </div>
  </div>
</template>
