<script lang="ts" setup>
import {mockStaff} from "../../../lib/roster-mockdata"
console.log(mockStaff.length)
</script>



<template>




<div>
    <span>Staff Members</span>
    <div v-for="data in mockStaff">

        <RosterComponentsStaffs :staff="data"></RosterComponentsStaffs>
    </div>

</div>
</template>