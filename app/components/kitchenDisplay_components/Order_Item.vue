<script lang="ts" setup>
import { Prisma } from '~/generated/prisma/client';

import type {OrderDetailsWithInclude } from "../../../types/orderwithInclude"
const props = defineProps<{
  order: OrderDetailsWithInclude
}>()



async function markOrder_as_ready() {

}
</script>

<template>

              
    
                    <div class=" w-[300px] p-4 border  rounded-lg space-y-4">
        
                        <!-- table number and time ago order was placed -->
                        <div class="flex justify-between">
                            <p class=" text-xl font-semibold">{{order.table?.number}}</p>
                            <div class=" flex gap-2 items-center text-muted-foreground font-light">
                                <i class=" pi pi-clock"></i>
<NuxtTime
  data-testid="relative"
  :datetime="new Date(order.createdAt).getTime() - (1*30*1000)" relative
/>
                        
                        </div>
        
                        </div>
        
        
                        <!-- order items -->

                        <div v-for="item in order.items" :key="item.id">

                            
                                      
                                                <div class=" ">
                                                    <div class=" flex space-x-2">
                                                        <p>{{item.quantity}}x</p>
                                                        <p>{{item.itemName}}</p>
                                                    </div>
                                                 
                                                </div>

                                                <!--  special instructions -->
                                            <div v-if="item.specialInstructions !== ''" class="  border bg-accent p-2 rounded-lg text-sm">
                            
                            
                                                <p class=" font-light text-muted-foreground text-xs">Special Instructions</p>
                                                <p class=" font-light">{{item.specialInstructions}}</p>
                            
                            
                                            </div>
                                                
                                            
                            
                            
                                  
                            
                            
                        </div>
        

                        
        
                        <!-- customer -->
        
                        <div >
                            <p>Customer: <span class=" font-semibold">{{ order.customerName }}</span> </p>
                        </div>
        
                        <!-- divider line -->
        
                        <div class=" w-full h-[0.1px] bg-foreground/20 mt-4 mb-4" />
        
        
                        <!-- ready button -->
        
                        <div >
                            <button class="w-full py-2 rounded-lg font-bold  bg-amber-500 text-white ">Mark as Ready</button>
                        </div>
        
        
        
                    </div>
                   
             
    
    
    
    </template>