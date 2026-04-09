<script setup lang="ts">
</script>

<template>
  <div class="animate-pulse space-y-4 rounded-3xl border border-border bg-card p-6">
    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1 space-y-2">
        <div class="h-5 w-32 rounded-full bg-muted"></div>
        <div class="h-3 w-20 rounded-full bg-muted"></div>
      </div>
      <div class="h-6 w-20 rounded-full border border-border bg-muted/70"></div>
    </div>

    <!-- Stock Info -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="h-4 w-24 rounded-full bg-muted"></div>
        <div class="h-6 w-14 rounded-full border border-border bg-muted/70"></div>
      </div>
      <div class="flex items-baseline gap-2">
        <div class="h-10 w-20 rounded-full bg-muted"></div>
        <div class="h-4 w-12 rounded-full bg-muted"></div>
      </div>

      <!-- Progress Bar -->
      <div class="h-2 w-full overflow-hidden rounded-full bg-muted/70">
        <div class="h-2 w-1/3 rounded-full bg-muted" />
      </div>

      <div class="flex justify-between">
        <div class="h-3 w-24 rounded-full bg-muted"></div>
        <div class="h-3 w-24 rounded-full bg-muted"></div>
      </div>
    </div>

    <div class="h-3 w-32 rounded-full bg-muted"></div>

    <!-- Actions -->
    <div class="flex gap-2 border-t border-border pt-2">
      <div class="h-10 flex-1 rounded-2xl bg-muted"></div>
      <div class="h-10 w-10 rounded-2xl border border-border bg-muted/70"></div>
    </div>
  </div>
</template>
