<script setup lang="ts">
import { ref, computed } from 'vue'


definePageMeta({
  layout: 'dashboard-layout'
})

const currentTab = ref('all')

const { data:bookings} = await useFetch('/api/bookings')

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED':
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'PENDING':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'SEATED':
      return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'COMPLETED':
      return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    case 'CANCELLED':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    case 'NO_SHOW':
      return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}






</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex justify-between">
      <div>
        <div class="flex items-center gap-4">
          
          <h1 class="text-2xl md:text-6xl ">Reservations</h1>
          
          <i class=" pi-bookmark-fill pi text-2xl  text-amber-400"></i>

        </div>
        <span class="text-accent-foreground/60">Manage table bookings and customer reservations</span>
      </div>
      <button
  
        class="border-border border px-4 py-2 flex justify-center items-center space-x-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <i class="pi pi-plus"></i>
        <span>New Booking</span>
      </button>
    </div>

    <!-- Stats Cards Grid -->
    <div class="flex flex-col gap-4 md:flex-row md:justify-around w-full md:flex-wrap lg:flex-nowrap">
      <!-- Total Bookings -->
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Bookings</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ bookings?.length }}</span>
            <span class="text-muted-foreground font-light text-sm">This month</span>
          </div>
        </div>
        <div>
          <i class="pi pi-calendar text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>

      <!-- Confirmed Bookings -->
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Confirmed</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-4xl lg:text-5xl  font-medium text-green-600">{{ 4}}</span>
            <span class="text-muted-foreground font-light text-sm">Ready to serve</span>
          </div>
        </div>
        <div>
          <i class="pi pi-check-circle text-[120px] text-green-500 opacity-5"></i>
        </div>
      </div>

      <!-- Total Guests -->
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Guests</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ 20}}</span>
            <span class="text-muted-foreground font-light text-sm">Expected arrivals</span>
          </div>
        </div>
        <div>
          <i class="pi pi-users text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>

      <!-- Pending Bookings -->
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Pending</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-4xl lg:text-5xl  font-medium text-primary">{{ 8 }}</span>
            <span class="text-muted-foreground font-light text-sm">Awaiting confirmation</span>
          </div>
        </div>
        <div>
          <i class="pi pi-clock text-[120px] text-primary opacity-5"></i>
        </div>
      </div>
    </div>

    

    <!-- Tabs Navigation -->
    <div class="space-y-4">
      <div class="flex gap-2 border-b border-border">
        <button
 
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'all'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          All Bookings
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
          Today ({{ 4}})
        </button>
        <button
          @click="currentTab = 'upcoming'"
          :class="[
            'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
            currentTab === 'upcoming'
              ? 'border-primary text-foreground font-semibold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          ]"
        >
          Upcoming ({{ 4 }})
        </button>
      </div>

      <!-- All Bookings Tab -->
      <div v-if="currentTab === 'all'" class="space-y-4">
        <div v-if="bookings?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No bookings yet</p>
        </div>
        <template v-else>
          <div
            v-for="booking in bookings"
            :key="booking.id"
            class="border border-border rounded-lg bg-card p-4 hover:bg-accent/30 transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <i class="pi pi-user text-accent-foreground"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base">{{ booking.customerName }}</h3>
                    <p class="text-xs text-muted-foreground">{{ booking.customerPhone }}</p>
                  </div>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(booking.status)]">
                {{ booking.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-calendar text-muted-foreground"></i>
                <span>{{ new Date(booking.bookingTime).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-clock text-muted-foreground"></i>
                <span>{{ new Date(booking.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-users text-muted-foreground"></i>
                <span>{{ booking.guestCount }} guest{{ booking.guestCount !== 1 ? 's' : '' }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-muted-foreground mb-1">Contact</p>
                <p class="text-sm font-medium">{{ booking.customerPhone }}</p>
              </div>
              <div v-if="booking.specialRequest">
                <p class="text-xs text-muted-foreground mb-1">Special Requests</p>
                <p class="text-sm">{{ booking.specialRequest }}</p>
              </div>
            </div>

            <div v-if="booking.status === 'PENDING'" class="flex gap-2 pt-3 border-t border-border">
              <button
                
                class="flex-1 px-3 py-2 rounded-lg border border-border bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <i class="pi pi-check"></i>
                Confirm
              </button>
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-border bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <i class="pi pi-times"></i>
                Cancel
              </button>
            </div>
          </div>
        </template>
      </div>

    
    </div>
  </div>
</template>
