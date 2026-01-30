<script lang="ts" setup>

// import  { Role, WeekDay } from '~/generated/prisma/enums';

import { type Role, type WeekDay } from "~/generated/prisma/enums";
import type { CloudinaryUploadResponse } from "../../../types/cloudinary"
import { RoleandWeekDay_Constant } from "~/client_utils/constants";


//here importing the role and weekday constant values 
const { ROLES, WEEKDAYS } = RoleandWeekDay_Constant()





const emit = defineEmits(['close_modal'])
const runtimeConfig = useRuntimeConfig();
const toast = useToast()
const image_uploading = ref(false)
const staff_add_loading = ref(false)
const image_upload_success = ref(false)




const defaultStaffForm = () => ({
  firstname: '',
  lastName: '',
  role: "" as Role,
  email: '',
  phone: '',
  availability: [] as WeekDay[],
  profile_photo_url: '',
  employmentType: '',
  perHourRate: 0.0 as Number,

})
 
const staff_form = reactive(defaultStaffForm())

// reset function
function resetStaffForm() {
  Object.assign(staff_form, defaultStaffForm())
}

const employmentTypes = ['PartTime',
  'FullTime',
  'Casual']


const add_availability_day = (available_day: WeekDay) => {

  // check the day if included already in the availability array.. a
// if not then add else remove. 
  const check_day = staff_form.availability.find((day) => available_day == day);

  if (check_day) {
 return   staff_form.availability = staff_form.availability.filter((day) => day != check_day )
  }
  staff_form.availability.push(available_day)
  console.log(staff_form.availability) 

   }


   
//whenever a new image is select image_upload function runs
async function image_upload(event: Event) {
  image_upload_success.value = false;
  image_uploading.value = true;
  const input = event.target as HTMLInputElement;


  const image = input.files?.[0];


  if (!image) {
    return toast.error({
      message:'No image provided'
    })
   }

  // size guard (300KB)
  if (image.size > 300 * 1024) {
    toast.error({
      message: "Image upload only supports upto 300kb"
    })
    input.value = ''
    return
  }

  // type guard
  if (!image.type.startsWith("image/")) {
    toast.error({
      message: "Only images allowed"
    })
    input.value = ''
    return
  }

  // creating form data for sending the image file in post request.
  const formData = new FormData();
  formData.append("file", image)
  formData.append('upload_preset', runtimeConfig.public.CLOUDINARY_UPLOAD_PRESET)


 try {
   const upload_image = await $fetch<CloudinaryUploadResponse>(`https://api.cloudinary.com/v1_1/${runtimeConfig.public.CLOUDINARY_CLOUD_NAME}/image/upload`, {
     method: 'POST',
     body: 
      formData
   })

  //setting photourl value once image is uploaded later used for adding staff request
   staff_form.profile_photo_url = upload_image.secure_url;
   image_upload_success.value = true;

   console.log(staff_form)

  
 } catch (error) {

   console.error(error)
  alert(error)
   
  
 }
 finally {
   image_uploading.value = false;
 }

  
  
 
}


const isDaySelected = (day: WeekDay): boolean => {
  return staff_form.availability.includes(day);
}



async function add_new_staff() {
  staff_add_loading.value = true;

 try {
   const response = await $fetch("/api/staff", 
     {
       method: 'POST',
       body: {
        staff: staff_form
      }
    }
   )
   if (response) {
     toast.success({
      title: "Staff Added"
     })
      

     resetStaffForm();

   

     
   }



   
 } catch (error) {
  console.log(error)
 } finally {
   staff_add_loading.value = false
   await refreshNuxtData('staffs')
  emit('close_modal')
 }

}


</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <div class="bg-background h-[80vh] overflow-y-scroll rounded-lg border p-6 shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-6">
        <h2 class="text-lg font-semibold">Add Staff Member</h2>
        <p class="text-sm text-muted-foreground">Add a new staff member to your restaurant</p>
      </div>

      <!-- Form -->
      <form v-on:submit.prevent="add_new_staff" class="space-y-4">
        <!-- First & Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">First Name</label>
            <input required
              type="text"
              placeholder="First name"
              v-model="staff_form.firstname"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Last Name</label>
            <input required
              type="text"
              placeholder="Last name"
            
              v-model="staff_form.lastName"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input required
            type="email"
            v-model="staff_form.email"
            placeholder="email@restaurant.com"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <!-- Phone -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Phone</label>
          <input required
            type="tel"
            placeholder="555-0106"
            v-model="staff_form.phone"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

         <!-- Employment Type & Hourly Rate -->
    <div class="grid grid-cols-2 gap-4">
      <div class="space-y-2">
        <label class="text-sm font-medium">EmploymentType</label>
        <select required v-model="staff_form.employmentType" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
       <option selected disabled>{{staff_form.employmentType}}</option>
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
          <input required
            v-model="staff_form.perHourRate"
            type="number"
            step="any"
            placeholder="$/per_hour"
            class="w-full  placeholder-muted-foreground  outline-none "
          />
        </div>
      </div>

    
    </div>



        <!-- profile picture -->
        <div class="space-y-2">
          <div class=" flex space-x-2">
            <label class="text-sm font-medium">Profile Picture (Max - 300KB)</label>
            <i v-if="image_uploading" class="pi pi-spinner animate-spin"></i>
            <i v-if="image_upload_success" class="pi pi-check-circle text-green-600 "></i>

          </div>
          <input required
            type="file"
            accept="image/*"
            @change="image_upload($event)"
            
            
            id="profile_picture_input"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring"
          />

        </div>

        

        <!-- Role -->
         <div class="space-y-2">
      <label class="text-sm font-medium">Role</label>
      <select required v-model="staff_form.role" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
       
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

      <!-- Footer -->
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end pt-6 border-t">
        <button @click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          Cancel
        </button>
        <div>
          <button  v-if="staff_add_loading" class="px-4 py-2 rounded-md w-26 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <i  class="pi pi-spinner animate-spin"></i>
          </button>
          <button v-else type="submit" class="px-4 py-2 w-26 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Add Staff
          </button>

        </div>
      </div>
      </form>
  </div>

  </div>
</template>
