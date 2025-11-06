<script lang="ts" setup>

import type { Staff } from '~/lib/roster-mockdata'

const props = defineProps<{ staff: Staff }>()

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']


const isAvailable = (day: string) => props.staff.availability.includes(day)




</script>

<template>

    <div >
        
        <div class=" w-[320px] border border-border hover:border-amber-600 bg-card text-card-foreground  p-4 rounded-lg">
<div class=" flex justify-end">
    <i class=" pi pi-ellipsis-v">

    </i>

</div>

            <div class="  gap-4 flex flex-col items-center justify-center">
                    <div class=" w-10 h-10 bg-accent rounded-full flex justify-center items-center">{{staff.firstname[0]}} {{ staff.lastName[0] }}</div>
                
                <div class="space-y-2 flex flex-col items-center">

                    <div>{{staff.firstname}} {{ staff.lastName }}</div>
                    <div class=" rounded-lg border border-border bg-secondary  text-card-foreground px-4 text-sm  w-fit  ">
                        <span class=" w-auto">{{ staff.role }}</span>
                    </div>
                </div>
                <div class="flex gap-">

                 <div v-for="day in weekDays" :key="day">

                     <span :class="['bg-card text-xs border px-2 py-1 rounded-full', isAvailable(day) ? 'bg-green-500 text-green-200':'bg-muted text-muted-foreground']">
                         {{ day }}
                     </span>

                 </div>
                </div>
            </div>

        </div>
    </div>

    </template>