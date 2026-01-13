<template>
  <tbody>
    <tr v-for="n in 6" :key="n" class="border-t">
      <td class="px-4 py-3">
        <span class="h-4 w-[340px] bg-muted rounded animate-pulse inline-block"></span>
      </td>
      <td class="px-4 py-3">
        <span class="h-4 w-20 bg-muted rounded animate-pulse inline-block"></span>
      </td>
      <td class="px-4 py-3">
        <span class="h-4 w-12 bg-muted rounded animate-pulse inline-block"></span>
      </td>
      <td class="px-4 py-3">
        <div class="flex space-x-2">
          <span class="h-8 w-16 bg-muted rounded animate-pulse inline-block"></span>
          <span class="h-8 w-16 bg-muted rounded animate-pulse inline-block"></span>
          <span class="h-8 w-16 bg-muted rounded animate-pulse inline-block"></span>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* small adjustments if needed */
</style>