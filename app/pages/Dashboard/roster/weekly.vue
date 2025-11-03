<script lang="ts" setup>
import {mockStaff, type Staff} from "../../../lib/roster-mockdata"
console.log(mockStaff.length)

function startDrag(event: DragEvent, staff: Staff) {
    
    event.dataTransfer?.setData('staffId', staff.id)
   
    

}
</script>



<template>




    <div class="  ">
    <RosterComponentsRosterCalendar  ></RosterComponentsRosterCalendar>
    <div class=" border border-border p-4  rounded-lg flex flex-col space-y-4">

        <span class=" font-semibold">Staff Members</span>
    <span class=" text-sm font-light text-muted-foreground">Drag and Drop staff to schedule shifts</span>
    
        <div class="flex flex-wrap gap-2">
            
            <div v-for="data in mockStaff" draggable="true" @dragstart="startDrag($event, data)">
                
                <RosterComponentsStaffs :staff="data"></RosterComponentsStaffs>
            </div>
        </div>
    </div>
    
</div>

</template>