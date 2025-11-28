<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import Vapi from '@vapi-ai/web'

const runtimeConfig = useRuntimeConfig()
const public_key = runtimeConfig.public.VAPI_PUBLIC_KEY
const assistant_id = runtimeConfig.public.VAPI_ASSISTANT_KEY

const isCalling = ref(false)
const isLoading = ref(false)
let vapi: Vapi | null = null

onMounted(() => {
  try {
    vapi = new Vapi(public_key)
    
    vapi.on('call-start', () => {
      isCalling.value = true
      console.log('call started')
    })
    
    vapi.on('call-end', () => {
      isCalling.value = false
      console.log('call ended')
    })

    vapi.on('speech-start', () => {
      console.log('speech started')
    })
    
    vapi.on('speech-end', () => {
      console.log('speech end')
    })

    vapi.on('message', (message: string) => {
      console.log('message:', message)
    })
  } catch (e) {
    console.error('Vapi init error:', e)
  }
})

async function startCall() {
  if (!vapi || isCalling.value) return
  isLoading.value = true
  try {
    await vapi.start(assistant_id)
  } catch (e) {
    console.error('startCall error', e)
  } finally {
    isLoading.value = false
  }
}

async function endCall() {
  if (!vapi || !isCalling.value) return
  try {
    await vapi.stop()
  } catch (e) {
    console.error('endCall error', e)
  }
}
</script>


<template>





  
<div class="relative p-[1.5px] rounded-2xl bg-[#0d0d10] text-white overflow-hidden">
    <!-- Animated border -->
    <div
      class="absolute inset-0 rounded-2xl p-[3px]
             bg-[linear-gradient(120deg,#b06cff,#c77dff,#7b5cff,#5b3cff,#b06cff)]
             bg-size-[300%_300%]
             animate-borderMove
             opacity-90
             [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
             mask-exclude"
    ></div>

    <div class="relative z-10">
        <div class="  p-6 flex   gap-6 justify-between w-[800px] items-center     bg-background border border-border rounded-xl ">

    <div class=" w-1/2">
         <div class=" text-2xl font-sme flex items-center gap-2 text-primary">
            <i class=" pi pi-microchip-ai"></i>
            <h2>Voice Assistant</h2>
           </div>
      <p class=" text-muted-foreground text-justify text-sm">
This voice assistant is powered by Vapi AI and helps customers easily book tables using natural voice commands. It streamlines the reservation process by guiding users through availability, guest details, and confirmation. In future updates, the assistant will also support placing takeaway orders, making the entire dining experience faster and more convenient.      </p>
      
    </div>
    <div class=" space-y-4">
      
          <!-- Header -->
         <div class=" flex flex-col items-start gap-2">

          
           <div class=" text-2xl font-sme flex items-center gap-2 ">
            <i class=" pi pi-user"></i>
            <h2>Maya</h2>
           </div>
      
           <div class=" text-muted-foreground">
            <span>Book your Table 24/7</span>
           </div>
         </div>
      
          <!-- Status -->
          <div class="flex items-center space-x-2">
            <div :class="['w-2 h-2 rounded-full', isCalling ? 'bg-green-500 animate-pulse' : 'bg-gray-300']"></div>
            <span class="text-sm text-muted-foreground">{{ isCalling ? 'Call Active' : 'Ready' }}</span>
          </div>
      
          <!-- Buttons -->
          <div class="flex gap-2 w-full">
          
      


      <div class="flex max-w-sm rounded-xl bg-linear-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg">
    <button 
    
     @click="startCall"
              :disabled="isCalling || isLoading" class="flex-1 l bg-background px-6 py-3 rounded-xl">   <i class=" pi pi-phone mr-2"></i>
        <span>

          {{ isCalling ? 'In Call' : isLoading ? 'Starting...' : 'Start Call' }}
        </span> </button>
</div>
            <button
              @click="endCall"
              :disabled="!isCalling"
              class="px-4 py-2 rounded-lg w-[120px] bg-destructive/10 text-destructive hover:bg-destructive/20 disabled:opacity-40 transition-all"
            >
              End
            </button>
          </div>
          

    </div>
  </div>

    </div>
  </div>
</template>




<style scoped>
@keyframes borderMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Animation class */
.animate-borderMove {
  animation: borderMove 6s ease-in-out infinite;
}
</style>
