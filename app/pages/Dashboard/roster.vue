<script setup  lang="ts">



definePageMeta({
    layout: 'dashboard-layout'
})

const route = useRoute();
</script>

<template>
<div class=" space-y-6">

    <div class="flex justify-between items-center">
        <!-- headers  -->
        <div>
            <h1 class="text-2xl md:text-4xl font-bold">Roster Management </h1>
        <span class=" text-accent-foreground/60">Manage staff schedules, leave requests, and availability
        </span>
    
        </div>
    
       
    <div class=" ">

   

        <NuxtLink to="/print-roster" class=" border-border  border px-4 py-2 flex justify-center items-center space-x-2 text-card-foreground rounded-lg"> <i class=" pi text-muted-foreground pi-print"></i> <span>Print Roster</span> </NuxtLink>
    </div>
            
  
    </div>


    <!-- main stat cards -->
    <div class=" flex flex-col gap-4 md:flex-row w-full">
  


        <!-- total staff card -->
    <div class="border  rounded-lg w-full shadow   p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between ">
  
  <!-- total stafff -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">Total Staff</span>
 
  
</div>


<div class=" flex flex-col">
<span class=" text-lg md:text-2xl font-bold">6</span>
<span class=" text-muted-foreground font-light text-sm">Active employees</span>
  
</div>
      

  </div>

  <!-- stafficon -->
<div>
    <i class=" pi pi-users text-[120px] text-muted-foregroun d  opacity-5 font-light"></i>
</div>
  


        </div>



        <!-- this week card -->
   <div class="border  rounded-lg w-full shadow   p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between ">
  
  <!-- this weeek -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">This Week</span>
 
  
</div>


<div class=" flex flex-col">
<span class=" text-lg md:text-2xl font-bold">42</span>
<span class=" text-muted-foreground font-light text-sm">Shifts Scheduled</span>
  
</div>
      

  </div>

  <!-- calendar icon -->
<div>
    <i class=" pi pi-calendar text-[120px] text-muted-foregroun d  opacity-5 font-light"></i>
</div>
  


        </div>


        <!-- pending leaves card -->
   <div class="border  rounded-lg w-full shadow   p-6 border-border bg-card text-card-foreground h-[170px] flex items-center justify-between ">
  
  <!-- pendin leave request -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">Pending Leave Requests</span>
 
  
</div>


<div class=" flex flex-col">
<span class=" text-lg md:text-2xl font-bold">12</span>
<span class=" text-muted-foreground font-light text-sm">Requests for leave </span>
  
</div>
      

  </div>

  <!-- stafficon -->
<div>
    <i class=" pi pi-clock text-[120px]    opacity-5 font-light"></i>
</div>
  


        </div>




    </div>




    <!-- nested roster routes links -->

    <div class=" bg-accent py-1 px-2 rounded-lg flex gap-4 items-center  w-[520px]">

        <NuxtLink to="/dashboard/roster/weekly" :class="['px-2  py-2 rounded-lg text-sm', route.path == '/dashboard/roster/weekly' ? 'bg-background': '']">Weekly schedule</NuxtLink>
        <NuxtLink to="/dashboard/roster/ai-optimizer" :class="['px-2  py-2 rounded-lg text-sm', route.path == '/dashboard/roster/ai-optimizer' ? 'bg-background': '']">AI-optimizer</NuxtLink>
        <NuxtLink to="/dashboard/roster/leave-requests" :class="['px-2  py-2 rounded-lg text-sm', route.path == '/dashboard/roster/leave-requests' ? 'bg-background': '']">Leave requests</NuxtLink>
        <NuxtLink to="/dashboard/roster/staff-availability" :class="['px-2  py-2 rounded-lg text-sm', route.path == '/dashboard/roster/staff-availability' ? 'bg-background': '']">Staff Availability</NuxtLink>

    </div>


    <!-- here all the nested roster routes will be rendered -->
    <div>
<NuxtPage/>
    </div>

</div>



 
</template>
