<script setup lang="ts">
import Dashboard_NavBar from '~/components/Dashboard_components/Dashboard_NavBar.vue';
import Dashboard_SideBar from '~/components/Dashboard_components/Dashboard_SideBar.vue';

const { isSidebar_open } = useSideBar()


</script>




<template>

  <div class="flex h-dvh overflow-hidden">

    <Transition name="slide">

      <!-- the heeight of the sidebar is the same as the slot below to match with each other -->
      <Dashboard_SideBar v-if="isSidebar_open" class=""></Dashboard_SideBar>
    </Transition>


    <div class="flex min-h-0 w-full flex-1 flex-col gap-4 p-4 lg:p-8 ">

      <ClientOnly>
        <!-- the navbar is made client cause the auth needs to be checked on the client side -->

        <!-- nav bar dashboard -->
        <Dashboard_NavBar class="shrink-0"></Dashboard_NavBar>

      </ClientOnly>


      <!-- the height is set to screen-4rem and overflow-y-scroll to give immersive experience -->
      <div class="min-h-0 flex-1 overflow-y-auto hide-scrollbar">

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