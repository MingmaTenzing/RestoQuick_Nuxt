<script setup lang="ts">
import Dashboard_NavBar from '~/components/Dashboard_components/Dashboard_NavBar.vue';
import Dashboard_SideBar from '~/components/Dashboard_components/Dashboard_SideBar.vue';

</script>

<template>

    
<div class=" relative ">

       <!-- nav bar dashboard -->
<Dashboard_NavBar></Dashboard_NavBar>
<Dashboard_SideBar ></Dashboard_SideBar>

<slot></slot>

    
</div>


</template>