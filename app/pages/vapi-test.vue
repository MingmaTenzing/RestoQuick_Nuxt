<script lang="ts" setup >
import Vapi from '@vapi-ai/web'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const vapi = ref<Vapi | null>(null)
const assistant_id = 'a5801983-f1ae-401f-a06f-7ad5231ec2aa'
const public_key = '326280f7-5532-4764-b83c-04bd4c95008e'
const callStatus = ref<string>('idle')
const errorMessage = ref<string>('')
const isInitialized = ref(false)

onMounted(() => {
  // Prevent duplicate initialization
  if (isInitialized.value || vapi.value) {
    console.warn('VAPI already initialized, skipping...')
    return
  }

  try {
    const vapi_instance = new Vapi(public_key) // public key
    vapi.value = vapi_instance
    isInitialized.value = true

    // Call start event
    vapi_instance.on('call-start', () => {
      console.log('call started')
      callStatus.value = 'active'
      errorMessage.value = ''
    })

    // Call end event
    vapi_instance.on('call-end', () => {
      console.log('call ended')
      callStatus.value = 'idle'
    })

    // Speech start event
    vapi_instance.on('speech-start', () => {
      console.log('speech started')
    })

    // Speech end event
    vapi_instance.on('speech-end', () => {
      console.log('speech ended')
    })


    // Error event - CRITICAL: Handle all errors here
    vapi_instance.on('error', (error: any) => {
      console.error('VAPI Error:', error)
      errorMessage.value = error?.message || 'An unknown error occurred'
      callStatus.value = 'error'
    })

    // Volume level event
    vapi_instance.on('volume-level', (level: number) => {
      console.log('volume level:', level)
    })

  } catch (error) {
    console.error('Failed to initialize VAPI:', error)
    errorMessage.value = 'Failed to initialize VAPI'
  }
})

onBeforeUnmount(() => {
  // Clean up VAPI instance when component is destroyed
  try {
    if (vapi.value) {
      vapi.value.stop()
      vapi.value = null
    }
    isInitialized.value = false
  } catch (error) {
    console.error('Error cleaning up VAPI:', error)
  }
})

const startCall = () => {
  try {
    if (!vapi.value) {
      errorMessage.value = 'VAPI not initialized'
      return
    }
    errorMessage.value = ''
    vapi.value.start(assistant_id)
  } catch (error: any) {
    console.error('Start call error:', error)
    errorMessage.value = error?.message || 'Failed to start call'
  }
}

const endcall = () => {
  try {
    if (!vapi.value) {
      errorMessage.value = 'VAPI not initialized'
      return
    }
    vapi.value.stop()
  } catch (error: any) {
    console.error('End call error:', error)
    errorMessage.value = error?.message || 'Failed to end call'
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4 p-4">
    <!-- Status Display -->
    <div class="p-4 rounded-lg border border-border bg-card">
      <p class="text-sm text-muted-foreground">Call Status: <span class="font-semibold" :class="callStatus === 'active' ? 'text-green-500' : callStatus === 'error' ? 'text-red-500' : 'text-gray-500'">{{ callStatus }}</span></p>
    </div>

    <!-- Error Display -->
    <div v-if="errorMessage" class="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
      <p class="text-sm text-red-500">Error: {{ errorMessage }}</p>
    </div>

    <!-- Button Controls -->
    <div class="flex space-x-4">
      <button 
        @click="startCall" 
        :disabled="callStatus === 'active'"
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-4 rounded-lg border border-border font-semibold transition-colors"
      >
        Start Call with Assistant
      </button>
      <button 
        @click="endcall"
        :disabled="callStatus === 'idle'"
        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-4 rounded-lg border border-border font-semibold transition-colors"
      >
        End Call
      </button>
    </div>
  </div>
</template>