<script lang="ts" setup>
import type { Order, Prisma } from '~/generated/prisma/client';


type OrderWithItemsAndTable = Prisma.OrderGetPayload<{
  include: {
    items: true
    table: true
  }
}>


interface order_complete {
    order: OrderWithItemsAndTable,
    customerDetails: {
        email: string,
        name: string,
    }
    
}
const route = useRoute();
const session_id = route.query.session_id;




const { data, pending, error } = useFetch<order_complete>(
 `/api/stripe-checkout/session-status?session_id=${session_id}` 
)






const router = useRouter();
const goHome = () => router.push('/');

</script>

<template>
   
  <div class="min-h-screen flex items-center justify-center p-4 bg-background">
    <div v-if="pending" class="text-center">
      <div class="w-12 h-12 rounded-full border-4 border-primary animate-spin border-t-transparent mx-auto mb-3"></div>
      <p class="text-muted">Finalizing your order…</p>
    </div>

    <div v-else-if="error" class="text-center max-w-md w-full">
      <h2 class="text-2xl font-semibold text-destructive">Error</h2>
      <p class="mt-2 text-muted text-lg">{{ error?.data?.statusMessage || error?.message || 'Unable to complete order.' }}</p>
      <div class="mt-4">
        <button class="btn" @click="goHome">Back to home</button>
      </div>
    </div>

    <div v-else-if="data" class="max-w-md w-full bg-card rounded-lg shadow p-6">
      <div class="text-center">
        <div class="flex justify-center mb-4">
          <div class="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
            <!-- check icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="9" stroke-width="2" />
            </svg>
          </div>
        </div>

        <h3 class="text-2xl font-semibold">Order Confirmed!</h3>
        <p class="text-sm text-muted-foreground ">Thank you <span class=" font-bold text-foreground">{{ data.customerDetails.name }}</span> for ordering with us.</p>
        <p class="text-sm text-muted-foreground">Your order has been sent to the kitchen</p>

        <div class="bg-muted rounded-lg p-4 text-center mt-4">
          <p class="text-sm text-muted-foreground mb-1">Order Number</p>
          <p class="text-lg font-bold font-mono">{{ data?.order?.orderNo }}</p>
        </div>



        <div class="text-sm text-muted-foreground text-center mt-4 space-y-2">
         
          <p>Your food will be prepared shortly and delivered to your table no {{ data.order.table?.number }}</p>
          <p>Thank you for your order!</p>
        </div>


        <div class=" mt-4">
            <div class="flex flex-start font-bold text-lg"> Your Order Summary</div>
            <div class=" mt-2 flex flex-col gap-2" >

              <div  class=" flex gap-2 text-muted-foreground" v-for="item in data.order.items" :key="item.id">
               
                <p>{{ item.itemName }}</p>
                <span>x{{  item.quantity }}</span>
               
              </div>
              </div>

            </div>
        </div>

        <div class="mt-6">
          <NuxtLink :to="`/order-table/${data.order?.table?.id}`">
            <button class=" w-full bg-transparent rounded-lg border p-2" type="button">Order More Items</button>
          </NuxtLink>
        </div>

      </div>
    </div>

   
  
</template>