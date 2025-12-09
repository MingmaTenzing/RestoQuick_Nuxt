<script setup lang="ts">
import type { MenuItem } from '~/generated/prisma/client';
import type { OrderInclude, OrderItemInclude } from '~/generated/prisma/models';
import type { OrderDetailsWithInclude } from '~~/types/orderwithInclude';


const props = defineProps<{
 menu_item: MenuItem
}>()
</script>


<template>


     <div class=" border flex p-4 gap-2  rounded-lg">
                <NuxtImg  src="https://foodish-api.com/images/burger/burger67.jpg" width="200" height="200" class="rounded-lg w-[100px] h-[100px] object-cover"/>

                <div class="space-y-2 w-full">
                    <div class=" flex justify-between items-center">

                        <span class="text-lg font-semibold ">{{ menu_item.name }}</span>
                        <span class=" bg-accent p-2 rounded-lg font-semibold"> ${{ menu_item.price }}</span>
                    </div>
                    <p class=" text-muted-foreground font-light text-sm">{{ menu_item.description }}</p>


                    <!-- add or minus the items number button -->
                    <div class=" flex items-center justify-between">
                        <div class=" rounded-lg border p-2 w-10 h-10 flex justify-center items-center">

                            <span class=" ">-</span>
                        </div>
                        <div class="flex gap-1 items-center">

                            <span>2</span>
                            <span class=" font-light text-muted-foreground text-sm">in cart</span>
                        </div>
<div class=" rounded-lg border p-2 w-10 h-10 flex justify-center items-center">

                            <span class=" ">+</span>
                        </div>
                    </div>
                </div>

            </div>
</template>