<script setup lang="ts">
import { ref, computed } from 'vue'

import type{ OrderDetailsWithInclude } from '~~/types/orderwithInclude';

type OrderRange = 'all' | 'day' | 'week' | 'month'

const selected_range = ref<OrderRange>('all')
const customer_search = ref('')
const customer_search_input = ref('')

function submitCustomerSearch() {
  customer_search.value = customer_search_input.value.trim()
}

const selected_range_label = computed(() => {
  if (selected_range.value === 'all') return 'All'
  if (selected_range.value === 'day') return 'Today'
  if (selected_range.value === 'week') return 'This Week'
  return 'This Month'
})

const { data: orders, status: orders_loading } = await useFetch<OrderDetailsWithInclude[]>('/api/orders', {
  query: computed(() => ({
    range: selected_range.value,
    ...(customer_search.value.trim() ? { customer: customer_search.value.trim() } : {})
  })),
  watch: [selected_range, customer_search],
  lazy: true
})

// Stats for all orders
const totalRevenue = computed(() => {
return (orders.value?.reduce((sum, order) => sum + order.totalAmountCents, 0) ?? 0) / 100;});

const active_orders = computed(() => {
  return orders.value?.filter(order => 
    ['PENDING'].includes(order.status)
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
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-2">
        <p class="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Operations</p>
        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl xl:text-5xl">Orders</h1>
        </div>
        <span class="block max-w-2xl text-sm text-muted-foreground sm:text-base">View live order activity, revenue, and recent service updates in one place.</span>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
      <!-- Total Orders -->
      <div class="relative min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
        <div class="flex min-h-32 flex-col justify-between gap-4">
          <div class="pr-12">
            <span class="text-sm font-medium text-muted-foreground">Total Orders</span>
          </div>
          <div class="min-w-0 space-y-1">
            <span v-if="orders_loading == 'pending'" class="block h-10 w-24 animate-pulse rounded-2xl bg-muted"></span>
            <span v-else class="block min-w-0 truncate text-3xl font-semibold leading-none text-foreground sm:text-4xl">{{ orders?.length || 0 }}</span>
            <span class="text-sm text-muted-foreground">{{ selected_range_label }}</span>
          </div>
        </div>
        <i class="pi pi-shopping-bag pointer-events-none absolute -bottom-4 right-0 text-7xl text-muted-foreground/10 sm:text-8xl"></i>
      </div>

      <!-- Total Revenue -->
      <div class="relative min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
        <div class="flex min-h-32 flex-col justify-between gap-4">
          <div class="pr-14">
            <span class="text-sm font-medium text-muted-foreground">Total Revenue</span>
          </div>
          <div class="min-w-0 space-y-1">
            <span v-if="orders_loading == 'pending'" class="block h-10 w-28 animate-pulse rounded-2xl bg-muted"></span>
            <span v-else class="block min-w-0 break-all text-3xl font-semibold leading-none text-emerald-600 sm:text-4xl">{{ formatCurrency(totalRevenue) }}</span>
            <span class="text-sm text-muted-foreground">{{ selected_range === 'all' ? 'Total revenue' : `${selected_range_label} revenue` }}</span>
          </div>
        </div>
        <i class="pi pi-dollar pointer-events-none absolute -bottom-4 right-0 text-7xl text-emerald-500/10 sm:text-8xl"></i>
      </div>

      <!-- Active Orders -->
      <div class="relative min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
        <div class="flex min-h-32 flex-col justify-between gap-4">
          <div class="pr-12">
            <span class="text-sm font-medium text-muted-foreground">Active Orders</span>
          </div>
          <div class="min-w-0 space-y-1">
            <span v-if="orders_loading == 'pending'" class="block h-10 w-20 animate-pulse rounded-2xl bg-muted"></span>
            <span v-else class="block min-w-0 truncate text-3xl font-semibold leading-none text-blue-600 sm:text-4xl">{{ active_orders?.length || 0 }}</span>
            <span class="text-sm text-muted-foreground">In progress</span>
          </div>
        </div>
        <i class="pi pi-spinner pointer-events-none absolute -bottom-4 right-0 text-7xl text-blue-500/10 sm:text-8xl"></i>
      </div>

      <!-- Completed Orders -->
      <div class="relative min-w-0 overflow-hidden rounded-3xl border border-border bg-card p-4 text-card-foreground shadow-sm sm:p-5">
        <div class="flex min-h-32 flex-col justify-between gap-4">
          <div class="pr-12">
            <span class="text-sm font-medium text-muted-foreground">Completed</span>
          </div>
          <div class="min-w-0 space-y-1">
            <span v-if="orders_loading == 'pending'" class="block h-10 w-20 animate-pulse rounded-2xl bg-muted"></span>
            <span v-else class="block min-w-0 truncate text-3xl font-semibold leading-none text-emerald-600 sm:text-4xl">{{ total_completed_orders }}</span>
            <span class="text-sm text-muted-foreground">Finished orders</span>
          </div>
        </div>
        <i class="pi pi-check-circle pointer-events-none absolute -bottom-4 right-0 text-7xl text-emerald-500/10 sm:text-8xl"></i>
      </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-4">
      <div class="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-lg font-semibold text-foreground">Recent Orders</h2>
            <p class="text-sm text-muted-foreground">Search for a customer or narrow the time range without breaking the layout.</p>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
            <form @submit.prevent="submitCustomerSearch" class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <input
                v-model="customer_search_input"
                type="text"
                placeholder="Search by customer"
                class="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring focus:ring-ring sm:min-w-64"
              />
              <button
                type="submit"
                class="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Search
              </button>
            </form>
            <div class="flex flex-wrap items-center gap-2">
              <span class="mr-1 text-sm font-medium text-muted-foreground">Filter by:</span>
              <button
                @click="selected_range = 'all'"
                :class="selected_range === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                class="rounded-full border px-4 py-2 text-sm transition-colors"
              >
                All
              </button>
              <button
                @click="selected_range = 'day'"
                :class="selected_range === 'day' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                class="rounded-full border px-4 py-2 text-sm transition-colors"
              >
                Day
              </button>
              <button
                @click="selected_range = 'week'"
                :class="selected_range === 'week' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                class="rounded-full border px-4 py-2 text-sm transition-colors"
              >
                Week
              </button>
              <button
                @click="selected_range = 'month'"
                :class="selected_range === 'month' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent text-muted-foreground border-border hover:bg-accent'"
                class="rounded-full border px-4 py-2 text-sm transition-colors"
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="orders?.length === 0" class="rounded-3xl border border-border bg-card p-10 text-center shadow-sm sm:p-12">
        <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
        <p class="text-muted-foreground">{{ selected_range === 'all' ? 'No orders yet' : `No orders for ${selected_range_label.toLowerCase()}` }}</p>
      </div>

      <section v-if="orders_loading == 'pending'">
        <OrderDashboardComponentsLoadingOrder></OrderDashboardComponentsLoadingOrder>
      </section>

      <section v-if="orders_loading == 'success'" v-for="order in orders" :key="order.id">
        <OrderDashboardComponentsOrderDetailsCard
          :order_details="order"
        ></OrderDashboardComponentsOrderDetailsCard>
      </section>
    </div>
  </div>
</template>
