<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import Dashboard_NavBar from '~/components/Dashboard_components/Dashboard_NavBar.vue';
import Dashboard_SideBar from '~/components/Dashboard_components/Dashboard_SideBar.vue';

const { isSidebar_open, isTabletOrLarger } = useSideBar()


</script>




<template>

    
<div class=" relative ">

       <!-- nav bar dashboard -->
<Dashboard_NavBar></Dashboard_NavBar>
<Transition name="slide"> 
    

    <Dashboard_SideBar v-if="isSidebar_open || isTabletOrLarger" class="absolute left-0 top-20 md:static"  ></Dashboard_SideBar>
    </Transition>


<slot></slot>

    
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