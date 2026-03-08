
<script setup lang="ts" >


const { isSidebar_open, open_side_bar, close_side_bar } = useSideBar();


</script>
<template>
   <!-- nav bar dashboard -->
<div class=" flex justify-between items-center min-w-full  ">


    <div >

        <i v-if="!isSidebar_open " v-on:click="open_side_bar" class="pi pi-bars"></i>
        <i v-else v-on:click="close_side_bar" class="pi pi-times"></i>
        
    </div>

     
 <div class=" flex items-center space-x-6">
    <div>
        <i v-on:click="$colorMode.preference = 'dark'"  v-if="$colorMode.value === 'light'" class=" pi pi-moon"></i>
        <i v-on:click="$colorMode.preference = 'light'" v-if="$colorMode.value === 'dark'" class=" pi pi-sun"></i>
    </div>
     <div>
         
           <div class=" text-sm md:text-base ">Mingma</div>
         <span class=" font-light text-xs md:text-sm">Admin</span>
     </div>
     <div>
         <i class=" pi pi-sign-out" ></i>
     </div>
 </div>
    
</div>

</template>