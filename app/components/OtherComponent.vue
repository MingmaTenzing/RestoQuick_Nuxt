<template>
  <div>
    <div>Other component using stripe</div>
    <section>
      <h2>Stripe client</h2>
      <code>
        <!-- {{ stripe ? stripe : "Loading..." }} -->
        <div id="payment-element" />
      </code>
    </section>
  </div>
</template>

<script setup lang="js">
import { useClientStripe } from "#imports";
import { watch } from "vue";

// import { ref } from "vue";

// const { loadStripe } = useClientStripe();
// if you have already loaded the stripe client in the root component, you can use it here
// you can't re load another client
const { stripe } = useClientStripe();

watch(
  stripe,
  async () => {
    if (stripe.value) {
      // https://github.com/stripe-samples/accept-a-payment/blob/main/payment-element/client/vue-cva/src/components/SrCheckoutForm.vue
      const { clientSecret, error } = await $fetch(
        "/api/stripe-checkout"
      );
      if (error) {
        console.error(error);
        return;
      }

        const appearance = {
        theme:'stripe'
      }

      const elements = stripe.value.elements({
          clientSecret: clientSecret, appearance: appearance
      });

        const paymentElementOptions = {
        layout: "accordion"
      }
      const paymentElement = elements.create("payment", paymentElementOptions);
      paymentElement.mount("#payment-element");
    }
  },
  {
    immediate: true,
  }
);
</script>
