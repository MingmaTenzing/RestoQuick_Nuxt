<script lang="ts" setup>
import { ref, computed } from 'vue'


// Fetch leave requests
const { data: leaveRequests } = await useFetch('/api/leave-requests')
console.log(leaveRequests.value)

// Filter state
const filterStatus = ref<'all' | 'pending' | 'approved' | 'rejected'>('all')


// Computed filtered requests


// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'approved':
      return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'rejected':
      return 'bg-red-500/10 text-red-500 border-red-500/20'
    default:
      return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'pi-clock'
    case 'approved':
      return 'pi-check-circle'
    case 'rejected':
      return 'pi-times-circle'
    default:
      return 'pi-question-circle'
  }
}

</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl md:text-4xl font-bold">Leave Requests</h1>
        <span class="text-accent-foreground/60">Manage and approve staff leave requests</span>
      </div>
      <div class="text-sm text-muted-foreground">
        Total: {{ leaveRequests!.length }} request(s)
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2">
    <button  class=" border px-4 py-2 rounded-lg border-border  bg-card hover:bg-accent hover:border hover:border-ring">
        All Requests
    </button>
    <button class=" border px-4 py-2 rounded-lg bg-amber-500/10 hover:border hover:border-amber-500/20 hover:bg-amber-500/20 text-amber-500 border-amber-500/20 ">
       Pending
    </button>
    <button class=" border px-4 py-2 rounded-lg bg-green-500/10 hover:border hover:border-green-500/20 hover:bg-green-500/20 text-green-500 border-green-500/20">
Approved    </button>
    </div>

    <!-- Leave Requests List -->
    <div class="space-y-3">
      <div
        v-for="request in leaveRequests"
        :key="request.id"
        class="border border-border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors"
      >
        <div class=" ">
          <!-- Request Info -->
          <div class=" gap-2 flex flex-col">
            <div class=" flex items-start gap-4">

                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 bg-accent rounded-full flex justify-center items-center">
                   {{request.staff.firstname[0]}}{{ request.staff.lastName[0] }}
                  </div>
                  <div>
                    <h3 class="font-medium">{{ request.staff.firstname }} {{ request.staff.lastName }}</h3>
                  
                  </div>
                </div>
                  <!-- Status Badge -->
              <div :class="['flex items-center gap-2 px-3 py-1 rounded-lg border', getStatusColor(request.status)]">
                <i :class="['pi', getStatusIcon(request.status)]"></i>
                <span class="text-sm font-medium capitalize">{{ request.status }}</span>
              </div>
              
            </div>
             <!--reason  -->
            <div>
  <p class="text-sm text-muted-foreground">Reason: {{ request.reason}}</p>
            </div>

            <!-- Dates -->
            <div class="flex items-center gap-4 mb-2">
              <div class="text-sm">
                <span class="text-muted-foreground">From:</span>
                <span class="font-medium ml-2">{{new Date(request.startDate).toLocaleDateString('en-AU', {
    month: 'short',
    year: 'numeric',
                day:'2-digit'
              }) }}</span>
              </div>
              <div class="text-muted-foreground">→</div>
              <div class="text-sm">
                <span class="text-muted-foreground">To:</span>
                <span class="font-medium ml-2">{{ new Date(request.endDate).toLocaleDateString('en-AU', {
    month: 'short',
    year: 'numeric',
                day:'2-digit'
              }) }}</span>
              </div>
              <div class="text-sm bg-accent px-2 py-1 rounded">
                <span class="text-muted-foreground">Duration:</span>
                <span class="font-medium ml-2">{{ Math.ceil((new Date(request.endDate).getTime() - new Date(request.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 }} day(s)</span>
              </div>
            </div>

            <!-- Submitted Date -->
            <p class="text-xs text-muted-foreground">
              Submitted on {{ new Date(request.submittedAt).toLocaleDateString('en-AU', {
    month: 'short',
    year: 'numeric',
                day:'2-digit'
              }) }}
            </p>
          </div>

        
        </div>

        <!-- Action Buttons (for pending requests) -->
        <div v-if="request.status === 'pending'" class="flex gap-2 mt-4 pt-4 border-t border-border">
          <button class="flex-1 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg border border-green-500/20 transition-colors flex items-center justify-center gap-2">
            <i class="pi pi-check"></i>
            Approve
          </button>
          <button class="flex-1 px-4 py-2 bg-red-500/10 text-destructive hover:bg-red-500/20 rounded-lg border border-red-500/20 transition-colors flex items-center justify-center gap-2">
            <i class="pi pi-times"></i>
            Reject
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <!-- <div v-else class="text-center py-12">
      <i class="pi pi-inbox text-4xl text-muted-foreground mb-4"></i>
      <p class="text-muted-foreground">No {{ filterStatus !== 'all' ? filterStatus : '' }} leave requests found</p>
    </div> -->
  </div>
</template>