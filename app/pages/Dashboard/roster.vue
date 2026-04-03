<script setup  lang="ts">
definePageMeta({
  layout: 'dashboard-layout'
})

type RosterOverviewStats = {
  totalStaff: number
  weeklyShiftCount: number
  pendingLeaveRequests: number
}

const { startOfWeek, endOfWeek } = useWeekNavigation()

const { data: rosterStats, status: rosterStatsStatus } = await useAsyncData(
  'roster-overview-stats',
  () => $fetch<RosterOverviewStats>('/api/dashboard/stats/roster-overview', {
    query: {
      startDate: startOfWeek.value.toISOString(),
      endDate: endOfWeek.value.toISOString()
    }
  }),
  {
    default: () => ({
      totalStaff: 0,
      weeklyShiftCount: 0,
      pendingLeaveRequests: 0
    }),
    watch: [startOfWeek, endOfWeek]
  }
)

const route = useRoute();
</script>

<template>
<div class=" space-y-6">

    <div class="flex justify-between items-center">
        <!-- headers  -->
        <div>
            <h1 class="text-2xl md:text-6xl">Roster Management </h1>
            <span class=" text-accent-foreground/60">Manage staff schedules, leave requests, and availability</span>
        </div>

        <div class=" flex gap-3">
            <NuxtLink to="/print-roster" class=" border-border  border px-4 py-2 flex justify-center items-center space-x-2 text-card-foreground rounded-3xl">
                <i class=" pi text-muted-foreground pi-print"></i>
                <span>Print Roster</span>
            </NuxtLink>
        </div>
    </div>


    <!-- main stat cards -->
    <div class=" flex flex-col gap-4 md:flex-row w-full">
  


        <!-- total staff card -->
    <div class="border  rounded-3xl w-full shadow   p-6 border-border bg-card text-card-foreground h-42.5 flex items-center justify-between ">
  
  <!-- total stafff -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">Total Staff</span>
 
  
</div>


<div class=" flex flex-col">
<span v-if="rosterStatsStatus === 'pending'" class="h-10 w-16 animate-pulse rounded-2xl bg-muted md:h-12 md:w-20"></span>
<span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ rosterStats?.totalStaff ?? 0 }}</span>
<span class=" text-muted-foreground font-light text-sm">Staff members</span>
  
</div>
      

  </div>

  <!-- stafficon -->
<div>
    <i class=" pi pi-users text-[120px] text-muted-foregroun d  opacity-5 font-light"></i>
</div>
  


        </div>



        <!-- this week card -->
    <div class="border  rounded-3xl w-full shadow   p-6 border-border bg-card text-card-foreground h-42.5 flex items-center justify-between ">
  
  <!-- this weeek -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">This Week</span>
 
  
</div>


<div class=" flex flex-col">
<span v-if="rosterStatsStatus === 'pending'" class="h-10 w-16 animate-pulse rounded-2xl bg-muted md:h-12 md:w-20"></span>
<span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ rosterStats?.weeklyShiftCount ?? 0 }}</span>
<span class=" text-muted-foreground font-light text-sm">Shifts Scheduled</span>
  
</div>
      

  </div>

  <!-- calendar icon -->
<div>
    <i class=" pi pi-calendar text-[120px] text-muted-foregroun d  opacity-5 font-light"></i>
</div>
  


        </div>


        <!-- pending leaves card -->
    <div class="border  rounded-3xl w-full shadow   p-6 border-border bg-card text-card-foreground h-42.5 flex items-center justify-between ">
  
  <!-- pendin leave request -->
        <div class=" flex flex-col justify-between h-full">
      <div class=" ">

  <span class=" font-light">Pending Leave Requests</span>
 
  
</div>


<div class=" flex flex-col">
<span v-if="rosterStatsStatus === 'pending'" class="h-10 w-16 animate-pulse rounded-2xl bg-muted md:h-12 md:w-20"></span>
<span v-else class="text-lg md:text-4xl lg:text-5xl font-medium">{{ rosterStats?.pendingLeaveRequests ?? 0 }}</span>
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

    <div class=" bg-accent py-1 px-2 rounded-3xl flex gap-4 items-center  w-105">

        <NuxtLink to="/dashboard/roster/weekly" :class="['px-2  py-2 rounded-3xl text-sm', route.path == '/dashboard/roster/weekly' ? 'bg-background': '']">Weekly schedule</NuxtLink>
        <NuxtLink to="/dashboard/roster/leave-requests" :class="['px-2  py-2 rounded-3xl text-sm', route.path == '/dashboard/roster/leave-requests' ? 'bg-background': '']">Leave requests</NuxtLink>
        <NuxtLink to="/dashboard/roster/staff-availability" :class="['px-2  py-2 rounded-3xl text-sm', route.path == '/dashboard/roster/staff-availability' ? 'bg-background': '']">Staff Availability</NuxtLink>

    </div>


    <!-- here all the nested roster routes will be rendered -->
    <div>
<NuxtPage/>
    </div>

</div>


 

 
</template>
<style>
</style>
