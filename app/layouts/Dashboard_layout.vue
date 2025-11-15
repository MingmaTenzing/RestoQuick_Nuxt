<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import Dashboard_NavBar from '~/components/Dashboard_components/Dashboard_NavBar.vue';
import Dashboard_SideBar from '~/components/Dashboard_components/Dashboard_SideBar.vue';

const { isSidebar_open, isTabletOrLarger } = useSideBar()


</script>




<template>

    
<div class=" relative  z-0 ">

       <!-- nav bar dashboard -->
<Dashboard_NavBar></Dashboard_NavBar>


<div class=" md:flex">




  
<Transition name="fade">
        <div
          v-if="isSidebar_open && !isTabletOrLarger"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-0 "
          @click="isSidebar_open = false"
        ></div>
      </Transition>

      <Transition name="slide"> 
      
  
      <Dashboard_SideBar v-if="isSidebar_open || isTabletOrLarger" class="absolute left-0 top-20 lg:static z-0"  ></Dashboard_SideBar>
      </Transition>
<div class=" p-4 w-full">

  <slot></slot>
</div>

</div>



    
</div>


</template>

<style>

.slide-enter-active {
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.slide-leave-active {
  transition: transform 0.6s ease-in, opacity 0.6s ease-in;
}

/* Start positions */
.slide-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

/* End positions */
.slide-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>