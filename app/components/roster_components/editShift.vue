<script setup lang="ts">

import type { Prisma, Staff , Shift} from '~/generated/prisma/client';


//here shift and staff is passed from the staff component
//cause both of them are fetched on the staff component

const toast = useToast();
const {editshiftModal, close_edit_shiftModal } = useeditShiftModal();




const {data:shift_with_staff} = await useFetch(() => `/api/shift/${editshiftModal.value.shiftId}`)

console.log(shift_with_staff.value)

const shift_form = ref<Prisma.ShiftUpdateWithoutStaffInput>({

    //start and endtime is coming binded to the input
    startTime: '',
    endTime: '',

    //is assigned later when submitting form
   id:'',

    //    date comes from the addshiftmodal composable
    date: new Date(Date.now()), //default, 

    //position is binded to input as well
    position: '',
   
  

})





async function submit_shift() {


    //the remaining form value is attached for the put request
    shift_form.value.id = shift_with_staff.value?.id
    shift_form.value.date = shift_with_staff.value?.date;
    console.log(shift_form.value)


    const { data, status, error } = await useFetch(() => `/api/shift/${shift_form.value.id}`, {
        method: 'put', 
            body: shift_form.value
    
})




    if (status.value == 'success' && data.value) {
        
        toast.success({title:"Success", message:"Shift Updated"})
        close_edit_shiftModal()
    }
  else if (status.value == 'error') {

    toast.error({title: "Error", message: error.value?.message})
  }

    
}




</script>


<template>
    <div  class=" flex  justify-center items-center fixed  w-screen h-screen bg-background/90 backdrop-blur-xs  top-0 z-10 left-0">

        <div class=" w-[500px] flex flex-col gap-4  p-4 bg-background   drop-shadow-lg border   drop-shadow-accent opacity-100 rounded-lg" >
            
            <section class=" space-y-2">
                <!-- modal header -->
                <div class=" flex items-center justify-between">
    
                    <span class=" text-xl text-card-foreground font-semibold">Edit Shift</span>
                   <button v-on:click="close_edit_shiftModal()">
    
                       <i class=" pi pi-times"></i>
                   </button> 
                </div>
    
                <div class=" font-light text-muted-foreground" >Edit {{ shift_with_staff?.staff.firstname }} {{ shift_with_staff?.staff.lastName }}'s shift for {{ shift_form.date?.toLocaleString('en-AU', {
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
                     <div  class="border border-border  p-2 rounded-lg flex justify-between items-center ">
                        

                        <input disabled  class=" text-muted-foreground font-light outline-none text-sm" placeholder="Select a staff member"  :value="shift_with_staff?.staff.firstname"></input>
                        
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
                <div class=" border border-border   p-2 rounded-lg">
                    <input required class="outline-none text-primary  " type="time" :placeholder="shift_with_staff?.startTime"  v-model="shift_form.startTime" />
                

                </div>
                

            </div>
            <div class=" flex flex-col w-[45%]">
                <span class=" text-sm font-medium
                ">
                    End Time
                </span>
                <div class=" border border-border focus:border-ring  p-2 rounded-lg">
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
                <input class="outline-none border border-border rounded-lg p-2 text-sm" type="text" v-model="shift_form.position" :placeholder="shift_with_staff?.position"/>


    </section>

    <!-- cancel and add shift buttons -->

    <section class=" flex justify-end space-x-2 items-center text-sm">

        <button v-on:click="close_edit_shiftModal" class="px-4  py-2  hover:border-ring rounded-lg border border-border ">Cancel</button>
        <button  class="px-4  py-2  hover:border-ring rounded-lg border border-border bg-green-600  text-green-50 ">Update Shift

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