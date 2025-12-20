<script lang="ts" setup>



const { stripe, loadStripe } = useClientStripe();
const { cart_items } = useOrderCart();
const { table_id } = useTableId();

const checkout = ref()


onMounted(async () => {
  const loaded = await loadStripe();
  if (!loaded) {
    console.error('Failed to load Stripe.js');
    return;
  }
  stripe.value = loaded;

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

        <div class=" w-full  " id="checkout">
       
        </div>
    </div>
</template>