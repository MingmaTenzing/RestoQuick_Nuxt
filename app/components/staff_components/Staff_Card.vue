<script lang="ts" setup>
import type { Staff, WeekDay } from '~/generated/prisma/client';



const props = defineProps<{ staff: Staff }>()

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

</script>


<template>

    <div class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm group relative overflow-hidden border-border">
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
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/male-restaurant-manager-professional-headshot-KxLGqv1Sz4lzQ24KMNzzXLk4u89AEt.jpg" alt="David Martinez" class="h-20 w-20 rounded-full mb-3 ring-2 ring-background shadow-md object-cover" />
            <h3 class="font-semibold">{{staff.firstname}} {{ staff.lastName }}</h3>
            <span class="inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap mt-1 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">{{staff.role}}</span>
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
              <i class="pi pi-dollar text-xs"></i>
              <span>$35/hr</span>
            </div>
            <div class="flex items-center gap-2 text-muted-foreground">
              <i class="pi pi-calendar text-xs"></i>
              <span>{{staff.joined_date.toString()}}</span>
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
            <button class="flex-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all border rounded-md h-8 px-3 bg-transparent hover:bg-accent hover:text-accent-foreground gap-1.5">
              <i class="pi pi-phone text-xs"></i>
              Call
            </button>
            <button class="flex-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all border rounded-md h-8 px-3 bg-transparent hover:bg-accent hover:text-accent-foreground gap-1.5">
              <i class="pi pi-envelope text-xs"></i>
              Email
            </button>
            <button class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all border h-8 w-8 bg-transparent hover:bg-accent hover:text-accent-foreground">
              <i class="pi pi-ellipsis-h text-xs"></i>
            </button>
          </div>
        </div>
      </div>
     
</template>