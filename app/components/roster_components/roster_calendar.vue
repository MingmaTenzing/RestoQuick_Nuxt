<script lang="ts" setup>

import { mockStaff } from '~/lib/roster-mockdata';
const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();

// const { isStaffDragged, staffDragEnd, staffisDragged} = useStaffDrag();

const isaddShift_Modal_Open = ref<boolean>(false)

const { shifts, edit_shift_time, addShift, remove_shift} = useRoster();




const open_addShift_Modal = () => {
    isaddShift_Modal_Open.value = true;
    document.body.classList.add("overflow-hidden")
}

function close_add_shift_modal() {
    isaddShift_Modal_Open.value = false;
    document.body.classList.remove("overflow-hidden")
}

// function onDrop(event: DragEvent, shift_date: Date) {

//     console.log('on drop called');

//     console.log(event.dataTransfer?.getData("staffId"))

//     const staff_id = event.dataTransfer?.getData("staffId");

//     addShift(staff_id!, shift_date);

//     console.log(shifts.value)

//     // sets the staff drag to false and removes the border sytling
// //  staffDragEnd()

// }


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



    <!-- week dates and drag and drop  -->

    <section class=" flex  justify-around gap-2 ">
        <div class=" flex w-full flex-col gap-4" v-for="date in weekDates" :key="date.date.toLocaleDateString()">
        <div :class="['flex flex-col items-center justify-center p-4 rounded-lg  ', date.isToday ? 'bg-accent text-primary':' bg-accent/50']">
            <span class=" font-light">{{ date.dayName }}</span>
            <div class=" flex gap-1 font-bold">
                <span>{{ date.dayNumber }}</span>
                <span>{{ date.month }}</span>

            </div>


        </div>
<!--  shift -->


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
 <div    class='  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg border-amber-600'>

<!-- add shift button -->
      <button v-on:click="open_addShift_Modal" class=" flex justify-end">
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
    <div v-if="isaddShift_Modal_Open" class=" flex  justify-center items-center fixed w-screen h-screen bg-background/90  top-0  left-0">

        <div class=" w-[500px] flex flex-col gap-4  p-4 bg-popover border border-ring shadow-card opacity-100 rounded-lg" >
            
            <section class=" space-y-2">
                <!-- modal header -->
                <div class=" flex items-center justify-between">
    
                    <span class=" text-xl text-card-foreground font-semibold">Add New Shift</span>
                   <button v-on:click="close_add_shift_modal()">
    
                       <i class=" pi pi-times"></i>
                   </button> 
                </div>
    
                <div class=" font-light text-muted-foreground" >Schedule a staff member</div>

            </section>


<section >
    <!-- form sections -->
    <form>
        <div class=" space-y-2">
            <div class=" font-semibold">
                Staff Member
    
            </div>
            <div >
                <div class="relative  items-center  w-1/2"> 
                     <div class="border border-border  p-2 rounded-lg  flex justify-between items-center">

                        <span class=" text-muted-foreground font-light text-sm">Select a staff member</span>
                         <i class=" pi pi-angle-down"></i>
                         </div>

                    <div class=" absolute w-full h-[260px] overflow-y-scroll   space-y-2  bg-popover  shadow-2xl rounded-lg ">
                        <div class="hover:bg-accent" v-for="staff in mockStaff" :key="staff.id" >
                            <div class="flex  items-center justify-between p-2 ">
                                <div class=" flex space-x-2 items-center">

                                    <div class=" w-8 h-8 bg-accent text-accent-foreground text-xs rounded-full flex justify-center items-center">{{staff.firstname[0]}}{{ staff.lastName[0] }}</div>
                                    <span>{{ staff.firstname }} {{ staff.lastName[0] }}.</span>
                                </div>
                            

                            <span class=" border  border-border text-muted-foreground text-xs px-2 py-1 rounded-lg">{{ staff.role }}</span>
                            </div>
                
                        </div>
                        
                    </div>
                </div>
    
            </div>
    
        </div>    
    
    </form>

</section>





        </div>

        
    </div>


</div>



</template>