

<script lang="ts" setup>
import { ref } from 'vue'
import type { Staff } from '~/generated/prisma/client';
import { Role, WeekDay } from '~/generated/prisma/enums';



// here the staff is passed from the staff card
const props = defineProps<{edit_staff: Staff}>()
const emit = defineEmits(['close_modal'])

const toast = useToast();
const isLoading = ref(false);

const edit_staff_form = reactive({
  firstname: props.edit_staff.firstname,
  lastName: props.edit_staff.lastName,
  email: props.edit_staff.email,
  phone: props.edit_staff.phone,
  role: props.edit_staff.role,
  availability: props.edit_staff.availability,
  profile_photo_url: props.edit_staff.profile_photo_url
  
})


const isDaySelected = (day: WeekDay): boolean => {
  return edit_staff_form.availability.includes(day);
}


const add_availability_day = (available_day: WeekDay) => {

  // check the day if included already in the availability array.. a
// if not then add else remove. 
  const check_day = edit_staff_form.availability.find((day) => available_day == day);

  if (check_day) {
 return   edit_staff_form.availability = edit_staff_form.availability.filter((day) => day != check_day )
  }
  edit_staff_form.availability.push(available_day)
  console.log(edit_staff_form.availability) 

}



async function submit_edit_staff() {
  isLoading.value = true;

  try {
    const response = await $fetch(`/api/staff/${props.edit_staff.id}`, {
      method: 'PATCH', 
      body: edit_staff_form
    })

    if (response) {
      toast.success({
        title:'Staff Details Updated'
      })
    }

    
  } catch (error) {
    console.log(error)
    toast.error({
      title: error as string
    })
  } finally {
    isLoading.value = false;
  }

}


</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-lg">
      <!-- Header -->

      <div class=" flex  justify-between items-center">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-lg font-semibold">Edit Staff Member</h2>
          <p class="text-sm text-muted-foreground">Update the details of the staff member</p>
        </div>

<div>

  <!-- profile image -->
  <NuxtImg :src="props.edit_staff.profile_photo_url"  class=" w-18 h-18 object-cover object-top rounded-full"/>
</div>
</div>


<form v-on:submit.prevent="submit_edit_staff">
  <!-- edit_staff_form -->
  <div class="space-y-6" :class="{ 'opacity-50 pointer-events-none': isLoading }">
    <!-- First & Last Name -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">First Name</label>
        <input
          v-model="edit_staff_form.firstname"
          type="text"
          placeholder="First name"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Last Name</label>
        <input
          v-model="edit_staff_form.lastName"
          type="text"
          placeholder="Last name"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>

    <!-- Email -->
    <div class="space-y-2">
      <label class="text-sm font-medium">Email</label>
      <input
        v-model="edit_staff_form.email"
        type="email"
        placeholder="email@restaurant.com"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>

    <!-- Phone & Hourly Rate -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">Phone</label>
        <input
          v-model="edit_staff_form.phone"
          type="tel"
          placeholder="555-0106"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

    
    </div>

    <!-- Role & Status -->
   <div class="space-y-2">
      <label class="text-sm font-medium">Role</label>
      <select v-model="edit_staff_form.role" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
        <option value="">Select role</option>
        <option :value="Role.Chef">Chef</option>
        <option :value="Role.Waiter">Waiter</option>
        <option :value="Role.Bartender">Bartender</option>
        <option :value="Role.Manager">Manager</option>
        <option :value="Role.Cook">Cook</option>
        <option :value="Role.Kitchen_Hand">Kitchen Hand</option>
      </select>
    </div>

    <!-- Availability -->
     <!-- Availability -->
   <div class="space-y-2">
      <label class="text-sm font-medium">Availability</label>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="day in [WeekDay.MON, WeekDay.TUE, WeekDay.WED, WeekDay.THU, WeekDay.FRI, WeekDay.SAT, WeekDay.SUN]"
          :key="day"
          @click="add_availability_day(day)" 
          type="button"
          :class="[
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            isDaySelected(day) 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          ]"
        >
          {{ day.slice(0, 3) }}
        </button>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-8 pt-6 border-t">
    <button :disabled="isLoading" v-on:click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      Cancel
    </button>
    <button v-if="!isLoading" type="submit" class="w-34 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
      Save Changes
    </button>

    <div v-if="isLoading" class="w-34 flex justify-center items-center px-4 py-2 rounded-md bg-primary text-primary-foreground transition-colors">
      <i class="pi pi-spinner animate-spin"></i>
    </div>
  </div>

</form>
    </div>
  </div>
</template>
