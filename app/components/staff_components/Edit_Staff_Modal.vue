

<script lang="ts" setup>
import { ref, onMounted } from 'vue'

interface Staff {
  id: string
  firstname: string
  lastName: string
  email: string
  phone: string
  role: string
  availability: string[]
  profile_photo_url: string
  joined_date: string
}

const props = defineProps({
  staffId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close_modal', 'save'])

const form = ref({
  firstname: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  availability: [],
  profile_photo_url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/male-restaurant-manager-professional-headshot-KxLGqv1Sz4lzQ24KMNzzXLk4u89AEt.jpg'
})

const roles = ['Chef', 'Waiter', 'Bartender', 'Manager', 'Cook', 'Kitchen_Hand']
const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const loading = ref(false)
const error = ref('')

// Fetch staff data
const fetchStaffData = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`/api/staff/${props.staffId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch staff data')
    }
    const data: Staff = await response.json()
    
    // Populate form with fetched data
    form.value = {
      firstname: data.firstname,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      availability: data.availability || [],
      profile_photo_url: data.profile_photo_url
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error fetching staff data'
    console.error('Fetch error:', err)
  } finally {
    loading.value = false
  }
}

// Save changes
const handleSave = async () => {
  try {
    const response = await fetch(`/api/staff/${props.staffId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form.value)
    })
    
    if (!response.ok) {
      throw new Error('Failed to save staff data')
    }
    
    const data = await response.json()
    emit('save', data)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error saving staff data'
    console.error('Save error:', err)
  }
}

// Fetch data when component mounts
onMounted(() => {
  fetchStaffData()
})
</script>
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
    <div class="bg-background rounded-lg border p-6 shadow-lg w-full max-w-lg">
      <!-- Header -->
      <div class="flex flex-col gap-2 mb-6">
        <h2 class="text-lg font-semibold">Edit Staff Member</h2>
        <p class="text-sm text-muted-foreground">Update the details of the staff member</p>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
        {{ error }}
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <p class="text-muted-foreground">Loading staff data...</p>
      </div>

      <!-- Form -->
      <div v-if="!loading" class="space-y-6">
        <!-- First & Last Name -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">First Name</label>
            <input
              v-model="form.firstname"
              type="text"
              placeholder="First name"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Last Name</label>
            <input
              v-model="form.lastName"
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
            v-model="form.email"
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
              v-model="form.phone"
              type="tel"
              placeholder="555-0106"
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Profile Photo URL</label>
            <input
              v-model="form.profile_photo_url"
              type="text"
              placeholder="https://..."
              class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <!-- Role & Status -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Role</label>
            <select v-model="form.role" class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="">Select role</option>
              <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
        </div>

        <!-- Availability -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Availability</label>
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="day in weekDays"
              :key="day"
              type="button"
              @click="form.availability.includes(day) ? form.availability.splice(form.availability.indexOf(day), 1) : form.availability.push(day)"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              :class="form.availability.includes(day) 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'"
            >
              {{ day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-8 pt-6 border-t">
        <button @click="emit('close_modal')" class="px-4 py-2 rounded-md border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          Cancel
        </button>
        <button @click="handleSave" :disabled="loading" class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          Save Changes
        </button>
      </div>

  
    </div>
  </div>
</template>