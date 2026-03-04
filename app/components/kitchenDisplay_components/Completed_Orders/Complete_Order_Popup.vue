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

// Source list for completed orders shown in this popup.
const completed_orders = ref<OrderDetailsWithInclude[]>([]);

// UI rule: this popup should only show today's completed orders.
const isTodayOrder = (createdAt: string | Date) => {
    const orderDate = new Date(createdAt)
    const today = new Date()
    return orderDate.toDateString() === today.toDateString()
}

const loading = ref(false)
// Realtime channel for keeping completed list synced while popup is open.
const { status, data, send, close } = useWebSocket(`${runtime.public.WEBSOCKET_HOST}/api/websocket`)



onMounted(async () => {
    loading.value = true;

    try {
        // Initial fetch for Completed Orders popup:
        // - Endpoint: /api/orders/completed
        // - Backend already restricts this list to today's completed orders.
        completed_orders.value = await $fetch<OrderDetailsWithInclude[]>("/api/orders/completed")
        
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
    // Keep local list in sync with kitchen/order status changes.
    let parsed_data: websocket_payload = JSON.parse(newValue);

    if (parsed_data.type == "ORDER_MARKED_COMPLETED") {
        // Only add completed orders from today.
        if (!isTodayOrder(parsed_data.payload.createdAt)) {
            return
        }
        const exists = completed_orders.value.some((order) => order.id === parsed_data.payload.id)
        if (!exists) {
            completed_orders.value.unshift(parsed_data.payload)
        }
    }

    if (parsed_data.type == "ORDER_RECALL") {
        // Recalled order is no longer completed.
        completed_orders.value = completed_orders.value.filter((order) => order.id !== parsed_data.payload.id)
       
    }

    if (parsed_data.type == "ORDER_CANCELLED") {
        // Cancelled order should never appear in completed list.
        completed_orders.value = completed_orders.value.filter((order) => order.id !== parsed_data.payload.id)
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

    
          <!-- Completed list from /api/orders/completed + realtime websocket updates -->
  <section v-else class="flex flex-wrap gap-2">

                        <div v-for="order in completed_orders" :key="order.id">
                <Completed_Order_Item  :order="order"></Completed_Order_Item>
            </div>
            
         </section>


  </div>
</template>