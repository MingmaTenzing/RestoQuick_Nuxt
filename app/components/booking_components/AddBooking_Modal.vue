
<script setup lang="ts">

const newBooking = ref({
  customerName: '',
  customerPhone: '',
  bookingTime: '',
  guestCount: 2,
  specialRequest: '',
  tableId: undefined
})

const dialogOpen = ref(false)

</script>
<template>


<!-- Add Booking Modal -->
    <div v-if="dialogOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-card text-foreground rounded-xl shadow-xl border border-border p-6 w-full max-w-md relative">
        <button
          @click="dialogOpen = false"
          class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <i class="pi pi-times text-xl"></i>
        </button>

        <h2 class="text-2xl font-bold mb-1">Create New Booking</h2>
        <p class="text-muted-foreground text-sm mb-6">Add a new table reservation to the system</p>

        <form  class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Customer Name *</label>
            <input
              v-model="newBooking.customerName"
              type="text"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Phone *</label>
            <input
              v-model="newBooking.customerPhone"
              type="tel"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
              placeholder="+1 234-567-8900"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Booking Date & Time *</label>
            <input
              v-model="newBooking.bookingTime"
              type="datetime-local"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Number of Guests *</label>
            <input
              v-model.number="newBooking.guestCount"
              type="number"
              min="1"
              max="20"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Special Requests</label>
            <textarea
              v-model="newBooking.specialRequest"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground resize-none"
              rows="3"
              placeholder="Window seat, birthday party, allergies, etc."
            ></textarea>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
              @click="dialogOpen = false"
              class="flex-1 px-4 py-2 rounded-lg border border-border bg-muted text-foreground hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring transition-colors"
            >
              Create Booking
            </button>
          </div>
        </form>
      </div>
    </div>
    </template>
