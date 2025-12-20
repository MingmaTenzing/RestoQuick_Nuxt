<script setup lang="ts">
import type { MenuItem } from '~/generated/prisma/client';
import type Order_Cart_Item from '~~/types/order-cart';




const props = defineProps<{
 menu_item: MenuItem
}>()


const { add_to_cart, remove_from_cart, cart_items } = useOrderCart();


const special_instruction  = ref('')

function add_item_to_cart() {
    console.log(props.menu_item)

    const order_cart_item: Order_Cart_Item = {
        itemName: props.menu_item.name,
        quantity: 1, 
        unitPrice: props.menu_item.priceCents,
        menuItemId: props.menu_item.id,
        specialInstructions: special_instruction.value,
        
    }

    add_to_cart(order_cart_item)

    



}


</script>


<template>


     <div class=" border flex p-4 gap-2  rounded-lg">
                <NuxtImg  src="https://www.foodandwine.com/thmb/jldKZBYIoXJWXodRE9ut87K8Mag=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg" width="200" height="200" class="rounded-lg w-[100px] h-[100px] object-cover"/>

                <div class="space-y-2 w-full">
                    <div class=" flex justify-between items-center">

                        <span class="text-lg font-semibold ">{{ menu_item?.name }}</span>
                        <span class=" bg-accent p-2 rounded-lg font-semibold"> ${{ menu_item?.priceCents/100 }}</span>
                    </div>
                    <p class=" text-muted-foreground font-light text-sm">{{ menu_item?.description }}</p>


                    <div>
                        <label  class=" text-xs font-light text-muted-foreground">
                            Sepcial Instruction
                        </label>
                        <textarea v-model="special_instruction" :key="menu_item.id"  class=" text-xs w-full rounded-lg outline-none border p-2" placeholder=" E.g. Extra Spicy, Less Rice"></textarea>
                    </div>
                    <div>
                        <div v-if="!cart_items.find((item) => item.menuItemId == menu_item.id)" class=" flex justify-end">
                            <button @click="add_item_to_cart()" class=" bg-amber-600  text-amber-50  rounded-lg p-2 text-sm">
                                Add to cart
                            </button>
                        </div>
                        <div v-else class=" flex justify-end">
                            <button class=" bg-muted text-muted-foreground rounded-lg p-2 text-sm">Added to Cart</button>

                        </div>

                    </div>
                    <!-- add or minus the items number button -->
                    
                    <!-- will work on this later once the cart state is done -->
                    <!-- <div class=" flex items-center justify-between">
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
                    </div> -->
                </div>

            </div>
</template>