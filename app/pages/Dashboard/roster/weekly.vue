<script lang="ts" setup>
import type { Staff } from '~/generated/prisma/client';



const { data: staffs } = await useFetch<Staff[]>("/api/staff");



// the drag is drop feature for it 
//set for future as it's not feasilbe at the momment for the design;
// will come back once it feels it needs it.
const { staffisDragged } = useStaffDrag()


function startDrag(event: DragEvent, data:Staff) {
    
    event.dataTransfer?.setData('staffId', data.id)

    staffisDragged();
    

}
</script>



<template>




    <div class="  ">
    <RosterComponentsRosterCalendar  ></RosterComponentsRosterCalendar>
    <div class=" border border-border p-4  rounded-lg flex flex-col space-y-4">

        <span class=" font-semibold">Staff Members</span>
    <span class=" text-sm font-light text-muted-foreground">Drag and Drop staff to schedule shifts</span>
    
        <div class="flex flex-wrap gap-2">
            
            <div v-for="data in staffs" draggable="true" @dragstart="startDrag($event, data)">
                
                <RosterComponentsStaffs :staff="data"></RosterComponentsStaffs>
            </div>
        </div>
    </div>
    
</div>

</template>