<script setup lang="ts">

const colorMode = useColorMode()
console.log(colorMode.preference)

</script>

<template>
  <header>
    <section class="flex justify-between items-center">
      <div class="flex gap-6 items-center">
        <div class="">
          <img src="../../assets/images/RestroMate.png" class="dark:invert" width="100" />
        </div>
        <div class="space-x-6 hidden md:flex">
          <RouterLink to=""> Enterprise</RouterLink>
          <RouterLink to=""> Pricing</RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-4">
        {{ $colorMode.preference }}
        <div v-on:click="$colorMode.preference = 'light'">
       
          <i class="pi pi-moon"></i>
        </div>
        <div v-on:click="$colorMode.preference = 'dark'">
       
          <i class="pi pi-moon"></i>
        </div>
        <NuxtLink to="/dashboard" >

          <button class="bg-violet-500 text-white px-4 py-2">View Dashboard</button>
        </NuxtLink>
      </div>
    </section>
  </header>
</template>
