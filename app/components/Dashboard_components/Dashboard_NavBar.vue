
<script setup lang="ts" >
import { Transition } from 'vue';

const { isSidebar_open, open_side_bar, close_side_bar} = useSideBar();

</script>
<template>
   <!-- nav bar dashboard -->
<div class=" flex justify-between p-4 ">
    <div class=" flex items-center space-x-6">
    

        <i v-if="!isSidebar_open" v-on:click="open_side_bar" class="pi pi-bars"></i>
        <i v-else v-on:click="close_side_bar" class="pi pi-times"></i>
        
        <img src="../../assets/images/RestroMate.png" width="100" class="dark:invert w-12 md:w-[100px]"/>
    </div> 
 <div class=" flex items-center space-x-6">
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