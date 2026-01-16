

<script lang="ts" setup>



    const emit = defineEmits(['close_modal'])
</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-6">
        <h2 class="text-lg font-semibold">Edit Staff Member</h2>
        <p class="text-sm text-muted-foreground">Update the details of the staff member</p>
      </div>

      <!-- Form -->
      <div class="space-y-6">
        <!-- First & Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">First Name</label>
            <input
              type="text"
              placeholder="First name"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="email@restaurant.com"
            class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <!-- Phone & Hourly Rate -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Phone</label>
            <input
              type="tel"
              placeholder="555-0106"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Hourly Rate ($)</label>
            <input
              type="number"
              placeholder="18"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Role & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Role</label>
            <select class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Select role</option>
              <option>Chef</option>
              <option>Waiter</option>
              <option>Manager</option>
              <option>Host</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Status</label>
            <select class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </div>
        </div>

        <!-- Availability -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Availability</label>
          <div class="flex flex-wrap gap-2">
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Mon</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Tue</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Wed</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80">Thu</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-muted text-muted-foreground hover:bg-muted/80">Fri</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Sat</button>
            <button type="button" class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground">Sun</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-8 pt-6 border-t">
        <button v-on:click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          Cancel
        </button>
        <button class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>

  
    </div>
  </div>
</template>