<script setup lang="ts">
import { ref, computed } from 'vue'
// Note: Order and OrderStatus types will be available after running: npx prisma generate
// For now using any - regenerate Prisma client to get proper types
type Order = any
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'SERVED' | 'COMPLETED' | 'CANCELLED'

definePageMeta({
  layout: 'dashboard-layout'
})

const currentTab = ref('all')

const toast = useToast();

const { data: orders, refresh, status: orders_loading } = await useFetch<Order[]>('/api/orders', {
  lazy: true
})

const today_orders = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return orders.value?.filter((order) => new Date(order.createdAt).toISOString().split('T')[0] == today)
})

const totalRevenue = computed(() => {
  return orders.value?.reduce((sum, order) => sum + order.totalAmount, 0) || 0;
});

const active_orders = computed(() => {
  return orders.value?.filter(order => 
    ['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'SERVED'].includes(order.status)
  );
});

const total_pending_orders = computed(() => {
  return orders.value?.filter((order) => order.status == "PENDING").length
})

const total_completed_orders = computed(() => {
  return orders.value?.filter((order) => order.status == "COMPLETED").length
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

async function update_order_status(status: OrderStatus, order_id: string) {
  try {
    const response = await $fetch(`/api/orders/${order_id}`, {
      method: 'put',
      body: {
        status: status
      }
    })

    if (response) {
      toast.success({ title: "Order Updated" })
      refresh();
    }

  } catch (error) {
    console.log(error)
    toast.error({ title: "System Error" })
  }
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
        <span class="text-accent-foreground/60">Manage customer orders and track order status</span>
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
            <span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ orders?.length }}</span>
            <span class="text-muted-foreground font-light text-sm">All time</span>
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
            <span class="text-muted-foreground font-light text-sm">From all orders</span>
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

    <!-- Tabs Navigation -->
    <div class="space-y-4">
      <div class="flex gap-2 border-b border-border">
        <button
          v-on:click="currentTab = 'all'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'all'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          All Orders
        </button>
        <button
          @click="currentTab = 'today'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'today'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          Today ({{ today_orders?.length }})
        </button>
        <button
          @click="currentTab = 'active'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'active'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          Active ({{ active_orders?.length }})
        </button>
        <button
          @click="currentTab = 'pending'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'pending'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          Pending ({{ total_pending_orders }})
        </button>
      </div>

      <!-- All Orders Tab -->
      <div v-if="currentTab === 'all'" class="space-y-4">
        <div v-if="orders?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No orders yet</p>
        </div>

        <section v-if="orders_loading == 'pending'">
          <order-components-loading-order></order-components-loading-order>
        </section>

        <section v-if="orders_loading == 'success'" v-for="order in orders" :key="order.id">
          <order-components-order-details-card 
            @update-status="update_order_status" 
            :order_details="order"
          ></order-components-order-details-card>
        </section>
      </div>

      <!-- Today Orders Tab -->
      <div v-if="currentTab === 'today'" class="space-y-4">
        <div v-if="today_orders?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No orders today</p>
        </div>
        <section v-else v-for="order in today_orders" :key="order.id">
          <order-components-order-details-card 
            @update-status="update_order_status" 
            :order_details="order"
          ></order-components-order-details-card>
        </section>
      </div>

      <!-- Active Orders Tab -->
      <div v-if="currentTab === 'active'" class="space-y-4">
        <div v-if="active_orders?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No active orders</p>
        </div>
        <section v-else v-for="order in active_orders" :key="order.id">
          <order-components-order-details-card 
            @update-status="update_order_status" 
            :order_details="order"
          ></order-components-order-details-card>
        </section>
      </div>

      <!-- Pending Orders Tab -->
      <div v-if="currentTab === 'pending'" class="space-y-4">
        <div v-if="total_pending_orders === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No pending orders</p>
        </div>
        <section v-else v-for="order in orders?.filter(o => o.status === 'PENDING')" :key="order.id">
          <order-components-order-details-card 
            @update-status="update_order_status" 
            :order_details="order"
          ></order-components-order-details-card>
        </section>
      </div>
    </div>
  </div>
</template>
