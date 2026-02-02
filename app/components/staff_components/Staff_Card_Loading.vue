<template>
  <div
    class="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border py-6 shadow-sm group relative overflow-hidden"
  >
    <div class="px-6 pt-6 flex flex-col space-y-6">
      <!-- Online Status Indicator (skeleton) -->
      <div class="absolute top-3 right-3">
        <span class="flex h-2.5 w-2.5">
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-muted animate-pulse"></span>
        </span>
      </div>

      <!-- Profile Section (skeleton) -->
      <div class="flex flex-col items-center text-center mb-6">
        <div class="h-20 w-20 rounded-full mb-3 ring-2 ring-background shadow-md bg-muted animate-pulse" />
        <div class="h-4 w-28 bg-muted rounded animate-pulse mb-2"></div>
        <div class="h-5 w-20 bg-muted rounded-md animate-pulse mt-1"></div>
      </div>

      <!-- Contact & Info (skeleton) -->
      <div class="space-y-4 text-sm border-t border-border pt-3 mb-3">
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 bg-muted rounded animate-pulse shrink-0"></div>
          <div class="h-3 w-32 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 bg-muted rounded animate-pulse shrink-0"></div>
          <div class="h-3 w-24 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 bg-muted rounded animate-pulse shrink-0"></div>
          <div class="h-3 w-20 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 bg-muted rounded animate-pulse shrink-0"></div>
          <div class="h-3 w-14 bg-muted rounded animate-pulse"></div>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 bg-muted rounded animate-pulse shrink-0"></div>
          <div class="h-3 w-28 bg-muted rounded animate-pulse"></div>
        </div>
      </div>

      <!-- Weekly Availability (skeleton) -->
      <div class="border-t border-border pt-3">
        <div class="h-3 w-32 bg-muted rounded animate-pulse mb-2"></div>
        <div class="flex gap-1">
          <div
            v-for="i in 7"
            :key="i"
            class="flex-1 py-1 rounded text-[10px] bg-muted animate-pulse"
          />
        </div>
      </div>

      <!-- Action Buttons (skeleton) -->
      <div class="flex gap-2 mt-4 pt-3 border-t border-border">
        <div class="flex-1 h-8 bg-muted rounded-md animate-pulse"></div>
        <div class="flex-1 h-8 bg-muted rounded-md animate-pulse"></div>
        <div class="h-8 w-8 bg-muted rounded-md animate-pulse shrink-0"></div>
      </div>
    </div>
  </div>
</template>
