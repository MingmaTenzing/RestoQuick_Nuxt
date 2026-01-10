<script lang="ts" setup>
import { type OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import Completed_Order_Item from './Completed_Order_Item.vue';
import Loading_Order_Item from '../Loading_Order_Item.vue';
import { useWebSocket } from '@vueuse/core';
import type { NuxtError } from '#app';
import type websocket_payload from '~~/types/websocket_payload';


const runtime = useRuntimeConfig()
const { close_completed_orders_modal } = useCompleted_Order_Modal()

const toast = useToast();

const completed_orders = ref<OrderDetailsWithInclude[]>();

const loading = ref(false)
// connection to websocket
const { status, data, send, close } = useWebSocket(`${runtime.public.WEBSOCKET_HOST}/api/websocket`)



onMounted(async () => {
    loading.value = true;

    try {
        completed_orders.value = await $fetch<OrderDetailsWithInclude[]>("/api/orders/ready")
        
    } catch (error: unknown) {
        if (isNuxtError(error)) {
            toast.error({
                message: error.message
            });
        }
       console.log(error)
        
    }
    finally {
        loading.value = false
    }

    

})

watch(data, (newValue) => {
    let parsed_data: websocket_payload = JSON.parse(newValue);

    if (parsed_data.type == "ORDER_RECALL") {
        completed_orders.value = completed_orders.value?.filter((order) => order.id !== parsed_data.payload.id)
       
    }

})




</script>

<template>

      <div class=" bg-card  w-[90%]  h-[80%] overflow-y-scroll p-6 rounded-lg border shadow-2xl space-y-6">
     
     <!-- header -->
        <section class=" flex justify-between items-center">
    <div class=" space-y-2">

        <h2 class="text-3xl ">Completed Orders</h2>
        <p class=" font-light text-sm text-accbg-accent-foreground">View all completed orders and recall if needed </p>
    </div>

    <div class=" flex space-x-2 items-center ">
        
    <!-- websocket status -->
    <div class=" bg-accent rounded-full px-3 py-2 flex justify-center items-center">
        

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
    <button v-on:click="close_completed_orders_modal"  class=" text-destructive bg-destructive/20 px-4 py-2 rounded-lg">
      Close
    </button>
    </div>

</section>


<!-- loading orders -->
   <section v-if="loading" class="flex flex-wrap gap-2">
    <div v-for="i in 10" :key="i">
        <Loading_Order_Item></Loading_Order_Item>
    </div>

   </section>

    
        <!-- completed_orders -->
  <section v-else class="flex flex-wrap gap-2">

            <div v-for="order in completed_orders" :key="order.id">
                <Completed_Order_Item  :order="order"></Completed_Order_Item>
            </div>
            
         </section>


  </div>
</template>