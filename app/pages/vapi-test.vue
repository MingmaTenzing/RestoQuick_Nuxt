<script lang="ts" setup >
import Vapi from '@vapi-ai/web'



const runtimeConfig = useRuntimeConfig();

const public_key = runtimeConfig.public.VAPI_PUBLIC_KEY;
const assistant_id = runtimeConfig.public.VAPI_ASSISTANT_KEY;

const vapi = ref();
const isConnected = ref<boolean>(false)
const isSpeaking = ref<boolean>(false)
const transcript = ref([]);


  const vapiInstance = new Vapi(public_key);

  vapi.value = vapiInstance;
  console.log(vapi.value)


  
  vapi.value.on('call-start', () => {
    console.log('call started')
  })
  
  vapi.value.on('call-end', () => {
    console.log('call ended')
  })
  vapi.value.on('speech-start', () => {
    console.log('speech started')
  })
  
  vapi.value.on('speech-end', () => {
    console.log('speech end')
  }
  )
  vapi.value.on('message', (message: string) => {
    console.log(message)
  })





 async function startCall() {
   
   
     await vapi.value.start(
   'a5801983-f1ae-401f-a06f-7ad5231ec2aa'
    )
      
  
}

function endCall() {

  vapi.value!.stop();
}
</script>

<template>


  <div class="flex flex-col space-y-4 p-4">
    <!-- Status Display -->
    <!-- <div class="p-4 rounded-lg border border-border bg-card">
      <p class="text-sm text-muted-foreground">Call Status: <span class="font-semibold" :class="callStatus === 'active' ? 'text-green-500' : callStatus === 'error' ? 'text-red-500' : 'text-gray-500'">{{ callStatus }}</span></p>
    </div> -->

    <!-- Error Display -->
    <!-- <div v-if="errorMessage" class="p-4 rounded-lg border border-red-500/20 bg-red-500/10">
      <p class="text-sm text-red-500">Error: {{ errorMessage }}</p>
    </div> -->

    <!-- Button Controls -->
    <div class="flex space-x-4">
      <button 
        @click="startCall" 
       
        class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-4 rounded-lg border border-border font-semibold transition-colors"
      >
        Start Call with Assistant
      </button>
      <button 
        @click="endCall"
      
        class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white p-4 rounded-lg border border-border font-semibold transition-colors"
      >
        End Call
      </button>
    
      
    </div>
  </div>

  
  
</template>