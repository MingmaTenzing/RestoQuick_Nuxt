

<script lang="ts" setup>
import { ref } from 'vue'
import { RoleandWeekDay_Constant } from '~/client_utils/constants';
import type { Staff, WeekDay } from '~/generated/prisma/client';

const { ROLES, WEEKDAYS } = RoleandWeekDay_Constant()


// here the staff is passed from the staff card
const props = defineProps<{ edit_staff: Staff }>()
console.log(props.edit_staff)

// the edit staff emits two event close modal and refetch-data when editing staff details is successfull
const emit = defineEmits(['close_modal'])

const toast = useToast();
const isLoading = ref(false);
enum EmploymentType {
  
}

const employmentTypes = ['PartTime',
  'FullTime',
  'Casual']



const edit_staff_form = reactive({
  firstname: props.edit_staff.firstname,
  lastName: props.edit_staff.lastName,
  email: props.edit_staff.email,
  phone: props.edit_staff.phone,
  role: props.edit_staff.role,
  availability: props.edit_staff.availability, 
  profile_photo_url: props.edit_staff.profile_photo_url,

  employmentType: props.edit_staff.employmentType,
    perHourRate: props.edit_staff.perHourRate
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

      //this refreshes the data in the maing staff page
      await refreshNuxtData('staffs')
      emit('close_modal')
      
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

    <!-- Phone-->
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
    <!-- Employment Type & Hourly Rate -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">EmploymentType</label>
        <select v-model="edit_staff_form.employmentType" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
       <option selected disabled>{{props.edit_staff.employmentType}}</option>
        <option v-for="employmentType in employmentTypes" :key="employmentType"  :value="employmentType">
   {{ employmentType }}
        </option>
      </select>
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium">Per hour Rate </label>
        <div class="rounded-md border border-border   flex items-center px-3 py-2 space-x-2 outline-none">
          <span>
 $
          </span>
          <input
            v-model="edit_staff_form.perHourRate"
            type="number"
            step="any"
            placeholder="$/per_hour"
            class="w-full  placeholder-muted-foreground  outline-none "
          />
        </div>
      </div>

    
    </div>

   
   <!-- Role -->
         <div class="space-y-2">
      <label class="text-sm font-medium">Role</label>
      <select v-model="edit_staff_form.role" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
       <option selected disabled>{{ props.edit_staff.role }}</option>
        <option v-for="role in ROLES" :key="role"  :value="role">
   {{ role }}
        </option>
      </select>
    </div>

    <!-- Availability -->
     <div class="space-y-2">
          <label class="text-sm font-medium">Availability</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="day in WEEKDAYS"
              :key="day"
              @click="add_availability_day(day as WeekDay)" 
              type="button"
              :class="[
                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                isDaySelected(day as WeekDay) 
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
    <button type="button" :disabled="isLoading" v-on:click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
