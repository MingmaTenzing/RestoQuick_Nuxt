<script lang="ts" setup>

import { mockStaff } from '~/lib/roster-mockdata';
const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();

const isaddShift_Modal_Open = ref<boolean>(false)

const { shifts } = useRoster();

const { addShiftModal, open_add_shiftModal, close_add_shiftModal } = useAddShiftModal()





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
 <div    class='  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg hover:border-amber-600'>

<!-- add shift button -->
      <button v-on:click="open_add_shiftModal(date.date)" class=" flex justify-end">
           <i class=" pi pi-plus"></i>
           
           
      </button>


   <!-- staff shift time and name -->

        <div   v-for="shift in shifts.filter((shift) => shift.date.toDateString() == date.date.toDateString())" :key="shift.id">


            <roster-components-staff-shift :shift_id="shift.id" :staff_id="shift.staffId"></roster-components-staff-shift>
            </div>

    </div>

    </div>


    </section>   
    
    
<!-- addd shift modal form -->

  <roster-components-add-shift v-if="addShiftModal.isOpen"></roster-components-add-shift>



</div>



</template>