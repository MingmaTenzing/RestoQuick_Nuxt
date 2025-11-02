<script lang="ts" setup>
const {
    weekDates,
    weekRangeText,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();



console.log(weekDates.value, weekRangeText.value, nextWeek, previousWeek, goToCurrentWeek)

console.log(weekDates.value[0]?.date.toLocaleString())
</script>




<template> 

<div>
    <div class=" flex justify-between items-center">

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

    <section class=" flex w-full gap-4">
        <div class="w-[200px] flex flex-col gap-4" v-for="date in weekDates" :key="date.date.toLocaleDateString()">
        <div :class="['flex flex-col items-center justify-center p-4 rounded-lg  ', date.isToday ? 'bg-accent text-primary':' bg-accent/50']">
            <span>{{ date.dayName }}</span>
            <span>{{ date.dayNumber }}</span>


        </div>
<!-- moring shift -->

        <div class=" min-h-[120px] border-2 border-dashed rounded-lg">

        </div>
    

        <!-- evening shift -->
<div class=" min-h-[120px] border-2 border-dashed rounded-lg">

    
</div>

    </div>


    </section>    


</div>



</template>