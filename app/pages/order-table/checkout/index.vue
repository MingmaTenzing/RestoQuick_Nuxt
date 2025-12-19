<script lang="ts" setup>



const { stripe, isLoading } = useClientStripe();
const { cart_items } = useOrderCart();
const {table_id } = useTableId();

onMounted(async() => {
   


      
        
        
                const { clientSecret } = await $fetch('/api/stripe-checkout', {
                    method: 'POST',
                    body: {
                        cart_items: cart_items.value,
                        table_id: table_id.value,
                }
              })
              
                  const checkout = await stripe.value.initEmbeddedCheckout(
                      {clientSecret: clientSecret as string}
                  );
                  
                
                  // Mount Checkout
                  checkout.mount('#checkout');
            }

      
    
    
)


// watch(stripe,
//     async () => {


//         if (stripe.value) {
        
        
//                 const { clientSecret } = await $fetch('/api/stripe-checkout', {
//                     method: 'POST',
//                     body: {
//                         cart_items: cart_items.value,
//                         table_id: table_id.value,
//                 }
//               })
              
//                   const checkout = await stripe.value.initEmbeddedCheckout(
//                       {clientSecret: clientSecret as string}
//                   );
                  
                
//                   // Mount Checkout
//                   checkout.mount('#checkout');
//             };

      
//     }
//     , {
//     immediate: true
// })




</script>


<template>
  
    <div class=" bg-white flex justify-center items-center w-full ">

        <div class=" w-full h-full " id="checkout">
       
        </div>
    </div>
</template>