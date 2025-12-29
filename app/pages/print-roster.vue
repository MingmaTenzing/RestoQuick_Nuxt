<script lang="ts" setup>

definePageMeta( {
    colorMode: 'light'
}
)
import type { Shift } from '~/generated/prisma/client';

const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();



const { data: shifts } = await useFetch<Shift[]>("/api/shift" )


</script>




<template> 

<div class=" p-4 " >
    <div class=" flex justify-between items-center w-full my-4">

        <span class=" text-2xl font-semibold">Roster for {{ weekRangeText }}</span>

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



        <!-- shifts of the day container-->
 <div    class='  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg hover:border-ring'>



   <!-- staff shift time and name -->

        <div   v-for="shift in shifts?.filter((shift) =>new Date(shift.date).toISOString().split('T')[0] ===
      new Date(date.date).toISOString().split('T')[0])" :key="shift.id">


            <roster-components-staff-shift :shift="shift"></roster-components-staff-shift>
            </div>

    </div>

    </div>


    </section>   
    
    


</div>



</template>

<style>



</style>