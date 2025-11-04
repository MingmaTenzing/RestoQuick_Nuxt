<script lang="ts" setup>

import { mockShifts } from '~/lib/roster-mockdata';
const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();

const { isStaffDragged, staffDragEnd, staffisDragged} = useStaffDrag();


const { shifts, edit_shift_time, addShift, remove_shift} = useRoster();



function onDrop(event: DragEvent, shift_date: Date) {

    console.log('on drop called');

    console.log(event.dataTransfer?.getData("staffId"))

    const staff_id = event.dataTransfer?.getData("staffId");

    addShift(staff_id!, shift_date);

    console.log(shifts.value)

    // sets the staff drag to false and removes the border sytling
 staffDragEnd()

}


</script>




<template> 

<div>
    <div class=" flex justify-between items-center  w-full">

        <span class=" text-2xl font-semibold">Weekly 
            Schedule</span>

            <div class=" flex gap-4 items-center">
                <button v-on:click="previousWeek()" class=" border px-4 py-2 rounded-lg"><</button>
                <span class=" font-medium text-lg">
                    
                    {{ weekRangeText }}
                </span>
                <button v-on:click="nextWeek()" class=" border px-4   py-2 rounded-lg">></button>
                <button  v-on:click="goToCurrentWeek()" class=" rounded-lg border border-border   px-4 py-2 bg-accent text-accent-foreground">Get Current Week</button>
            </div>
    </div>



    <!-- week dates and drag and drop  -->

    <section class=" flex  justify-around gap-4  ">
        <div class=" flex w-full flex-col gap-4" v-for="date in weekDates" :key="date.date.toLocaleDateString()">
        <div :class="['flex flex-col items-center justify-center p-4 rounded-lg  ', date.isToday ? 'bg-accent text-primary':' bg-accent/50']">
            <span>{{ date.dayName }}</span>
            <span>{{ date.dayNumber }}</span>
            <span>{{ date.date.toISOString().split('T')[0] }}</span>


        </div>
<!--  shift -->

        <div @drop="onDrop($event, date.date) "
        @dragover.prevent  
       

        :class="['   min-h-[120px] p-4  border-2 border-dashed rounded-lg', isStaffDragged?'border-amber-500':'']">

        <div  v-for="shift in shifts" :key="shift.id">
            <div v-if="shift.date == date.date">
                <span>{{ shift.date }}</span>

                <div>
                    <roster-components-staff-shift :staff_id="shift.staffId" ></roster-components-staff-shift>
                </div>

                <p>{{ shift.startTime }}</p>
                <p>{{ shift.endTime }}</p>
            </div>
            
        </div>

        </div>
    


    </div>


    </section>    


</div>



</template>