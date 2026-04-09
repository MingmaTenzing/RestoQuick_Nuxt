<script setup lang="ts">

import type { Prisma, Staff , Shift} from '~/generated/prisma/client';
import { getStaffInitials } from '~/client_utils/staff_avatar';

const toast = useToast();


const { addShiftModal, open_add_shiftModal, close_add_shiftModal } = useAddShiftModal()



const {data: staffs} = await useFetch<Staff[]>("/api/staff", {lazy: true})



const is_select_staff_open = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)

const selected_staff = ref<Staff>();

const shift_form = ref<Prisma.ShiftUncheckedCreateInput>({
    startTime: '',
    endTime: '',
   staffId: '',

    //    date comes from the addshiftmodal composable
    date: addShiftModal.value.date!, 

    position: '',
   
  

})





async function submit_shift() {
    // this can be optimized once connected with database 

    isSubmitting.value = true
    try {
        const add_shift = await $fetch('/api/shift', {
            method: 'post',
            body: shift_form.value
        })
    
        if (add_shift) {
            await refreshNuxtData('shifts')
            toast.success({title:"Success", message:"Shift Added"})
            close_add_shiftModal()
        }
        
    } catch (error) {
        const nuxtError = isNuxtError(error) ? error : null
        toast.error({title: "Error", message: nuxtError?.message})
    } finally {
        isSubmitting.value = false
    }


  

    
}

function onSelectStaff(staff: Staff) {
    
    selected_staff.value = staff; //to show it if staff is selected in the input itself
    is_select_staff_open.value = false
    shift_form.value.staffId = staff.id;
}

</script>


<template>
    <div v-if="addShiftModal.isOpen" class=" flex  justify-center items-center fixed w-screen h-screen bg-background/90 backdrop-blur-xs  top-0 z-10 left-0">

        <div class=" w-125 flex flex-col gap-4  p-4 bg-background   drop-shadow-lg border   drop-shadow-accent opacity-100 rounded-3xl" >
            
            <section class=" space-y-2">
                <!-- modal header -->
                <div class=" flex items-center justify-between">
    
                    <span class=" text-xl text-card-foreground font-semibold">Add New Shift</span>
                   <button v-on:click="close_add_shiftModal()">
    
                       <i class=" pi pi-times"></i>
                   </button> 
                </div>
    
                <div class=" font-light text-muted-foreground" >Schedule a staff member for {{ addShiftModal.date?.toLocaleDateString() }}</div>

            </section>


<section >
    <!-- form sections -->
    <form @submit.prevent="submit_shift" class=" space-y-4">
        <!-- staff member section -->
        <section class=" space-y-2">
            
            <div class="text-sm font-medium">
                Staff Member
    
            </div>
            <div >
                <div class="relative  items-center  w-1/2"> 
                     <div v-on:click="is_select_staff_open = !is_select_staff_open" class="border border-border  p-2 rounded-3xl flex justify-between items-center ">
                        

                        <input v-if="selected_staff" class=" text-muted-foreground font-light outline-none text-sm" placeholder="Select a staff member"  :value="selected_staff.firstname"></input>
                        <input v-else class=" text-muted-foreground font-light outline-none text-sm" placeholder="Select a staff member" required ></input>
                         <i class=" pi pi-angle-down"></i>
                         </div>

                    <div v-if="is_select_staff_open" class=" absolute w-full h-65 overflow-y-scroll  z-10  space-y-2  bg-background  shadow-2xl rounded-3xl ">
                        <div v-on:click="() => onSelectStaff(staff)" class="hover:bg-accent" v-for="staff in staffs" :key="staff.id" >
                            <div class="flex  items-center justify-between p-2 ">
                                <div class=" flex space-x-2 items-center">
                                    <NuxtImg v-if="staff.profile_photo_url" :src="staff.profile_photo_url" class=" w-8 h-8 rounded-full object-cover" ></NuxtImg>
                                    <div v-else class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-semibold">
                                        {{ getStaffInitials(staff) }}
                                    </div>
                                    <span>{{ staff.firstname }} {{ staff.lastName[0] }}.</span>
                                </div>
                            

                            <span class=" border  border-border text-muted-foreground text-xs px-2 py-1 rounded-3xl">{{ staff.role }}</span>
                            </div>
                
                        </div>
                        
                    </div>
                </div>
    
            </div>
    
        </section>  
        
        
        <!-- start and end time -->
        <section class=" flex justify-between">
            <div class=" flex flex-col w-[45%]">
                <span class=" text-sm font-medium
                ">
                    Start Time
                </span>
                <div class=" border border-border   p-2 rounded-3xl">
                    <input required class="outline-none text-primary  " type="time" v-model="shift_form.startTime" />
                

                </div>
                

            </div>
            <div class=" flex flex-col w-[45%]">
                <span class=" text-sm font-medium
                ">
                    End Time
                </span>
                <div class=" border border-border focus:border-ring  p-2 rounded-3xl">
                    <input required class="outline-none text-primar" type="time" v-model="shift_form.endTime"/>

                </div>
                

            </div>
        </section>

        <!-- shift position -->
    <section class=" flex flex-col space-y-2">
         <span class=" text-sm font-medium
                ">
                   Position
                </span>
                <input  class="outline-none border border-border rounded-3xl p-2 text-sm" type="text" v-model="shift_form.position" placeholder="eg:- Kitchen, Receiption, Front, Floor"/>


    </section>

    <!-- cancel and add shift buttons -->

    <section class=" flex justify-end space-x-2 items-center text-sm">

        <button type="button" v-on:click="close_add_shiftModal()" :disabled="isSubmitting" class="px-4  py-2  hover:border-ring rounded-3xl border border-border disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
        <button type="submit" :disabled="isSubmitting" class="px-4  py-2  hover:border-ring rounded-3xl border border-border bg-green-600  text-green-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            {{ isSubmitting ? 'Adding...' : 'Add Shift' }}
        </button>
    </section>
    </form>

</section>





        </div>

        
    </div>
    
</template>

<style>

input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(0%);
  opacity: 0.6;
  cursor: pointer;
  z-index: 0;
}

.dark-mode input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(100%);
  opacity: 0.6;
  cursor: pointer;
  z-index: 0;
}
</style>