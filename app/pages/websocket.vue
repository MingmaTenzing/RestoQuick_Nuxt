<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core';


const { status, data, send, open, close } = useWebSocket(`ws://localhost:3000/api/websocket`)


const message = ref('')

const history = ref<string[]>([])


function sendMessage() {
    history.value.push(`client: ${message.value} `)
    send(message.value)
    message.value= ""
}

watch(data, (newValue) => {

    
    history.value.push(`server: ${newValue}`)
})


</script>


<template>

    <div>
        
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