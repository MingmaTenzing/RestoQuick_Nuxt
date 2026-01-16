<script lang="ts" setup>
import Add_Staff_Modal from '~/components/staff_components/Add_Staff_Modal.vue';
import Staff_Card from '~/components/staff_components/Staff_Card.vue';
import { type Staff } from '~/generated/prisma/client';



const { data: staffs } = useFetch<Staff[]>("/api/staff");

const is_add_Staff_Modal = ref(false)

</script>

<template>

<main class=" space-y-6">

    <!-- Header Section -->
    <section class="flex justify-between">
    <div>

     <div class="flex items-center gap-6 text-2xl md:text-6xl">
       <h1 class="">Staff Management</h1>
       <i class="pi pi-user text-muted-foreground"></i>
     </div>
     <span class="text-accent-foreground/60">Manager your team members, roles and availability</span>
    </div>

    <div>
       <button v-on:click="is_add_Staff_Modal = true" class=" bg-accent text-accent-foreground border border-border px-4 py-2 rounded-lg "> + Add Staff </button>
    </div>
</section>
    
    <!-- Stats Cards Grid -->
    <section class="flex flex-col gap-4 md:flex-row md:justify-around w-full md:flex-wrap lg:flex-nowrap">
      <!-- Total Bookings -->
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Staff Count</span>
          <div class="flex flex-col">
            <!-- <span v-if="bookings_loading =='pending'" class=" w-[100px] h-12  bg-muted-foreground/20 animate-pulse rounded-lg"></span> -->
     
            <span  class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ staffs?.length}}</span>
          </div>
        </div>
        <div>
          <i class="pi pi-user text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Bookings</span>
          <div class="flex flex-col">
            <!-- <span v-if="bookings_loading =='pending'" class=" w-[100px] h-12  bg-muted-foreground/20 animate-pulse rounded-lg"></span> -->
     
            <span  class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ 10}}</span>
            <span class="text-muted-foreground font-light text-sm">This month</span>
          </div>
        </div>
        <div>
          <i class="pi pi-calendar text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Staff</span>
          <div class="flex flex-col">
            <!-- <span v-if="bookings_loading =='pending'" class=" w-[100px] h-12  bg-muted-foreground/20 animate-pulse rounded-lg"></span> -->
     
            <span  class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ 10}}</span>
            <span class="text-muted-foreground font-light text-sm">This month</span>
          </div>
        </div>
        <div>
          <i class="pi pi-calendar text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>
      <div class="border rounded-lg   shadow p-6  border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between">
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Bookings</span>
          <div class="flex flex-col">
            <!-- <span v-if="bookings_loading =='pending'" class=" w-[100px] h-12  bg-muted-foreground/20 animate-pulse rounded-lg"></span> -->
     
            <span  class="text-lg md:text-4xl lg:text-5xl  font-medium ">{{ 10}}</span>
            <span class="text-muted-foreground font-light text-sm">This month</span>
          </div>
        </div>
        <div>
          <i class="pi pi-calendar text-[120px] text-muted-foreground opacity-5"></i>
        </div>
      </div>
    
    
    </section>


    <!-- search bar and filter -->
    <section class=" flex justify-between">
      <!-- Search Bar -->
      <div class="relative w-1/3">
        <input 
          type="text" 
          placeholder="Search staff by name or role..." 
          class="w-full px-4 py-2 pl-10 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <i class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
      </div>

      <!-- Filters -->
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <!-- Role Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground min-w-fit">Role:</span>
          <select class="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm">
            <option value="">All Roles</option>
            <option value="manager">Manager</option>
            <option value="chef">Chef</option>
            <option value="waiter">Waiter</option>
            <option value="host">Host</option>
          </select>
        </div>

        <!-- Status Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground min-w-fit">Status:</span>
          <select class="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground min-w-fit">Sort:</span>
          <select class="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm">
            <option value="name">Name (A-Z)</option>
            <option value="recent">Recent</option>
          </select>
        </div>
      </div>
    </section>



    <!-- staff member card -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <!-- Staff Card -->
        <div v-for="staff in staffs" :key="staff.id">
            <Staff_Card :staff="staff"></Staff_Card>

        </div>
  
    </section>
<Transition>

  <Add_Staff_Modal v-if="is_add_Staff_Modal" @close_modal="is_add_Staff_Modal = false"></Add_Staff_Modal>
</Transition>

</main>


</template>