<template>
  <div
    class="bg-card text-card-foreground flex flex-col gap-6 rounded-3xl border border-border py-6 shadow-sm group relative overflow-hidden"
  >
    <div class="px-6 pt-6">
      <!-- Online Status Indicator (skeleton) -->
      <div class="absolute top-3 right-3">
        <span class="flex h-2.5 w-2.5">
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted animate-pulse"></span>
        </span>
      </div>

      <!-- Profile Section (skeleton) -->
      <div class="mb-4 flex flex-col items-center text-center">
        <div class="h-20 w-20 rounded-full mb-3 ring-2 ring-background shadow-md bg-muted animate-pulse" />
        <div class="mb-2 h-4 w-28 rounded bg-muted animate-pulse"></div>
        <div class="mt-1 h-5 w-20 rounded-2xl bg-muted animate-pulse"></div>
      </div>

      <!-- Contact & Info (skeleton) -->
      <div class="mb-3 space-y-2 border-t border-border pt-3 text-sm">
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="h-3 w-3 shrink-0 rounded bg-muted animate-pulse"></div>
          <div class="h-3 w-full max-w-32 rounded bg-muted animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="h-3 w-3 shrink-0 rounded bg-muted animate-pulse"></div>
          <div class="h-3 w-24 rounded bg-muted animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="h-3 w-3 shrink-0 rounded bg-muted animate-pulse"></div>
          <div class="h-3 w-20 rounded bg-muted animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="h-3 w-3 shrink-0 rounded bg-muted animate-pulse"></div>
          <div class="h-3 w-14 rounded bg-muted animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2 text-muted-foreground">
          <div class="h-3 w-3 shrink-0 rounded bg-muted animate-pulse"></div>
          <div class="h-3 w-28 rounded bg-muted animate-pulse"></div>
        </div>
      </div>

      <!-- Weekly Availability (skeleton) -->
      <div class="border-t border-border pt-3">
        <div class="mb-2 h-3 w-32 rounded bg-muted animate-pulse"></div>
        <div class="flex gap-1">
          <div
            v-for="i in 7"
            :key="i"
            class="h-6 flex-1 rounded bg-muted animate-pulse"
          />
        </div>
      </div>

      <!-- Action Buttons (skeleton) -->
      <div class="mt-4 flex gap-2 border-t border-border pt-3">
        <div class="h-8 flex-1 rounded-2xl bg-muted animate-pulse"></div>
        <div class="h-8 w-8 shrink-0 rounded-2xl bg-muted animate-pulse"></div>
        <div class="h-8 w-8 shrink-0 rounded-2xl bg-muted animate-pulse"></div>
      </div>
    </div>
  </div>
</template>
