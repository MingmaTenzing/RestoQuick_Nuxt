<template>
  <tr v-for="n in 5" :key="n" class="hover:bg-muted/20 transition-colors">
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-3xl bg-muted animate-pulse"></div>
        <span class="h-4 w-24 bg-muted rounded animate-pulse block"></span>
      </div>
    </td>
    <td class="px-6 py-4">
      <span class="h-6 w-32 bg-muted rounded-full animate-pulse block"></span>
    </td>
    <td class="px-6 py-4">
      <span class="h-4 w-48 bg-muted rounded animate-pulse block font-mono"></span>
    </td>
    <td class="px-6 py-4">
      <div class="flex gap-2">
        <span class="h-8 w-12 bg-muted rounded-3xl animate-pulse inline-block"></span>
        <span class="h-8 w-12 bg-muted rounded-3xl animate-pulse inline-block"></span>
        <span class="h-8 w-12 bg-muted rounded-3xl animate-pulse inline-block"></span>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* small adjustments if needed */
</style>