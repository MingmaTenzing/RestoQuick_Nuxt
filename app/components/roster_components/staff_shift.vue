<script lang="ts" setup>

import { inject } from 'vue';
import type { Shift, Staff } from '~/generated/prisma/client';
import type { Shift_With_Staff_Payload } from '~~/types/shift_include_staff';
import { getStaffInitials } from '~/client_utils/staff_avatar';

const props = defineProps<{ shift: Shift_With_Staff_Payload}>()

const toast = useToast()

//route to check is it's in print-roster route
//if yes hide the edit and delete button
const route = useRoute()
const isPrintRosterPage = computed(() => route.path === '/print-roster')

const emit = defineEmits<{
  // <eventName>: <expected arguments>
  deleteShift: [value: string] // named tuple syntax
}>()

const {editshiftModal, open_edit_shiftModal,close_edit_shiftModal } = useeditShiftModal()

function deleteShift() {
  emit("deleteShift", props.shift.id)
}


    


</script>

<template>

<div>

       

     
       <div class=" flex flex-col bg-accent p-2 rounded-2xl w-full border hover:border-dashed hover:border-ring">
        <div
          v-if="!isPrintRosterPage"
          v-on:click="open_edit_shiftModal(shift)"
          class="flex justify-end"
        >
          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
          >
            <i class="pi pi-pencil text-xs"></i>
          </button>
           
        </div>
        <div class="flex justify-between items-end ">
<div :class="['flex', isPrintRosterPage ? 'flex-row items-center gap-2' : 'flex-col space-y-2']">

    <NuxtImg v-if="shift.staff?.profile_photo_url" :src="shift.staff?.profile_photo_url"  class=" w-8 h-8 object-cover rounded-full" ></NuxtImg>
    <div v-else class="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-semibold">
      {{ getStaffInitials(shift.staff) }}
    </div>
  <div class="flex flex-col">
      <span class=" text-xs xl:text-base font-medium">{{ shift.staff?.firstname }} {{ shift.staff?.lastName[0] }}.</span>
  
         <span class="text-xs">{{shift?.startTime}} - {{shift?.endTime}}</span>
         <span class="text-[10px] lg:text-xs font-light text-muted-foreground">{{ shift.position }}</span>
       

  </div>

</div>
               
               <div v-if="!isPrintRosterPage" v-on:click="deleteShift()">
                 <button
                   type="button"
                   class="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                 >
                   <i class="pi pi-trash text-xs"></i>
                 </button>
               </div>
        </div>
      
       

           
           
        </div>
    </div>

   

</template>