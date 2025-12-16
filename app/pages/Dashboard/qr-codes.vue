<script setup lang="ts">

definePageMeta({
    layout:'dashboard-layout'
})
const { data:tables } = useFetch("/api/tables");







</script>

<template>



   <main class="p-4 space-y-10">

    <!-- header -->
    <div class=" flex justify-between">
<div>
    <h2 class=" font-bold text-4xl">QR Code Generator</h2>
    <p class=" text-muted-foreground">Generate QR Codes for table ordering</p>

</div>
<NuxtLink to="/print-qr-codes">
    <button class=" w-[120px] bg-primary text-primary-foreground p-4 rounded-lg border ">Print All</button>
</NuxtLink>
        </div>




        <!-- qr codes -->
        <div class=" flex w-full flex-wrap gap-4" >
  
            <div class=" p-6 flex flex-col space-y-4  items-center rounded-lg border  w-[300px]"  v-for="table in tables" :key="table.id">
                <span class=" text-lg">{{ table.number }}</span>
                <Qrcode :value="table.id" ></Qrcode>
                <span class=" text-muted-foreground font-light text-sm">Scan to view menu and order</span>
               
               <!-- only for dev -->
                <NuxtLink :to="`/order-table/${table.id}`">

                    <button class="p-2 border rounded-lg">Order On Table (for Dev)</button>
                </NuxtLink>
            </div>

        </div>



   </main>

</template>