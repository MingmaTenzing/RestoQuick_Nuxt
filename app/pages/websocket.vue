<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core';
import notification_sound from "../assets/audio/new-notification-022-370046.mp3"
const runtime = useRuntimeConfig();
const { status, data, send, open, close } = useWebSocket(`${runtime.public.WEBSOCKET_HOST}/api/websocket`)

const message = ref('')

const history = ref<string[]>([])





function sendMessage() {
    history.value.push(`client: ${message.value} `)
    send(message.value)
    message.value= ""
}

function playSound() {
    const audio = new Audio(notification_sound)
audio.play();
}

watch(data, (newValue) => {

    
    history.value.push(`server: ${newValue}`)
})




</script>


<template>

    <div>

        <button v-on:click="playSound" class=" border p-2">Play Sound</button>
        
        <h1>Working with websocket</h1>


        <h2>Current status of Websocket is {{ status }}</h2>

        <form @submit.prevent="sendMessage">
            <input v-model="message" class="border outline-none">
            <button type="submit">Send Message</button>
        </form>


        <div>

            <div v-for="message in history" :key="message">
 {{ message }}
            </div>
        </div>
    </div>
</template>