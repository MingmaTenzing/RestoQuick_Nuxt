

<script setup lang="ts">
import type { LeaveRequestCreateInput, LeaveRequestCreateWithoutStaffInput, LeaveRequestUncheckedCreateInput } from '~/generated/prisma/models';



const toast = useToast()
const leaveRequest_form = ref<LeaveRequestCreateInput>({
  staff: { connect: { id: '' } },
  startDate:new Date().toISOString(),
  endDate: new Date().toISOString(),
  reason: '',
 
});


const reset_copy_leaveRequest_form = ref<LeaveRequestCreateInput>({ staff: { connect: { id: '' } },
  startDate:new Date().toISOString(),
  endDate: new Date().toISOString(),
  reason: '',
})


const loading = ref<boolean>(false);
const submission_error = ref();

async function submit_leave_request() {

  
  loading.value = true
   
  //here the form is parsed cuase the startDate and endDate in the prisma shcema expects for DATETIME type
  // so it required converting to isostring() cause the input type date only gives string of "yyyymmdd"
  const parsedForm = {
    ...leaveRequest_form.value, 
    startDate: new Date(leaveRequest_form.value.startDate).toISOString(),
    endDate: new Date(leaveRequest_form.value.endDate).toISOString()
  }

  
  const { data,error, status } = await useFetch(() => `/api/leave-requests`,
    {
      method: 'post',
      body: parsedForm
    })


  if (data.value) {
    toast.success({title:'Sent Request', message:'your leave request has been sent'})
    leaveRequest_form.value = reset_copy_leaveRequest_form.value
    loading.value =false



 
  }

  if (error.value) {
    error.value.message = submission_error.value
    loading.value = false;
  }


    
   
    
}

</script>
<template>
  <section class=" flex flex-col justify-center items-center h-screen">

    <div class=" w-[340px]">

      
          <h2 class="text-4xl mb-6"> Apply Leave Request </h2>
        
          <form  @submit.prevent="submit_leave_request" class="space-y-6">
            <div>
              <label class="block mb-1   font-light ">Staff</label>
              
              <input requred type="text" class="outline-none hover:border-ring  border rounded-lg px-4 py-2 w-full" placeholder="Staff Id" v-model="leaveRequest_form.staff.connect!.id"></input>
            </div>
        
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block mb-1   font-light ">Start Date</label>
                <input requred type="date" v-model="leaveRequest_form.startDate" class="w-full border border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none" required />
              </div>
              <div class="flex-1">
                <label class="block mb-1   font-light ">End Date</label>
                <input requred type="date" v-model="leaveRequest_form.endDate" class="w-full border hover:border-ring border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none" required />
              </div>
            </div>
        
            <div>
              <label class="block mb-1   font-light ">Reason</label>
              <textarea v-model="leaveRequest_form.reason" class="w-full border outline-none hover:border-ring border-border bg-background text-foreground rounded-lg px-3 py-2 focus:ring-2 focus:ring-ring focus:outline-none" rows="4" required></textarea>
            </div>
        
        
            <div class="flex justify-end gap-2 pt-2">
              <button type="button" v-on:click="leaveRequest_form = reset_copy_leaveRequest_form" class="px-4 py-2 rounded-lg hover:border-ring border border-border bg-muted text-foreground hover:bg-accent" >Cancel</button>
              <button type="submit" class="px-4 py-2 rounded-lg hover:border-ring bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring disabled:opacity-60">
                <span v-if="loading">Submitting...</span>
                <span v-else>Submit</span>
              </button>
            </div>

            <div v-if="submission_error" class="text-destructive mt-2 ">{{ submission_error }}</div> 
          </form>

    </div>

  </section>


</template>

<style>


input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0%);
  opacity: 0.6;
  cursor: pointer;
  z-index: 0;
}

.dark-mode input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(100%);
  opacity: 0.6;
  cursor: pointer;
  z-index: 0;
}</style>

