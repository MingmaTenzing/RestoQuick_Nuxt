<script lang="ts" setup>
import { SortOption } from "~/client_utils/enum";
import Add_Staff_Modal from "~/components/staff_components/Add_Staff_Modal.vue";
import Staff_Card from "~/components/staff_components/Staff_Card.vue";
import Staff_Card_Loading from "~/components/staff_components/Staff_Card_Loading.vue";
import type { Role, Staff } from "~/generated/prisma/client";


const roles = [
  "Chef",
  "Waiter",
  "Bartender",
  "Manager",
  "Cook",
  "Kitchen_Hand",
] as Role[];

const is_add_Staff_Modal = ref(false);
const selected_role = ref<Role | "">("");
const search_staff_name = ref("");

//its either asc | dsc
const sort_by = ref<SortOption>(SortOption.asc);
//search results
const search_results = ref<Staff[]>([]);
//boolean to check if the search results are being shown
const show_search_results = ref(false);
const filtered_staff_data = computed(() => {
  let filtered_staff = staffs.value
    ? selected_role.value
      ? staffs.value.filter((staff) => staff.role === selected_role.value)
      : [...staffs.value]
    : [];

  if (sort_by.value === SortOption.asc) {
    filtered_staff.sort((a, b) => a.firstname.localeCompare(b.firstname));
  } else if (sort_by.value === SortOption.dsc) {
    filtered_staff.sort((a, b) => b.firstname.localeCompare(a.firstname));
  }

  return filtered_staff;
});


//here useAsyncData uses the key 'staffs', which is used to refresh the data in child component'
//the data returned from server is already in sorted in ascending order by name;
const { data: staffs, status: staffs_status } = await useAsyncData("staffs", () =>
  $fetch<Staff[]>("/api/staff"), {
    lazy: true
  }
);  

// Leave requests for "Pending leave requests" stat
const { data: leaveRequests, status: leave_requests_status } = await useAsyncData("staff-leave-requests", () =>
  $fetch<{ id: string; status: string }[]>("/api/leave-requests"),{
    lazy:true
  }
);  

// Staff-related stats computed from existing data
const staffStats = computed(() => {
  const list = staffs.value ?? [];
  const managersCount = list.filter((s) => s.role === "Manager").length;
  const fullTimeCount = list.filter(
    (s) => s.employmentType === "FullTime"
  ).length;  
  const kitchenStaffCount = list.filter((s) =>
    ["Chef", "Cook", "Kitchen_Hand"].includes(s.role)
  ).length;  
  const pendingLeaveCount =
    leaveRequests.value?.filter((r) => r.status === "pending").length ?? 0;
  return {
    total: list.length,
    managers: managersCount,
    fullTime: fullTimeCount,
    kitchenStaff: kitchenStaffCount,
    pendingLeave: pendingLeaveCount,
  };  
});  

// the roles is copied as same as the schema
//however if schema is updated it needs manual updating as well.
async function searchStaff(staff_name: string) {

  try {
    const response = await $fetch<Staff[]>("/api/staff", {
    query: {
      staff_name,
    },
  });
  search_results.value = response;
  } catch (error) {
    window.alert(error);
    
  }
  finally {
    show_search_results.value = true;
  }
}

function clear_search() {
  search_staff_name.value = "",
    show_search_results.value = false,
    search_results.value = [];
    
}

</script>

