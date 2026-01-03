<script lang="ts" setup>
import { useWebSocket } from '@vueuse/core';
import { ref, computed } from 'vue'
import Order_Item from '~/components/kitchenDisplay_components/Order_Item.vue';
import type{ OrderDetailsWithInclude } from '~~/types/orderwithInclude';
import type websocket_payload from '~~/types/websocket_payload';

definePageMeta({
    layout: 'dashboard-layout'
})


const toast = useToast()

const all_orders = ref<OrderDetailsWithInclude[]>([]);


// connection to websocket
const { status, data, send, close } = useWebSocket(`ws://localhost:3000/api/websocket`)

//initial data fetch from the database
// const { data: orders } = useFetch<OrderDetailsWithInclude[]>("/api/orders")

onMounted(async () => {
    all_orders.value = await $fetch<OrderDetailsWithInclude[]>('/api/orders');


})




watch(data, (newValue: string) => {
 toast.success({
     title: 'success',
        message: 'Order Received '
    })
    console.log(newValue)

    let parsed_data: websocket_payload = JSON.parse(newValue)

    all_orders.value.push(parsed_data.payload)
 
   




})



</script>


<template>

    <main>
        {{ status }}

        {{ data }}
            <!-- header -->
        <section class=" space-y-4">
 <div>
     <h2 class="text-2xl md:text-6xl"> Kitchen Display </h2>
     <p class=" text-sm lg:text-base text-muted-foreground">Manage incoming order and preparation status</p>
 

 </div>
            <!-- stats -->
            <section class=" flex justify-around gap-4">
                    <!-- pending orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full  ">
                    <div class=" flex gap-2 text-lg text-amber-600 items-center">
                        <p class=" ">Pending Orders </p>
                        <i class=" pi pi-clock"></i>

                    </div>
        
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold text-amber-600">7</span>
                        <p class=" text-muted-foreground font-light text-sm">Currently in Kitchen</p>
                    </div>
                    
                </div>
        
                <!-- completed orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full ">
                     <div class=" flex gap-2 text-lg text-green-600 items-center">
                        <p class=" ">Completed Orders </p>
                        <i class=" pi pi-check-circle"></i>

                    </div>
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold text-green-600">78</span>
                        <p class=" text-muted-foreground font-light text-sm">Completed by kitchen</p>
                    </div>
                    
        
                </div>
        
        
                <!-- total orders -->
                <div class="p-4 border bg-card rounded-lg h-40  justify-between flex flex-col w-full ">
                    <p class=" text-lg">Total Orders (Today) </p>
        
                    <div class=" flex flex-col">
                        <span class=" text-4xl font-bold">121</span>
                        <p class=" text-muted-foreground font-light text-sm">Total for {{ new Date(Date.now()) }}</p>
                    </div>
                    
                </div>
              
        
            </section>
        </section>



        <!-- orders -->

        <section class=" flex flex-wrap gap-2 ">
          
   <div v-for="order in all_orders" :key="order.id" >

    <Order_Item :order="order"></Order_Item>
   </div>
        </section>

    </main>
</template>