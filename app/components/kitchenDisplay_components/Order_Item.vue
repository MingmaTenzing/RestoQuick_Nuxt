<script lang="ts" setup>

import { OrderStatus } from "~/generated/prisma/enums";
import type {OrderDetailsWithInclude } from "../../../types/orderwithInclude"
const props = defineProps<{
  order: OrderDetailsWithInclude
}>()

const serviceLabel = computed(() => props.order.orderType === 'TAKEAWAY'
  ? 'Takeaway'
  : `Table ${props.order.table?.number ?? '--'}`)


async function markOrder_as_ready(order_id: string) {
  try {
    const updatedOrder = await $fetch("/api/orders", {
      method: "PUT",
      body: { order_id: order_id, status: OrderStatus.COMPLETED  },
    });
    console.log(updatedOrder)
    
  } catch (e) {
    console.error("Failed to mark order as ready", e);
  }
} 
</script>

<template>

              
    
                    <div class=" w-80 p-4 bg-card border  rounded-lg space-y-4">
        
                        <!-- table number and time ago order was placed -->
                        <div class="flex justify-between items-center">
                          <div class=" space-y-1">
                            <p class=" text-xl font-semibold">Order No: {{order.orderNo}}</p>
                            <p class="text-muted-foreground">{{ serviceLabel }}</p>
                          </div>
                            <div class=" flex gap-2 items-center text-sm text-muted-foreground font-light">
                                <i class=" pi pi-clock"></i>
<NuxtTime
  data-testid="relative"
  :datetime="new Date(order.createdAt).getTime() - (1*30*1000)" relative
/>
                        
                        </div>
        
                        </div>
        
        
                        <!-- order items -->

                        <div v-for="item in order.items" :key="item.id">
                          <div>
                            <div class=" flex space-x-2">
                              <p>{{item.quantity}}x</p>
                              <p>{{item.itemName}}</p>
                            </div>

                            <!-- options (orderItemOptions snapshot) -->
                            <div v-if="item.orderItemOptions && item.orderItemOptions.length" class="mt-2 ml-4 space-y-1 text-sm">
                              <p class="text-xs font-medium text-muted-foreground">Options</p>
                              <div v-for="opt in item.orderItemOptions" :key="opt.id" class="flex justify-between">
                                <div class="flex gap-2">
                                  <p class="font-medium">{{opt.quantity}}x</p>
                                  <p>{{opt.name}}</p>
                                </div>
                                <div class="text-muted-foreground">{{ (opt.priceCents/100).toFixed(2) }}</div>
                              </div>
                            </div>

                            <!--  special instructions -->
                            <div v-if="item.specialInstructions !== ''" class=" border bg-accent p-2 rounded-lg text-sm mt-2">
                              <p class=" font-light text-muted-foreground text-xs">Special Instructions</p>
                              <p class=" font-light">{{item.specialInstructions}}</p>
                            </div>
                          </div>
                        </div>
        

                                                <!-- divider line -->

                                <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />

                        <!-- customer -->
        
                        <div >
                            <p>Customer: <span class=" font-semibold">{{ order.customerName }}</span> </p>
                        </div>
        
        


                        <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />
        
        
                        <!-- complete button -->
        
                        <div >
                            <button @click="markOrder_as_ready(order.id)" class="w-full py-2 rounded-lg font-bold  bg-amber-600 text-white ">Mark as Completed</button>
                        </div>
        
        
        
                    </div>
                   
             
    
    
    
    </template>