<script lang="ts" setup>
import type Order_Cart_Item from "~~/types/order-cart";

const props = defineProps<{
  cart_item: Order_Cart_Item;
}>();

const { increase_quantity, decrease_quantity, remove_from_cart } =
  useOrderCart();




</script>

<template>
  <div class="flex border-b pb-4 justify-between">
    <div class="flex items-center gap-2">
      <NuxtImg
        src="https://www.foodandwine.com/thmb/jldKZBYIoXJWXodRE9ut87K8Mag=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg"
        width="80"
        class="rounded-lg"
      />
      <div class="space-y-2">
        <div class="font-semibold">{{ cart_item.itemName }}</div>
        <div class="text-xs text-muted-foreground font-light">
          {{ cart_item.specialInstructions }}
        </div>
        <div class="font-light text-sm text-muted-foreground">
          ${{ cart_item.unitPrice /100}} each
        </div>

        <!-- add or minus the items number button -->
        <div class="flex items-center gap-4">
          <button
            @click="decrease_quantity(cart_item)"
            class="rounded-lg border p-2 w-10 h-10 flex justify-center items-center"
          >
            <span class=" ">-</span>
          </button>
          <div class="flex gap-1 items-center">
            <span>{{ cart_item.quantity }}</span>
            <span class="font-light text-muted-foreground text-sm"
              >in cart</span
            >
          </div>
          <button
            @click="increase_quantity(cart_item)"
            class="rounded-lg border p-2 w-10 h-10 flex justify-center items-center"
          >
            <span class=" ">+</span>
          </button>
        </div>
      </div>
    </div>

    <!-- total -->
    <div class="flex flex-col gap-4 justify-between items-end">
      <button @click="remove_from_cart(cart_item)">
        <i class="pi pi-trash text-destructive"></i>
      </button>
      <span class="font-bold"
        >${{ (cart_item.quantity * (cart_item.unitPrice/100) ).toFixed(2)}}</span
      >
    </div>
  </div>
</template>
