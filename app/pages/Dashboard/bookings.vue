<script setup lang="ts">
import { ref, computed } from 'vue'

interface Booking {
  id: string
  customerName: string
  email: string
  phone: string
  date: string
  time: string
  guests: number
  status: 'confirmed' | 'pending' | 'cancelled'
  specialRequests?: string
  source: 'phone' | 'online' | 'voice-agent' | 'walk-in'
  createdAt: string
}

definePageMeta({
  layout: 'dashboard-layout'
})

const bookings = ref<Booking[]>([
  {
    id: 'b1',
    customerName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234-567-8900',
    date: '2025-11-20',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    specialRequests: 'Window seat preferred',
    source: 'voice-agent',
    createdAt: '2025-11-18T10:30:00'
  },
  {
    id: 'b2',
    customerName: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1 234-567-8901',
    date: '2025-11-20',
    time: '20:00',
    guests: 2,
    status: 'confirmed',
    source: 'online',
    createdAt: '2025-11-18T11:15:00'
  },
  {
    id: 'b3',
    customerName: 'Mike Davis',
    email: 'mike@example.com',
    phone: '+1 234-567-8902',
    date: '2025-11-21',
    time: '18:30',
    guests: 6,
    status: 'pending',
    specialRequests: 'Birthday celebration, need high chair',
    source: 'phone',
    createdAt: '2025-11-18T14:20:00'
  },
  {
    id: 'b4',
    customerName: 'Emily Rodriguez',
    email: 'emily@example.com',
    phone: '+1 234-567-8903',
    date: '2025-11-22',
    time: '19:30',
    guests: 3,
    status: 'confirmed',
    source: 'online',
    createdAt: '2025-11-19T09:00:00'
  },
  {
    id: 'b5',
    customerName: 'David Chen',
    email: 'david@example.com',
    phone: '+1 234-567-8904',
    date: '2025-11-23',
    time: '20:00',
    guests: 5,
    status: 'pending',
    specialRequests: 'Vegetarian options needed',
    source: 'voice-agent',
    createdAt: '2025-11-19T14:30:00'
  }
])

const newBooking = ref({
  customerName: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  specialRequests: ''
})

const dialogOpen = ref(false)
const currentTab = ref('all')
const today = '2025-11-20'

// Computed
const todayBookings = computed(() => bookings.value.filter(b => b.date === today))
const upcomingBookings = computed(() => bookings.value.filter(b => b.date > today))
const voiceAgentBookings = computed(() => bookings.value.filter(b => b.source === 'voice-agent'))
const totalGuests = computed(() => bookings.value.reduce((sum, b) => sum + b.guests, 0))
const confirmedCount = computed(() => bookings.value.filter(b => b.status === 'confirmed').length)

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'pending':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'cancelled':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

const updateBookingStatus = (id: string, status: 'confirmed' | 'pending' | 'cancelled') => {
  const booking = bookings.value.find(b => b.id === id)
  if (booking) {
    booking.status = status
  }
}

