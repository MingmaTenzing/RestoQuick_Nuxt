<script lang="ts" setup>
import { Role, WeekDay } from '~/generated/prisma/enums';
import type { StaffCreateInput } from '~/generated/prisma/models';
    const emit = defineEmits(['close_modal'])



const add_staff_form = reactive<StaffCreateInput>({

  firstname: '',
  lastName: '',
  role: 'Bartender' , // just for now its set as the default value... will change as user puts input
  email: '',
  phone: '',
  availability:['FRI','MON','MON'] ,
  profile_photo_url: ''

  
})




const add_availability_day = (available_day: WeekDay) => {
   const is_already_added = add_staff_form.availability
}


watch(add_staff_form, () => {

  console.log(add_staff_form)
  console.log( add_staff_form.availability);
})


</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-6">
        <h2 class="text-lg font-semibold">Add Staff Member</h2>
        <p class="text-sm text-muted-foreground">Add a new staff member to your restaurant</p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- First & Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">First Name</label>
            <input
              type="text"
              placeholder="First name"
              v-model="add_staff_form.firstname"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              v-model="add_staff_form.lastName"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input
            type="email"
            v-model="add_staff_form.email"
            placeholder="email@restaurant.com"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Phone</label>
          <input
            type="tel"
            placeholder="555-0106"
            v-model="add_staff_form.phone"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            
            
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>

        

        <!-- Role -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Role</label>
          <select v-model="add_staff_form.role" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
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
        <div class="space-y-2">
          <label class="text-sm font-medium">Availability</label>
          <div class="flex flex-wrap gap-2">
            <button  type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Mon</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Tue</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Wed</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80">Thu</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80">Fri</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Sat</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Sun</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-8 pt-6 border-t">
        <button @click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          Cancel
        </button>
        <button class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Add Staff
        </button>
      </div>
    </div>
  </div>
</template>
