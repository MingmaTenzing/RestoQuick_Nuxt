<script lang="ts" setup>
import {mockStaff} from "../../../lib/roster-mockdata"
console.log(mockStaff.length)
</script>



<template>




<div>
    <span>Staff Members</span>
    <div class=" space-y-2">

        <div v-for="data in mockStaff" >
    
            <RosterComponentsStaffs :staff="data"></RosterComponentsStaffs>
        </div>
    </div>
    
</div>
<RosterComponentsRosterCalendar></RosterComponentsRosterCalendar>
</template>