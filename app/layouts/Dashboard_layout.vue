<script setup lang="ts">
import Dashboard_NavBar from '~/components/Dashboard_components/Dashboard_NavBar.vue';
import Dashboard_SideBar from '~/components/Dashboard_components/Dashboard_SideBar.vue';

const { isSidebar_open } = useSideBar()


</script>




<template>

    
<div class=" flex  ">

    <Transition name="slide"> 
  
  <!-- the heeight of the sidebar is the same as the slot below to match with each other -->
  <Dashboard_SideBar v-if="isSidebar_open " class=""  ></Dashboard_SideBar>
  </Transition>
  
  
  <div class="  w-full space-y-8  p-4 lg:p-8 ">
  
         <!-- nav bar dashboard -->
  <Dashboard_NavBar class=""></Dashboard_NavBar>


      <!-- the height is set to screen-4rem and overflow-y-scroll to give immersive experience -->
<div class="  h-[90vh] overflow-y-scroll  hide-scrollbar bg-">

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

.hide-scrollbar {
  /* For WebKit browsers */
  ::-webkit-scrollbar {
    display: none;
  }
  /* For IE and Edge */
  -ms-overflow-style: none;
  /* For Firefox */
  scrollbar-width: none;
}
</style>