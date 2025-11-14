<script lang="ts" setup>
import type { Shift, Staff } from '~/generated/prisma/client';


const props = defineProps<{ shift: Shift}>()


const {data:staff} = await useFetch(() => `/api/staff/${props.shift.staffId}`)


</script>

<template>

<div>

       

     
       <div class=" flex flex-col bg-accent p-2 rounded-lg w-full border hover:border-dashed hover:border-ring">
        <div class=" flex justify-end text-xs hover:text-amber-500">
            <i class=" pi pi-pencil"></i>
        </div>
        <span class=" text-xs xl:text-base font-medium">{{ staff?.firstname }} {{ staff?.lastName[0] }}.</span>
   
           <span class="text-[10px] lg:text-sm">{{shift?.startTime}} - {{shift?.endTime}}</span>
           <span class="text-[10px] lg:text-xs font-light text-muted-foreground">{{ shift.position }}</span>
           <!-- <span class="text-xs">9:00 - 10:00</span> -->
       
 
   </div>
</div>

<!-- 
<div class=" rounded-lg hover:border-ring text-sm border border-border bg-card  p-2 gap-2 items-center">
    <div class=" flex justify-end text-sm">
        <i class="pi pi-pencil"></i>
    </div>
                        <div class=" w-10 h-10 bg-accent rounded-full flex justify-center items-center uppercase">{{ staff?.name[0] }}{{ staff?.name[1] }}</div>
<div class=" flex flex-col">
    
    <span>{{ staff?.name }}</span>
    <div>
        <span>{{ shift?.startTime}}</span>
        <span>-</span>
        <span>{{ shift?.endTime }}</span>
    </div>


</div>

</div> -->


</template>