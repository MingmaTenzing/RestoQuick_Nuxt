<script lang="ts" setup>

import { inject } from 'vue';
import type { Shift, Staff } from '~/generated/prisma/client';
import type { Shift_With_Staff_Payload } from '~~/types/shift_include_staff';

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

       

     
       <div class=" flex flex-col bg-accent p-2 rounded-lg w-full border hover:border-dashed hover:border-ring">
        <div v-if="!isPrintRosterPage" v-on:click="open_edit_shiftModal(shift)"  class="cursor-pointer flex justify-end   text-muted-foreground hover:text-primary">
            <i class=" pi pi-pencil"></i>
           
        </div>
        <div class="flex justify-between items-end ">
<div :class="['flex', isPrintRosterPage ? 'flex-row items-center gap-2' : 'flex-col space-y-2']">

    <NuxtImg :src="shift.staff?.profile_photo_url"  class=" w-10 h-10 object-cover rounded-full" ></NuxtImg>
  <div class="flex flex-col">
      <span class=" text-xs xl:text-base font-medium">{{ shift.staff?.firstname }} {{ shift.staff?.lastName[0] }}.</span>
  
         <span class="text-[10px] lg:text-sm">{{shift?.startTime}} - {{shift?.endTime}}</span>
         <span class="text-[10px] lg:text-xs font-light text-muted-foreground">{{ shift.position }}</span>
       

  </div>

</div>
               
               <div v-if="!isPrintRosterPage" v-on:click="deleteShift()">
                 <i class=" pi pi-trash    text-muted-foreground hover:text-destructive cursor-pointer"></i>
               </div>
        </div>
      
       

           
           
        </div>
    </div>

   

</template>