<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Vapi from '@vapi-ai/web'

const runtimeConfig = useRuntimeConfig()
const publicKey = runtimeConfig.public.VAPI_PUBLIC_KEY
const assistantId = runtimeConfig.public.VAPI_ASSISTANT_KEY

const props = defineProps<{
  variant?: 'full' | 'button-only'
}>()

const isCalling = ref(false)
const isLoading = ref(false)
let vapi: Vapi | null = null

onMounted(() => {
  try {
    vapi = new Vapi(publicKey)

    vapi.on('call-start', () => {
      isCalling.value = true
      isLoading.value = false
    })

    vapi.on('call-end', () => {
      isCalling.value = false
      isLoading.value = false
    })

    vapi.on('message', (_message: unknown) => {})
  } catch (error) {
    console.error('Vapi init error:', error)
  }
})

onBeforeUnmount(async () => {
  if (!vapi || !isCalling.value) return

  try {
    await vapi.stop()
  } catch (error) {
    console.error('cleanup stop error', error)
  }
})

async function startCall() {
  if (!vapi || isCalling.value || isLoading.value) return

  isLoading.value = true

  try {
    await vapi.start(assistantId)
  } catch (error) {
    console.error('startCall error', error)
    isLoading.value = false
  }
}

async function endCall() {
  if (!vapi || !isCalling.value) return

  try {
    await vapi.stop()
  } catch (error) {
    console.error('endCall error', error)
  }
}
</script>

<template>
  <template v-if="variant === 'button-only'">
    <div class="relative flex items-center justify-center min-w-[200px] transition-all duration-300">
      <button
        @click="isCalling ? endCall() : startCall()"
        :disabled="isLoading"
        class="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border px-8 text-sm font-semibold tracking-[0.02em] backdrop-blur-md transition-all duration-300 overflow-hidden shadow-xs"
        :class="[
          isCalling 
            ? 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20 hover:border-destructive/40' 
            : isLoading
              ? 'bg-card/50 text-muted-foreground border-border cursor-not-allowed opacity-70'
              : 'bg-card/50 text-foreground border-border hover:bg-accent/60'
        ]"
      >
        <span v-if="isCalling" class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
        </span>
        <i v-else class="pi" :class="isLoading ? 'pi-spinner pi-spin' : 'pi-microphone'"></i>
        
        <span>{{ isCalling ? 'End Call (Live)' : isLoading ? 'Connecting...' : 'Call Maya (AI)' }}</span>
      </button>
    </div>
  </template>

  <div v-else class="overflow-hidden rounded-4xl border border-border bg-card shadow-sm">
    <div class="relative border-b border-border px-6 py-10 sm:px-8 sm:py-12">
      <div
        aria-hidden="true"
        class="absolute inset-0 bg-[radial-gradient(circle,rgba(24,24,27,0.14)_1.2px,transparent_1.2px)] bg-size-[18px_18px] opacity-80 dark:bg-[radial-gradient(circle,rgba(255,255,255,0.16)_1.2px,transparent_1.2px)]"
      ></div>

      <div class="relative flex flex-col items-center text-center">
        <div class="flex h-28 w-28 items-center justify-center rounded-full border border-green-500/30 bg-background/90 shadow-[0_0_0_14px_rgba(34,197,94,0.08)] backdrop-blur">
          <div class="flex h-20 w-20 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30">
            <i class="pi pi-microphone text-3xl"></i>
          </div>
        </div>

        <p class="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-green-700 dark:text-green-400">
          Voice booking
        </p>
        <h3 class="mt-3 text-2xl font-semibold tracking-[-0.04em] text-card-foreground sm:text-3xl">
          Call Maya and book a table by voice.
        </h3>
        <p class="mt-3 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          Start a live conversation, let Maya collect the reservation details, and see the call status update in real time.
        </p>
      </div>
    </div>

    <div class="bg-background/95 p-6 sm:p-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-semibold text-card-foreground">Maya</p>
          <p class="mt-1 text-sm text-muted-foreground">Call the AI host and make a sample reservation.</p>
        </div>
        <div class="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-semibold text-foreground">
          <span :class="['h-2.5 w-2.5 rounded-full', isCalling ? 'bg-green-500 animate-pulse' : 'bg-muted-foreground/40']"></span>
          {{ isCalling ? 'Live now' : isLoading ? 'Connecting' : 'Ready' }}
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          @click="startCall"
          :disabled="isCalling || isLoading"
          class="inline-flex flex-1 items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="pi pi-phone mr-2"></i>
          {{ isCalling ? 'In Call' : isLoading ? 'Starting...' : 'Call Maya' }}
        </button>
        <button
          @click="endCall"
          :disabled="!isCalling"
          class="inline-flex items-center justify-center rounded-2xl border border-border bg-muted px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          End Call
        </button>
      </div>
    </div>
  </div>
</template>