const addBooking = () => {
  if (!newBooking.value.customerName || !newBooking.value.date || !newBooking.value.time) {
    alert('Please fill in all required fields')
    return
  }
  const booking: Booking = {
    id: `b${bookings.value.length + 1}`,
    ...newBooking.value,
    status: 'confirmed',
    source: 'online',
    createdAt: new Date().toISOString()
  }
  bookings.value.push(booking)
  newBooking.value = {
    customerName: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  }
  dialogOpen.value = false
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  })
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours || '0')
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl md:text-4xl font-bold">Reservations</h1>
        <span class="text-accent-foreground/60">Manage table bookings and customer reservations</span>
      </div>
      <button
        @click="dialogOpen = true"
        class="border-border border px-4 py-2 flex justify-center items-center space-x-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <i class="pi pi-plus"></i>
        <span>New Booking</span>
      </button>
    </div>

    <!-- Stats Cards Grid -->
    <div class="flex flex-col gap-4 md:flex-row w-full">
      <!-- Total Bookings -->
      <div class="border rounded-lg w-full shadow p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Bookings</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-2xl font-bold">{{ bookings.length }}</span>
            <span class="text-muted-foreground font-light text-sm">This month</span>
          </div>
        </div>
        <div>
          <i class="pi pi-calendar text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>

      <!-- Confirmed Bookings -->
      <div class="border rounded-lg w-full shadow p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Confirmed</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-2xl font-bold text-green-500">{{ confirmedCount }}</span>
            <span class="text-muted-foreground font-light text-sm">Ready to serve</span>
          </div>
        </div>
        <div>
          <i class="pi pi-check-circle text-[120px] text-green-500 opacity-5"></i>
        </div>
      </div>

      <!-- Total Guests -->
      <div class="border rounded-lg w-full shadow p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Guests</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-2xl font-bold">{{ totalGuests }}</span>
            <span class="text-muted-foreground font-light text-sm">Expected arrivals</span>
          </div>
        </div>
        <div>
          <i class="pi pi-users text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>

      <!-- Voice Agent -->
      <div class="border rounded-lg w-full shadow p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Via Voice Agent</span>
          <div class="flex flex-col">
            <span class="text-lg md:text-2xl font-bold text-primary">{{ voiceAgentBookings.length }}</span>
            <span class="text-muted-foreground font-light text-sm">Automated bookings</span>
          </div>
        </div>
        <div>
          <i class="pi pi-robot text-[120px] text-primary opacity-5"></i>
        </div>
      </div>
    </div>

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

        <form @submit.prevent="addBooking" class="space-y-4">
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

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-2 text-sm font-medium text-muted-foreground">Email</label>
              <input
                v-model="newBooking.email"
                type="email"
                class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-muted-foreground">Phone</label>
              <input
                v-model="newBooking.phone"
                type="tel"
                class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
                placeholder="+1 234-567-8900"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block mb-2 text-sm font-medium text-muted-foreground">Date *</label>
              <input
                v-model="newBooking.date"
                type="date"
                class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                required
              />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-muted-foreground">Time *</label>
              <input
                v-model="newBooking.time"
                type="time"
                class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Number of Guests *</label>
            <input
              v-model.number="newBooking.guests"
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
              v-model="newBooking.specialRequests"
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

    <!-- Tabs Navigation -->
    <div class="space-y-4">
      <div class="flex gap-2 border-b border-border">
        <button
          @click="currentTab = 'all'"
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
          Today ({{ todayBookings.length }})
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
          Upcoming ({{ upcomingBookings.length }})
        </button>
      </div>

      <!-- All Bookings Tab -->
      <div v-if="currentTab === 'all'" class="space-y-4">
        <div v-if="bookings.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
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
                    <p class="text-xs text-muted-foreground">{{ booking.email }}</p>
                  </div>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(booking.status)]">
                {{ booking.status }}
              </span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 pb-4 border-b border-border">
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-calendar text-muted-foreground"></i>
                <span>{{ formatDate(booking.date) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-clock text-muted-foreground"></i>
                <span>{{ formatTime(booking.time) }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i class="pi pi-users text-muted-foreground"></i>
                <span>{{ booking.guests }} guest{{ booking.guests !== 1 ? 's' : '' }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <i :class="['pi', booking.source === 'voice-agent' ? 'pi-robot' : booking.source === 'phone' ? 'pi-phone' : 'pi-globe']"></i>
                <span class="capitalize">{{ booking.source === 'voice-agent' ? 'Voice Agent' : booking.source }}</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-muted-foreground mb-1">Contact</p>
                <p class="text-sm font-medium">{{ booking.phone }}</p>
              </div>
              <div v-if="booking.specialRequests">
                <p class="text-xs text-muted-foreground mb-1">Special Requests</p>
                <p class="text-sm">{{ booking.specialRequests }}</p>
              </div>
            </div>

            <div v-if="booking.status === 'pending'" class="flex gap-2 pt-3 border-t border-border">
              <button
                @click="updateBookingStatus(booking.id, 'confirmed')"
                class="flex-1 px-3 py-2 rounded-lg border border-border bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <i class="pi pi-check"></i>
                Confirm
              </button>
              <button
                @click="updateBookingStatus(booking.id, 'cancelled')"
                class="flex-1 px-3 py-2 rounded-lg border border-border bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              >
                <i class="pi pi-times"></i>
                Cancel
              </button>
            </div>
          </div>
        </template>
      </div>

      <!-- Today Tab -->
      <div v-if="currentTab === 'today'" class="space-y-4">
        <div v-if="todayBookings.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No bookings for today</p>
        </div>
        <template v-else>
          <div
            v-for="booking in todayBookings"
            :key="booking.id"
            class="border border-border rounded-lg bg-card p-4 hover:bg-accent/30 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <i class="pi pi-user text-accent-foreground"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base">{{ booking.customerName }}</h3>
                    <p class="text-xs text-muted-foreground">{{ booking.phone }}</p>
                  </div>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(booking.status)]">
                {{ booking.status }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-muted-foreground mt-3">
              <div class="flex items-center gap-1">
                <i class="pi pi-clock"></i>
                {{ formatTime(booking.time) }}
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-users"></i>
                {{ booking.guests }} guest{{ booking.guests !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Upcoming Tab -->
      <div v-if="currentTab === 'upcoming'" class="space-y-4">
        <div v-if="upcomingBookings.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No upcoming bookings</p>
        </div>
        <template v-else>
          <div
            v-for="booking in upcomingBookings"
            :key="booking.id"
            class="border border-border rounded-lg bg-card p-4 hover:bg-accent/30 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <i class="pi pi-user text-accent-foreground"></i>
                  </div>
                  <div>
                    <h3 class="font-bold text-base">{{ booking.customerName }}</h3>
                    <p class="text-xs text-muted-foreground">{{ booking.email }}</p>
                  </div>
                </div>
              </div>
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold border', getStatusColor(booking.status)]">
                {{ booking.status }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-sm text-muted-foreground mt-3 flex-wrap">
              <div class="flex items-center gap-1">
                <i class="pi pi-calendar"></i>
                {{ formatDate(booking.date) }}
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-clock"></i>
                {{ formatTime(booking.time) }}
              </div>
              <div class="flex items-center gap-1">
                <i class="pi pi-users"></i>
                {{ booking.guests }} guest{{ booking.guests !== 1 ? 's' : '' }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
