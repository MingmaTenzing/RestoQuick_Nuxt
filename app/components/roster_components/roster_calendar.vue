<script lang="ts" setup>

import type { Shift } from '~/generated/prisma/client';
import { ref, provide } from 'vue';
import { mockStaff } from '~/lib/roster-mockdata';
const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();




const { addShiftModal, open_add_shiftModal, close_add_shiftModal } = useAddShiftModal()
const {editshiftModal} = useeditShiftModal()

// Reactive ref to trigger refetch on shift deletion
const shiftDeleteTrigger = ref(false)

// Function to trigger shift deletion refetch
const triggerShiftRefetch = () => {
  shiftDeleteTrigger.value = !shiftDeleteTrigger.value
}

// Provide the trigger function to child components
provide('triggerShiftRefetch', triggerShiftRefetch)

// the useFetch call is watching addShiftModal.value to refetch data if it changes
// the reason for this is user will open the addshiftmodal and then it will close automatically once its done.
// this elemenates creating another separate variable to watch
// but with further development it might change. for now its fine.
const { data: shifts } = await useFetch<Shift[]>("/api/shift",  {watch: [addShiftModal.value, editshiftModal.value, shiftDeleteTrigger]} )

console.log(shifts)

</script>




<template> 

<div class=" " >
    <div class=" flex justify-between items-center w-full my-4">

        <span class=" text-2xl font-semibold">Weekly 
            Schedule</span>

            <div class=" flex gap-4 items-center">
                <button v-on:click="previousWeek()" class=" border px-4 py-2 bg-card hover:border-ring  rounded-lg"><</button>
                <span class=" font-medium text-lg">
                    
                    {{ weekRangeText }}
                </span>
                <button v-on:click="nextWeek()" class=" border px-4 bg-card hover:border-ring  py-2 rounded-lg">></button>
                <button  v-on:click="goToCurrentWeek()" class=" rounded-lg border border-border bg-card hover:border-ring   px-4 py-2  text-accent-foreground">Get Current Week</button>
            </div>
    </div>



    <!-- week dates -->

    <section class=" flex  justify-around gap-2 ">
        <div class=" flex w-full flex-col gap-4" v-for="date in weekDates" :key="date.date.toLocaleDateString()">
        <div :class="['flex flex-col items-center justify-center p-4 rounded-lg  ', date.isToday ? 'bg-accent text-primary':' bg-accent/50']">
            <span class=" font-light">{{ date.dayName }}</span>
            <div class=" flex gap-1 font-bold">
                <span>{{ date.dayNumber }}</span>
                <span>{{ date.month }}</span>

            </div>


        </div>



<!-- drag and drop is not the best suit so will be moving to adding manually from the shift container
 this section is only being commented out but will have a look in the future possibilities so its not removed-->
<!-- 
        <div @drop="onDrop($event, date.date) "
        @dragover.prevent  
       

        :class="['  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg', isStaffDragged?'border-amber-600':'']">

        <div   v-for="shift in shifts.filter((shift) => shift.date.toDateString() == date.date.toDateString())" :key="shift.id">
            <div>
              

                <div>
                    <roster-components-staff-shift :staff_id="shift.staffId" :shift_id="shift.id" ></roster-components-staff-shift>
                </div>

               
            </div>
            
        </div>

        </div> -->
    

        <!-- shifts of the day container-->
 <div    class='  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg hover:border-ring'>

<!-- add shift button -->
      <button v-on:click="open_add_shiftModal(date.date)" class=" flex justify-end">
           <i class=" pi pi-plus"></i>
           
           
      </button>


   <!-- staff shift time and name -->

        <div   v-for="shift in shifts?.filter((shift) =>new Date(shift.date).toISOString().split('T')[0] ===
      new Date(date.date).toISOString().split('T')[0])" :key="shift.id">


            <roster-components-staff-shift :shift="shift"></roster-components-staff-shift>
            </div>

    </div>

    </div>


    </section>   
    
    
<!-- addd shift modal form -->

  <roster-components-add-shift v-if="addShiftModal.isOpen"></roster-components-add-shift>
<roster-components-edit-shift v-if="editshiftModal.isOpen"></roster-components-edit-shift>

</div>



</template>