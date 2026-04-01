<script setup lang="ts">

import type { Prisma, Staff , Shift} from '~/generated/prisma/client';


//here shift and staff is passed from the staff component
//cause both of them are fetched on the staff component

const toast = useToast();
const {editshiftModal,  close_edit_shiftModal } = useeditShiftModal();
const { is_useShiftMutating } = useShiftMutation()
const isSubmitting = ref<boolean>(false);





const shift_form = ref<Prisma.ShiftUpdateWithoutStaffInput>({

    //start and endtime is coming binded to the input
    startTime: editshiftModal.value.shift?.startTime,
    endTime: editshiftModal.value.shift?.endTime,
    //is assigned later when submitting form
   id:editshiftModal.value.shift?.id,

    //    date comes from the addshiftmodal composable
    date: new Date(editshiftModal.value.shift?.date!), //default, 

    //position is binded to input as well
    position: editshiftModal.value.shift?.position,
   
  

})





async function submit_shift() {
    isSubmitting.value = true
    is_useShiftMutating.value = true
    try {
        const update_shift = await $fetch(`/api/shift/${editshiftModal.value.shift?.id}`, {
            method: 'put', 
            body: shift_form.value
        })

        if (update_shift) {
            toast.success({ title: "Success", message: "Shift Updated" })
            await refreshNuxtData('shifts')
            close_edit_shiftModal()
        }
    } catch (error) {
        const nuxtError = isNuxtError(error) ? error : null
        toast.error({title: "Error", message: nuxtError?.message})
    } finally {
        isSubmitting.value = false
        is_useShiftMutating.value = false
    }
}




</script>


<template>
    <div  class=" flex  justify-center items-center fixed  w-screen h-screen bg-background/90 backdrop-blur-xs  top-0 z-10 left-0">

        <div class=" w-125 flex flex-col gap-4  p-4 bg-background   drop-shadow-lg border   drop-shadow-accent opacity-100 rounded-3xl" >
            
            <section class=" space-y-2">
                <!-- modal header -->
                <div class=" flex items-center justify-between">
    
                    <span class=" text-xl text-card-foreground font-semibold">Edit Shift</span>
                   <button v-on:click="close_edit_shiftModal()">
    
                       <i class=" pi pi-times"></i>
                   </button> 
                </div>
    
                <div class=" font-light text-muted-foreground" >Edit {{ editshiftModal.shift?.staff.firstname }} {{ editshiftModal.shift?.staff.lastName }}'s shift for {{ shift_form.date?.toLocaleString('en-AU', {
    year: 'numeric',
    month: 'short',
                    day: '2-digit'
                }) }}</div>

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
                     <div  class="border border-border  p-2 rounded-3xl flex justify-between items-center ">
                        

                        <input disabled  class=" text-muted-foreground font-light outline-none text-sm" placeholder="Select a staff member"  :value="editshiftModal.shift?.staff.firstname"></input>
                        
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
                    <input required class="outline-none text-primary  " type="time" :placeholder="editshiftModal.shift?.startTime"  v-model="shift_form.startTime" />
                

                </div>
                

            </div>
            <div class=" flex flex-col w-[45%]">
                <span class=" text-sm font-medium
                ">
                    End Time
                </span>
                <div class=" border border-border focus:border-ring  p-2 rounded-3xl">
                    <input required class="outline-none text-primar" type="time" placeholder="dfd"  v-model="shift_form.endTime"/>

                </div>
                

            </div>
        </section>

        <!-- shift position -->
    <section class=" flex flex-col space-y-2">
         <span class=" text-sm font-medium
                ">
                   Position
                </span>
                <input class="outline-none border border-border rounded-3xl p-2 text-sm" type="text" v-model="shift_form.position" :placeholder="editshiftModal.shift?.position"/>


    </section>

    <!-- cancel and add shift buttons -->

    <section class=" flex justify-end space-x-2 items-center text-sm">

        <button type="button" v-on:click="close_edit_shiftModal" :disabled="isSubmitting" class="px-4  py-2  hover:border-ring rounded-3xl border border-border disabled:opacity-50 disabled:cursor-not-allowed">Cancel</button>
        <button type="submit" :disabled="isSubmitting" class="px-4  py-2  hover:border-ring rounded-3xl border border-border bg-green-600  text-green-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <i v-if="isSubmitting" class="pi pi-spin pi-spinner"></i>
            {{ isSubmitting ? 'Updating...' : 'Update Shift' }}
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