<script lang="ts" setup>

import type { Staff, WeekDay } from '~/generated/prisma/browser';
import Edit_Staff_Modal from './Edit_Staff_Modal.vue';
import Staff_Delete from './Staff_Delete.vue';
import { getStaffInitials } from '~/client_utils/staff_avatar';

const props = defineProps<{ staff: Staff }>()

const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Week mapping
const weekDays = [
  { label: "M", value: "MON" },
  { label: "T", value: "TUE" },
  { label: "W", value: "WED" },
  { label: "T", value: "THU" },
  { label: "F", value: "FRI" },
  { label: "S", value: "SAT" },
  { label: "S", value: "SUN" },
]

const formattedDate = computed(() => {
 return new Date(props.staff.joined_date).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

</script>


<template>

    <div class="bg-card text-card-foreground  flex flex-col gap-6 rounded-3xl border py-6 shadow-sm group relative overflow-hidden border-border">
        <div class="px-6 pt-6">
          <!-- Online Status Indicator -->
          <div class="absolute top-3 right-3">
            <span class="flex h-2.5 w-2.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <!-- Profile Section -->
          <div class="flex flex-col items-center text-center mb-4">
            <NuxtImg v-if="staff.profile_photo_url" :src="staff.profile_photo_url" class="h-20 w-20 rounded-full mb-3 ring-2 ring-background shadow-md object-cover" />
            <div v-else class="h-20 w-20 rounded-full mb-3 ring-2 ring-background shadow-md bg-muted text-muted-foreground flex items-center justify-center text-lg font-semibold">
              {{ getStaffInitials(staff) }}
            </div>
            <h3 class="font-semibold">{{staff.firstname}} {{ staff.lastName }}</h3>
            <span class="inline-flex items-center justify-center rounded-2xl border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{{staff.role}}</span>
          </div>

          <!-- Contact & Info -->
          <div class="space-y-2 text-sm border-t pt-3 mb-3">
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-envelope text-xs"></i>
              <span class="truncate">{{staff.email}}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-phone text-xs"></i>
              <span>{{ staff.phone }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-briefcase
 text-xs"></i>
              <span>{{ staff.employmentType }}</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-clock text-xs"></i>
              <span>${{ staff.perHourRate }}</span>
            </div>
            <!-- <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-dollar text-xs"></i>
              <span>$35/hr</span>
            </div> -->
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-calendar text-xs"></i>
             <span>{{ formattedDate }}</span>
            </div>
          </div>

          <!-- Weekly Availability -->
          <div class="border-t pt-3">
            <p class="text-xs font-medium text-muted-foreground mb-2">Weekly Availability</p>
            <div class="flex gap-1">
    <div
      v-for="day in weekDays"
      :key="day.value"
      class="flex-1 py-1 rounded text-[10px] font-medium text-center transition-colors"
      :class="staff.availability.includes(day.value as WeekDay)
               ? 'bg-emerald-500/15 text-emerald-600'
               : 'bg-muted text-muted-foreground/50'"
    >
      {{ day.label }}
    </div>
  </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 mt-4 pt-3 border-t">
          
            <a :href="`mailto:${staff.email}?subject=Restoquick&body=Hi there from restoquick`" class="flex-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all border rounded-2xl h-8 px-3 bg-transparent hover:bg-accent hover:text-accent-foreground gap-1.5">
              <i class="pi pi-envelope text-xs"></i>
              Email
            </a>
            <button
              @click="showEditModal = true"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all border h-8 w-8 bg-transparent hover:bg-accent hover:text-accent-foreground"
            >
              <i class="pi pi-pencil text-xs"></i>
            </button>
            <button
              type="button"
              @click="showDeleteModal = true"
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all border h-8 w-8 bg-transparent hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
            >
              <i class="pi pi-trash text-xs"></i>
            </button>
          </div>
        </div>

        <Transition>
          <!-- Edit Modal -->
          <Edit_Staff_Modal
            v-if="showEditModal"
            :edit_staff="staff"
            @close_modal="showEditModal = false"
          
          />
        </Transition>

        <Transition>
          <!-- Delete Modal -->
          <Staff_Delete
            v-if="showDeleteModal"
            :staff="staff"
            @close="showDeleteModal = false"
          />
        </Transition>
      </div>
     
</template>