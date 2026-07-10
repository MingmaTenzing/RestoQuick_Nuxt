<script lang="ts" setup>
import { type OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import Completed_Order_Item from './Completed_Order_Item.vue';
import Loading_Order_Item from '../Loading_Order_Item.vue';
import type { NuxtError } from '#app';

const emit = defineEmits<{
  'order-recalled': [order: OrderDetailsWithInclude]
}>()

const { close_completed_orders_modal } = useCompleted_Order_Modal()

const toast = useToast();

// Source list for completed orders shown in this popup.
const completed_orders = ref<OrderDetailsWithInclude[]>([]);

// UI rule: this popup should only show completed orders from the last 24 hours.
const isOrderWithinLast24Hours = (createdAt: string | Date) => {
    const orderTime = new Date(createdAt).getTime()
    const now = Date.now()
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000
    return now - orderTime <= twentyFourHoursInMs
}

const loading = ref(false)

function removeCompletedOrder(orderId: string) {
  completed_orders.value = completed_orders.value.filter((order) => order.id !== orderId)
}

function addCompletedOrder(order: OrderDetailsWithInclude) {
  if (!isOrderWithinLast24Hours(order.createdAt)) return
  if (completed_orders.value.some((existing) => existing.id === order.id)) return
  completed_orders.value.unshift(order)
}

const { status } = useKitchenWebSocket((event) => {
  applyKitchenOrderEvent(event, {
    onCompleted: (order) => addCompletedOrder(order),
    onRecalled: (order) => removeCompletedOrder(order.id),
    onCancelled: (order) => removeCompletedOrder(order.id),
  })
})

function onOrderRecalled(order: OrderDetailsWithInclude) {
  removeCompletedOrder(order.id)
  emit('order-recalled', order)
}

onMounted(async () => {
    loading.value = true;

    try {
        // Initial fetch for Completed Orders popup:
        // - Endpoint: /api/orders/completed
        // - Backend already restricts this list to orders made within the last 24 hours
        completed_orders.value = await $fetch<OrderDetailsWithInclude[]>("/api/orders/completed")
        
    } catch (error: unknown) {
        if (isNuxtError(error)) {
            toast.error({
                message: error.message
            });
        }
        
    }
    finally {
        loading.value = false
    }
})
</script>

<template>

      <div class=" bg-card  w-[90%]  h-[80%] overflow-y-scroll p-6 rounded-lg border shadow-2xl space-y-6">
     
     <!-- header -->
        <section class=" flex justify-between items-center">
    <div class=" space-y-2">

        <h2 class="text-3xl ">Completed Orders</h2>
        <p class=" font-light text-sm text-accbg-accent-foreground">View Orders Made Within the last 24 hours and recall if needed</p>
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
      <section v-else-if="completed_orders.length" class="flex flex-wrap gap-2">

                        <div v-for="order in completed_orders" :key="order.id">
                <Completed_Order_Item :order="order" @recalled="onOrderRecalled"></Completed_Order_Item>
            </div>
            
         </section>

      <section v-else class="flex justify-center items-center h-full">
        <p class="text-sm text-muted-foreground">No orders within last 24 hours.</p>
      </section>


  </div>
</template>