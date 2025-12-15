
<!-- this page is just for printing the qr codes  -->
<script setup lang="ts">
definePageMeta({
    colorMode:'light'
})
const { data:tables } = useFetch("/api/tables");

</script>

<template>



   <main class=" space-y-10">

   

        <div class=" flex w-full flex-wrap gap-4" >
  
            <div class=" p-6 flex flex-col space-y-4  items-center rounded-lg border  w-[220px]"  v-for="table in tables" :key="table.id">
                <span class=" text-lg">{{ table.number }}</span>
                <Qrcode :value="table.id" ></Qrcode>
                <span class=" text-center text-muted-foreground font-light text-sm">Scan to view menu and order</span>
              
            </div>

        </div>



   </main>

</template>