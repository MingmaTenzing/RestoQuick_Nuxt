<script setup lang="ts">
import type { Booking } from '~/generated/prisma/client';


defineProps<{ booking_details: Booking }>();

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

    <section >
          <div
            
            class="border border-border rounded-lg bg-card p-4 hover:bg-accent/30 transition-colors"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <i class="pi pi-user text-accent-foreground"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base">{{ booking_details.customerName }}</h3>
                    <p class="text-xs text-muted-foreground">{{ booking_details.customerPhone }}</p>
                  </div>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(booking_details.status)]">
                {{ booking_details.status }}
              </span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 pb-4 border-b border-border">
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-calendar text-muted-foreground"></i>
                <span>{{ new Date(booking_details.bookingTime).toLocaleDateString() }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-clock text-muted-foreground"></i>
                <span>{{ new Date(booking_details.bookingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-users text-muted-foreground"></i>
                <span>{{ booking_details.guestCount }} guest{{ booking_details.guestCount !== 1 ? 's' : '' }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-muted-foreground mb-1">Contact</p>
                <p class="text-sm font-medium">{{ booking_details.customerPhone }}</p>
              </div>
              <div v-if="booking_details.specialRequest">
                <p class="text-xs text-muted-foreground mb-1">Special Requests</p>
                <p class="text-sm">{{ booking_details.specialRequest }}</p>
              </div>
            </div>

            <div v-if="booking_details.status === 'PENDING'" class="flex gap-2 pt-3 border-t border-border">
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
        </section>
</template>


