<script lang="ts" setup>
import { client } from 'process';


    

const { stripe, isLoading } = useClientStripe();





watch(stripe, 
    async () => {


        if (stripe.value) {
        
            const fetchClientSecret = async () => {
              const {clientSecret} = await $fetch('/api/stripe-checkout' 
              //   method: "POST",
              );

                console.log(clientSecret);
                return clientSecret;
            };

            
        
            const checkout = await stripe.value.initEmbeddedCheckout({
               fetchClientSecret        }
            );
          
            // Mount Checkout
            checkout.mount('#checkout');
    }
    }, {
    immediate: true
})




</script>


<template>
    <div class=" bg-white flex justify-center items-center w-full ">

        <div class=" w-full h-full " id="checkout">
       
        </div>
    </div>
</template>