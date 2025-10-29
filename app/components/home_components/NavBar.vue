<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isdarkMode = useDark()

const toggleTheme = useToggle(isdarkMode)
</script>

<template>
  <header>
    <section class="flex justify-between items-center">
      <div class="flex gap-6 items-center">
        <div class="">
          <img src="../../assets/RestroMate.png" class="dark:invert" width="100" />
        </div>
        <div class="space-x-6 hidden md:flex">
          <RouterLink to=""> Enterprise</RouterLink>
          <RouterLink to=""> Pricing</RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div v-on:click="toggleTheme()">
          <i class="pi pi-moon"></i>
        </div>
        <button class="bg-violet-500 text-white px-4 py-2">View Dashboard</button>
      </div>
    </section>
  </header>
</template>
