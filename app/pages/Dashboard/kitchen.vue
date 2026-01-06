<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core';
import { ref, computed } from 'vue'
import Order_Item from '~/components/kitchenDisplay_components/Order_Item.vue';
import type{ OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import type websocket_payload from '~~/types/websocket_payload';
import notification_sound from "../../assets/audio/new-notification-022-370046.mp3"
import Complete_Order_Popup from '~/components/kitchenDisplay_components/Completed_Orders/Complete_Order_Popup.vue';
import Loading_Order_Item from '~/components/kitchenDisplay_components/Loading_Order_Item.vue';

definePageMeta({
    layout: 'dashboard-layout'
})


const toast = useToast()

const all_orders = ref<OrderDetailsWithInclude[]>([]);

const loading_orders = ref(false)

const runtime = useRuntimeConfig();

const completed_orders_modal = ref(true)

const { modal_state, open_completed_orders_modal} = useCompleted_Order_Modal()

// connection to websocket
const { status, data, send, close } = useWebSocket(`${runtime.public.WEBSOCKET_HOST}/api/websocket`)



//initial data fetch from the database

onMounted(async () => {
    loading_orders.value = true
    all_orders.value = await $fetch<OrderDetailsWithInclude[]>('/api/orders/pending');
    loading_orders.value = false

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

<!-- comleted order button and weboscket status -->
    <div  class="flex space-x-2">
    <div>
        <button @click="open_completed_orders_modal" class="bg-green-500/20 text-green-500 px-4 py-2 rounded-lg"> Completed Orders</button>
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

 </div>
            
        </section>



        <!-- skeleton loading orders -->

        <section v-if="loading_orders" class=" flex flex-wrap gap-2"> 
         
        <div v-for="i in 10" :key="i">
            <Loading_Order_Item></Loading_Order_Item>

        </div>

        </section>

       

        <!-- once order's loaded -->
        <section v-else class=" flex flex-wrap gap-2 ">

          
   <div  v-for="order in all_orders" :key="order.id" >

    <Order_Item :order="order"></Order_Item>
   </div>
        </section>


        <!-- popup for completed orders to callback -->

      <div v-if="modal_state == true" class="fixed z-50 inset-0 flex items-center justify-center bg-background/80">
 <Complete_Order_Popup></Complete_Order_Popup>
  </div>

    </main>
</template>