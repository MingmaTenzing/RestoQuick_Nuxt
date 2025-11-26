
<script setup lang="ts">
import type { BookingCreateInput } from '~/generated/prisma/models';


const toast = useToast();
const emit = defineEmits(['diaglogClosed'])

const new_booking_form = ref<BookingCreateInput>(
  // table can be assigned when booking as well but its optional 
  // but most of the time its just customer details and later
  //restaurant decide to assign a table so it can be updated by the restaurant manager
  // from the dashboard.
  //so here table id is not assigned in the booking 
  {
    customerName: '',
    customerPhone: '',
    bookingTime: new Date().toISOString(),
    guestCount: 1,
    specialRequest: '',


  }
); 

const reset_copy_booking_form = ref({...new_booking_form.value})


function closeDialog() {
// when this function is called it emits the dialogClosed event to the parent.
  emit('diaglogClosed')
  new_booking_form.value = reset_copy_booking_form.value
}


async function submit_booking() {
//here we are converting the booking time to DATETIME Cuase prisma expects this type
  new_booking_form.value.bookingTime = new Date(new_booking_form.value.bookingTime).toISOString();

  //form submission for booking


try {
  
  const response = await $fetch('/api/bookings', {
    method: 'post',
    body: {
      booking: new_booking_form.value
    }

    
    
  })
  if (response) {
    toast.success({title:"Booking Submitted", message:"You will be notified soon"})
    new_booking_form.value = reset_copy_booking_form.value;
  }
} catch (error) {
  console.log(error)
  toast.error({ title: "Error", message: 'Please call for booking.' })
  new_booking_form.value = reset_copy_booking_form.value
}
  
  
 
  
}

</script>
<template>


<!-- Add Booking Modal -->
    <div class="  flex  justify-center items-center fixed w-screen h-screen bg-background/90 backdrop-blur-xs  top-0 z-10 left-0">
      <div class="bg-card text-foreground rounded-xl shadow-xl border border-border p-6 w-full max-w-md relative">
        <!-- this button is used for closing the modal -->
        <button
        
          v-on:click="closeDialog"
          class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <i class="pi pi-times text-xl"></i>
        </button>

        <h2 class="text-2xl font-bold mb-1">Create New Booking</h2>
        <p class="text-muted-foreground text-sm mb-6">Add a new table reservation to the system</p>

        <form @submit.prevent="submit_booking"  class="space-y-4">
          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Customer Name *</label>
            <input
              v-model="new_booking_form.customerName"
              type="text"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Phone *</label>
            <input
              v-model="new_booking_form.customerPhone"
              type="tel"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground"
              placeholder="+1 234-567-8900"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Booking Date & Time *</label>
            <input
              v-model="new_booking_form.bookingTime"
              type="datetime-local"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Number of Guests *</label>
            <input
              v-model.number="new_booking_form.guestCount"
              type="number"
              min="1"
              max="25"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div>
            <label class="block mb-2 text-sm font-medium text-muted-foreground">Special Requests</label>
            <textarea
              v-model="new_booking_form.specialRequest"
              class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none placeholder-muted-foreground resize-none"
              rows="3"
              placeholder="Window seat, birthday party, allergies, etc."
            ></textarea>
          </div>

          <div class="flex gap-2 pt-2">
            <button
              type="button"
             v-on:click="closeDialog"
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
