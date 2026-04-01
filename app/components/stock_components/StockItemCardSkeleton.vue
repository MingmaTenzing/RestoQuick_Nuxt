<script setup lang="ts">
</script>

<template>
  <div class="rounded-3xl border p-6 space-y-4 bg-card animate-pulse">
    <!-- Header -->
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="h-5 w-32 bg-muted rounded mb-2"></div>
        <div class="h-3 w-20 bg-muted rounded"></div>
      </div>
      <div class="h-6 w-16 bg-muted rounded"></div>
    </div>

    <!-- Stock Info -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="h-4 w-24 bg-muted rounded"></div>
        <div class="h-6 w-12 bg-muted rounded"></div>
      </div>
      <div class="h-10 w-20 bg-muted rounded"></div>

      <!-- Progress Bar -->
      <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div class="h-2 rounded-full bg-muted w-1/3" />
      </div>

      <div class="flex justify-between">
        <div class="h-3 w-24 bg-muted rounded"></div>
        <div class="h-3 w-24 bg-muted rounded"></div>
      </div>
    </div>

    <div class="h-3 w-32 bg-muted rounded"></div>

    <!-- Actions -->
    <div class="flex gap-2 pt-2 border-t">
      <div class="flex-1 h-9 bg-muted rounded"></div>
      <div class="h-9 w-9 bg-muted rounded"></div>
    </div>
  </div>
</template>
