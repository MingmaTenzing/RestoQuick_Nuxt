

<script setup lang="ts">
import type { LeaveRequestCreateInput, LeaveRequestCreateWithoutStaffInput, LeaveRequestUncheckedCreateInput } from '~/generated/prisma/models';


const { data: staffList } = useFetch("/api/staff");


const leaveRequest_form = ref<LeaveRequestCreateInput>();

function submit_leave_request() {
    
}

</script>
<template>

  <form>
df
    


    
  </form>

</template>

