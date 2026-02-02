<script lang="ts" setup>

import { inject } from 'vue';
import type { Shift, Staff } from '~/generated/prisma/client';

const props = defineProps<{ shift: Shift}>()

const toast = useToast()

//route to check is it's in print-roster route
//if yes hide the edit and delete button
const route = useRoute()


const {editshiftModal, open_edit_shiftModal,close_edit_shiftModal } = useeditShiftModal()

// Inject the refetch trigger function from parent roster_calendar
const triggerShiftRefetch = inject<() => void>('triggerShiftRefetch', () => {})

const { data: staff } = await useFetch<Staff>(() => `/api/staff/${props.shift.staffId}`) 



async function deleteShift() {
    const { data: deleted_Staff ,status,error  } = await useFetch(() => `/api/shift/${props.shift.id}`, {
        method:'delete'
    })

    if (deleted_Staff.value && status.value === "success") {
        
        toast.success({title:"Success", message:"Shift Deleted"})
        // Trigger refetch in parent component
        triggerShiftRefetch()

    }
    else if (error) {
        toast.error({title:error.value?.name, message:error.value?.message})
    }

    
}
    


</script>

<template>

<div>

       

     
       <div class=" flex flex-col bg-accent p-2 rounded-lg w-full border hover:border-dashed hover:border-ring">
        <div v-if="route.path !== '/print-roster'" v-on:click="open_edit_shiftModal(shift.id)"  class="cursor-pointer flex justify-end   text-muted-foreground hover:text-primary">
            <i class=" pi pi-pencil"></i>
           
        </div>
        <div class="flex justify-between items-end ">
<div class="  space-y-2">

    <NuxtImg :src="staff?.profile_photo_url"  class=" w-10 h-10 object-cover rounded-full" ></NuxtImg>
  <div class=" flex flex-col">
      <span class=" text-xs xl:text-base font-medium">{{ staff?.firstname }} {{ staff?.lastName[0] }}.</span>
  
         <span class="text-[10px] lg:text-sm">{{shift?.startTime}} - {{shift?.endTime}}</span>
         <span class="text-[10px] lg:text-xs font-light text-muted-foreground">{{ shift.position }}</span>
       

  </div>

</div>
               
               <div v-if="route.path !== '/print-roster'" v-on:click="deleteShift()">
                 <i class=" pi pi-trash    text-muted-foreground hover:text-destructive cursor-pointer"></i>
               </div>
        </div>
      
       

           
           
        </div>
    </div>

   

</template>