<template>
  <main class="space-y-6">
    <!-- Header Section -->
    <section class="flex justify-between">
      <div>
        <div class="flex items-center gap-6 text-2xl md:text-6xl">
          <h1 class="">Staff Management</h1>
          <i class="pi pi-user text-muted-foreground"></i>
        </div>
        <p class="text-accent-foreground/60 text-lg mt-2"
          >Manager your team members, roles and availability</p
        >
      </div>

      <div>
        <button
          v-on:click="is_add_Staff_Modal = true"
          class="bg-accent text-accent-foreground border border-border px-4 py-2 rounded-lg"
        >
          + Add Staff
        </button>
      </div>
    </section>

    <!-- Stats Cards Grid -->
    <section
      class="flex flex-col gap-4 md:flex-row md:justify-around w-full md:flex-wrap lg:flex-nowrap"
    >
      <!-- Total Staff -->
      <div
        class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between"
      >
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Total Staff</span>
          <div class="flex flex-col">
            <span
              v-if="staffs_status === 'pending'"
              class="w-24 h-10 md:h-12 lg:h-14 bg-muted rounded-lg animate-pulse"
            ></span>
            <span
              v-else
              class="text-lg md:text-4xl lg:text-5xl font-medium"
              >{{ staffStats.total }}</span
            >
          </div>
        </div>
        <div>
          <i
            class="pi pi-users text-[120px] text-muted-foreground opacity-5"
          ></i>
        </div>
      </div>
      <!-- Managers -->
      <div
        class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between"
      >
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Managers</span>
          <div class="flex flex-col">
            <span
              v-if="staffs_status === 'pending'"
              class="w-20 h-10 md:h-12 lg:h-14 bg-muted rounded-lg animate-pulse"
            ></span>
            <span
              v-else
              class="text-lg md:text-4xl lg:text-5xl font-medium"
              >{{ staffStats.managers }}</span
            >
          </div>
        </div>
        <div>
          <i
            class="pi pi-id-card text-[120px] text-muted-foreground opacity-5"
          ></i>
        </div>
      </div>
      <!-- Full-time Staff -->
      <div
        class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between"
      >
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground">Full-time Staff</span>
          <div class="flex flex-col">
            <span
              v-if="staffs_status === 'pending'"
              class="w-20 h-10 md:h-12 lg:h-14 bg-muted rounded-lg animate-pulse"
            ></span>
            <span
              v-else
              class="text-lg md:text-4xl lg:text-5xl font-medium"
              >{{ staffStats.fullTime }}</span
            >
          </div>
        </div>
        <div>
          <i
            class="pi pi-briefcase text-[120px] text-muted-foreground opacity-5"
          ></i>
        </div>
      </div>
      <!-- Pending Leave Requests -->
      <div
        class="border rounded-lg shadow p-6 border-border w-full bg-card text-card-foreground h-[170px] flex items-center justify-between"
      >
        <div class="flex flex-col justify-between h-full">
          <span class="font-light text-muted-foreground"
            >Pending Leave Requests</span
          >
          <div class="flex flex-col">
            <span
              v-if="leave_requests_status === 'pending'"
              class="w-20 h-10 md:h-12 lg:h-14 bg-muted rounded-lg animate-pulse"
            ></span>
            <span
              v-else
              class="text-lg md:text-4xl lg:text-5xl font-medium"
              >{{ staffStats.pendingLeave }}</span
            >
          </div>
        </div>
        <div>
          <i
            class="pi pi-calendar-times text-[120px] text-muted-foreground opacity-5"
          ></i>
        </div>
      </div>
    </section>

    <!-- search bar and filter -->
    <section class="flex justify-between">
      <!-- Search Bar -->
      <form
        class="border border-border w-[30%] rounded-lg bg-background text-foreground flex items-center justify-between space-x-2 px-4 py-2"
        @submit.prevent="searchStaff(search_staff_name)"
      >
        <input
          v-model="search_staff_name"
          type="text"
          required
          placeholder="Search staff by name" 
          class="outline-none w-full"
        />
        <button type="submit">
          <i v-if="!show_search_results" class="pi pi-search text-muted-foreground"></i>
        </button>
        <button type="button" v-if="show_search_results" v-on:click="clear_search">

          <i  class="pi pi-times text-muted-foreground"></i>
          

        </button>

      </form>

      <!-- Filters -->
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
        <!-- Role Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground min-w-fit"
            >Role:</span
          >
          <div
            class="border border-border px-2 py-2 space-x-2 flex items-center rounded-lg focus:outline-none"
          >
            <select
              v-model="selected_role"
              class="appearance-none outline-none bg-background text-foreground text-sm"
            >
              <option class="" value="">All Roles</option>
              <option v-for="role in roles" :key="role" :value="role">
                {{ role }}
              </option>
            </select>
            <i class="pi pi-angle-down"></i>
          </div>
        </div>

        <!-- Sort Dropdown -->
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-muted-foreground min-w-fit"
            >Sort by Name:</span
          >
          <select
            v-model="sort_by"
            class="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
          >
            <option :value="SortOption.asc">(A-Z)</option>
            <option :value="SortOption.dsc">(Z-A)</option>
          </select>
        </div>
      </div>
    </section>



    <!-- staff member card -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Staff Card -->

      <div v-if="staffs_status === 'pending'" v-for="number in 10" :key="number">
        

        <Staff_Card_Loading></Staff_Card_Loading>
      </div>


      <div v-if="show_search_results " v-for="staff in search_results" :key="staff.id">
        <Staff_Card :staff="staff"></Staff_Card>
      </div>
      <div v-if="!show_search_results" v-for="staff in filtered_staff_data" :key="staff.id">
        <Staff_Card :staff="staff"></Staff_Card>
      </div>
    </section>

    <!-- add staff modal -->
    <Transition>
      <Add_Staff_Modal
        v-if="is_add_Staff_Modal"
        @close_modal="is_add_Staff_Modal = false"
      ></Add_Staff_Modal>
    </Transition>
  </main>
</template>
