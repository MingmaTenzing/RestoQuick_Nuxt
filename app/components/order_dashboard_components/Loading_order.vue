<script setup lang="ts">
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="i in 3"
      :key="i"
      class="rounded-2xl border border-border bg-card px-5 py-3.5 animate-pulse"
    >
      <div class="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-4">
        <div class="w-16 shrink-0 text-center space-y-2">
          <div class="mx-auto h-3 w-10 rounded bg-muted-foreground/20"></div>
          <div class="mx-auto h-5 w-14 rounded bg-muted-foreground/20"></div>
        </div>

        <div class="h-10 w-px shrink-0 bg-border hidden xl:block"></div>

        <div class="min-w-0 flex-1 space-y-2">
          <div class="h-4 w-40 rounded bg-muted-foreground/20"></div>

          <div class="mt-0.5 flex flex-wrap items-center gap-2">
            <div class="h-3 w-20 rounded bg-muted-foreground/20"></div>
            <div class="h-3 w-2 rounded bg-muted-foreground/20"></div>
            <div class="h-3 w-16 rounded bg-muted-foreground/20"></div>
            <div class="h-3 w-2 rounded bg-muted-foreground/20"></div>
            <div class="h-3 w-14 rounded bg-muted-foreground/20"></div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <div class="h-6 w-20 rounded-full bg-muted-foreground/20"></div>
          <div class="h-6 w-24 rounded-full bg-muted-foreground/20"></div>
        </div>

        <div class="w-20 shrink-0 text-right">
          <div class="ml-auto h-4 w-16 rounded bg-muted-foreground/20"></div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <div class="h-7 w-22 rounded-md bg-muted-foreground/20"></div>
          <div class="h-7 w-16 rounded-md bg-muted-foreground/20"></div>
        </div>

        <div class="h-4 w-4 rounded bg-muted-foreground/20 shrink-0"></div>
      </div>
    </div>
  </div>
</template>

