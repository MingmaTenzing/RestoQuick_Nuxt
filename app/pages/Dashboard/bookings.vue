<script setup lang="ts">
import { stat } from 'fs';
import { ref, computed } from 'vue'
import type { Booking, BookingStatus } from '~/generated/prisma/client';


definePageMeta({
  layout: 'dashboard-layout'
})

const currentTab = ref('all')

const toast = useToast();

const isAddBooking_dialog_open = ref<boolean>(false);

const { data: bookings, refresh } = await useFetch<Booking[]>('/api/bookings', {
  lazy:true
})


const today_booking = computed(() => {
  const today = new Date().toISOString().split('T')[0];
  return bookings.value?.filter((booking) => new Date(booking.bookingTime).toISOString().split('T')[0] == today)
})

const upcoming_bookings = computed(() => {
  const now = new Date(); // current date & time

  return bookings.value?.filter(b => {
    const bookingDate = new Date(b.bookingTime);
    return bookingDate > now;
  });
});

console.log(upcoming_bookings.value)

console.log(today_booking.value)


function openAddBookingDialog() {
  // opens the modal and stops the background body scroll
  isAddBooking_dialog_open.value = true;
  document.body.classList.add("overflow-hidden")
}



function handle_close_dialog() {
  //the child component <booking-components-add-booking-modal>  emits the event and this function is used to handle 
  // when it clicks on the close button

  isAddBooking_dialog_open.value = false;
  document.body.classList.add("overflow-remove")

  // here the refresh is called after closing the dialog
  //because there's only two outcome from the modal
  // it's either booking or not 
  //so when the modal closes it will refetch the data
    refresh()


}


async function update_booking_status(status: BookingStatus, booking_id: string) {
  // the booking status is emitted by the child component
  //<booking_details_card>

  try {
const response = await $fetch(`/api/bookings/${booking_id}`, {
        method: 'put', 
  body: {
    status: status
  }
            
})

    if (response) {
      toast.success({ title: "Booking Updated" })
      // once the response is received it will refetch the intial bookings request
      refresh();
  
}

  } catch (error) {
    console.log(error)
    toast.error({title:"System Error "})
    
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
      <div>
        <button v-on:click="openAddBookingDialog"
    
          class="border-border   border p-4 flex justify-center items-center space-x-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <i class="pi pi-plus"></i>
          <span>New Booking</span>
        </button>
        
      </div>
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
        v-on:click="currentTab = 'all'"
 
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
          Today ({{ today_booking?.length}})
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
          Upcoming ({{ upcoming_bookings?.length }})
        </button>
      </div>

      <!-- All Bookings Tab -->
      <div v-if="currentTab === 'all'" class="space-y-4">
        <div v-if="bookings?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No bookings yet</p>
        </div>
        <section v-else v-for="booking in bookings"
            :key="booking.id" >

            <booking-components-booking-details-card @update-status="update_booking_status" :booking_details="booking"></booking-components-booking-details-card>
          
        </section>
      </div>
      <div v-if="currentTab === 'today'" class="space-y-4">
        <div v-if="bookings?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No bookings yet</p>
        </div>
        <section v-else v-for="booking in today_booking"
            :key="booking.id" >

            <booking-components-booking-details-card @update-status="update_booking_status" :booking_details="booking"></booking-components-booking-details-card>
          
        </section>
      </div>
      <div v-if="currentTab === 'upcoming'" class="space-y-4">
        <div v-if="bookings?.length === 0" class="border border-border rounded-lg bg-card p-12 text-center">
          <i class="pi pi-inbox text-4xl text-muted-foreground mb-4 block"></i>
          <p class="text-muted-foreground">No bookings yet</p>
        </div>
        <section v-else v-for="booking in upcoming_bookings"
            :key="booking.id" >

            <booking-components-booking-details-card @update-status="update_booking_status" :booking_details="booking"></booking-components-booking-details-card>
          
        </section>
      </div>

    
    </div>
  </div>


  <!-- new bookings dialog -->
  <div v-if="isAddBooking_dialog_open">

    <!-- here the @dialog-closed is the emit event name -->

    <booking-components-add-booking-modal  @diaglog-closed="handle_close_dialog"></booking-components-add-booking-modal>


  </div>
</template>
