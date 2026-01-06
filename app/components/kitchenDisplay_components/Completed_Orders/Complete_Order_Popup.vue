<script lang="ts" setup>
import { type OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import Completed_Order_Item from './Completed_Order_Item.vue';
import Loading_Order_Item from '../Loading_Order_Item.vue';


const { data: completed_orders, pending  } = useFetch<OrderDetailsWithInclude[]>("/api/orders/ready")
console.log(completed_orders.value)

const {close_completed_orders_modal } = useCompleted_Order_Modal()


</script>

<template>

      <div class=" bg-card  w-[90%]  h-[80%] overflow-y-scroll p-6 rounded-lg border shadow-2xl space-y-6">
     
     <!-- header -->
        <section class=" flex justify-between items-center">
    <div class=" space-y-2">

        <h2 class="text-3xl ">Completed Orders</h2>
        <p class=" font-light text-sm text-accbg-accent-foreground">View all completed orders and recall if needed </p>
    </div>
    <button v-on:click="close_completed_orders_modal"  class="mt-4 text-destructive bg-destructive/20 px-4 py-2 rounded-lg">
      Close
    </button>

</section>


<!-- loading orders -->
   <section v-if="pending" class="flex flex-wrap gap-2">
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