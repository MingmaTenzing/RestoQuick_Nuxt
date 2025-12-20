<script lang="ts" setup>



const { stripe, isLoading } = useClientStripe();
const { cart_items } = useOrderCart();
const { table_id } = useTableId();


const checkout = ref()




onMounted( async () => {

  
    if (!stripe.value) {
        return console.error("Stripe not loaded")
    
 }
  const { clientSecret } = await $fetch('/api/stripe-checkout', {
    method: 'POST',
    body: {
      cart_items: cart_items.value,
      table_id: table_id.value,
    }
  });

  checkout.value = await stripe.value.initEmbeddedCheckout({ clientSecret: clientSecret as string });
  // Mount Checkout
    checkout.value.mount('#checkout');
  checkout.value.destro
});







onBeforeRouteLeave(() => {
    checkout.value.destroy();
    console.log('checkout ddestroy')
    
})






</script>


<template>
  
    <div class=" bg-white flex justify-center items-center h-screen ">

       

  <div v-if="isLoading" class="flex items-center justify-center w-full h-full">
    <div
      class="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" ></div>
  </div>




     

        <div v-else class=" w-full  " id="checkout">
       
        </div>
    </div>
</template>