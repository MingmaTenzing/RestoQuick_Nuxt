<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core';
import { ref, computed } from 'vue'
import Order_Item from '~/components/kitchenDisplay_components/Order_Item.vue';
import type{ OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import type websocket_payload from '~~/types/websocket_payload';
import notification_sound from "../../assets/audio/new-notification-022-370046.mp3"

definePageMeta({
    layout: 'dashboard-layout'
})


const toast = useToast()

const all_orders = ref<OrderDetailsWithInclude[]>([]);

const runtime = useRuntimeConfig();

// connection to websocket
const { status, data, send, close } = useWebSocket(`${runtime.public.WEBSOCKET_HOST}/api/websocket`)

//initial data fetch from the database

onMounted(async () => {
    all_orders.value = await $fetch<OrderDetailsWithInclude[]>('/api/orders');

})





watch(data, (newValue: string) => {

    
    let parsed_data: websocket_payload = JSON.parse(newValue)


    if (parsed_data.type == 'ORDER_CREATED') {
        
        
            all_orders.value.push(parsed_data.payload)
             toast.info({
            
                title: 'New Order Received '
             })
        
             //plays the notification sound
            const audio = new Audio(notification_sound);
            audio.play();
         
           
    }

    if (parsed_data.type == 'ORDER_UPDATED') {

       all_orders.value =  all_orders.value.filter((item) => item.id !== parsed_data.payload.id)
        toast.success({
            title:"Order Marked as Ready"
        })

    }




})



</script>


<template>

    <main class=" space-y-6">
       

      
            <!-- header -->
        <section class=" space-y-4">
 <div class=" flex justify-between items-center">
    <div>
        <h2 class="text-2xl md:text-6xl"> Kitchen Display </h2>
        <p class=" text-sm lg:text-base text-muted-foreground">Manage incoming order and preparation status</p>

    </div>

    <!-- websocket status -->
    <div class=" bg-accent rounded-full px-4 py-2">
        

               <div  class="flex items-center space-x-2 "
        v-if="status == 'OPEN'"> 
        
        <div class=" w-4 h-4 rounded-full bg-green-500" />
        <p>Connected</p>
  </div>
             
  
  <div  class="flex items-center space-x-2 "
        v-if="status == 'CONNECTING'"> 
        
        <div class=" w-4 h-4 rounded-full bg-gray-500" />
        <p>Connecting</p>
  </div>
  
  <div  class="flex items-center space-x-2 "
        v-if="status == 'CLOSED'"> 
        
        <div class=" w-4 h-4 rounded-full bg-destructive" />
        <p>Not Connected</p>
  </div>

    
     
    </div>
    

 </div>
            
        </section>



        <!-- orders -->

        <section class=" flex flex-wrap gap-2 ">
          
   <div v-for="order in all_orders" :key="order.id" >

    <Order_Item :order="order"></Order_Item>
   </div>
        </section>

    </main>
</template>