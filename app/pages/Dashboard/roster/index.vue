

<script lang="ts" setup>


definePageMeta({
    layout: 'dashboard-layout'
})
</script>


<template>


 <div>

    <div class="flex justify-between items-center">
        <!-- headers  -->
        <div>
            <h1 class="text-2xl md:text-4xl font-bold">Roster Management </h1>
        <span class=" text-accent-foreground/60">Manage staff schedules, leave requests, and availability
        </span>
    
        </div>
    
       
    <div class=" ">

   

        <button class=" border-border  border px-4 py-2 flex justify-center items-center space-x-2 text-card-foreground rounded-lg"> <i class=" pi text-muted-foreground pi-print"></i> <span>Print Roster</span> </button>
    </div>
            
  
    </div>


    <!-- main stat cards -->
    <div class=" flex flex-col gap-4 md:flex-row w-full">
  


        <!-- total staff card -->
    <div class="border rounded-lg shadow w-full p-6 border-border bg-card text-card-foreground h-[170px] flex flex-col justify-between">
 <div class=" flex justify-between">

    <span class=" font-light">Total Staff</span>
    <i class=" pi text-muted-foreground pi-users"></i>


    
 </div>
 

 <div class=" flex flex-col">
  <span class=" text-lg md:text-2xl font-bold">6</span>
  <span class=" text-muted-foreground font-light text-sm">Active employees</span>
    
 </div>
        


        </div>



        <!-- this week card -->
    <div class="border rounded-lg shadow w-full p-6 border-border bg-card text-card-foreground h-[170px] flex flex-col justify-between">
 <div class=" flex justify-between">

    <span class=" font-light">This Week</span>
    <i class=" pi text-muted-foreground pi-calendar"></i>


    
 </div>
 

 <div class=" flex flex-col">
  <span class=" text-lg md:text-2xl font-bold">42</span>
  <span class=" text-muted-foreground font-light text-sm">Total Shifts Scheduled</span>
    
 </div>
        


        </div>


        <!-- pending leaves card -->
    <div class="border rounded-lg shadow w-full p-6 border-border bg-card text-card-foreground h-[170px] flex flex-col justify-between">
 <div class=" flex justify-between">

    <span class=" font-light">Pending Leave Requests</span>
    <i class=" pi text-muted-foreground pi-clock"></i>


    
 </div>
 

 <div class=" flex flex-col">
  <span class=" text-lg md:text-2xl font-bold">6</span>
  <span class=" text-muted-foreground font-light text-sm">Active employees</span>
    
 </div>
        


        </div>




     <div>

     </div>
    </div>



</div>
</template>