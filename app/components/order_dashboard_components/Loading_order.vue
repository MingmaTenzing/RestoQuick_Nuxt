<script setup lang="ts">
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="i in 3"
      :key="i"
      class="border border-border rounded-lg bg-card p-4 animate-pulse"
    >
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-muted-foreground/20"></div>
            <div class="space-y-2">
              <div class="h-4 w-32 bg-muted-foreground/20 rounded"></div>
              <div class="h-3 w-24 bg-muted-foreground/20 rounded"></div>
            </div>
          </div>
        </div>
        <div class="h-6 w-20 bg-muted-foreground/20 rounded-full"></div>
      </div>
      <div class="grid grid-cols-3 gap-3 mb-4">
        <div class="h-4 bg-muted-foreground/20 rounded"></div>
        <div class="h-4 bg-muted-foreground/20 rounded"></div>
        <div class="h-4 bg-muted-foreground/20 rounded"></div>
      </div>
      <div class="space-y-2">
        <div class="h-4 bg-muted-foreground/20 rounded"></div>
        <div class="h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    </div>
  </div>
</template>

