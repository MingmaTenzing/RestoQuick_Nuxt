<script setup lang="ts">
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="i in 3"
      :key="i"
      class="animate-pulse rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5"
    >
      <div class="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div class="flex items-center gap-3 md:items-start md:pr-1">
          <div class="h-14 w-14 shrink-0 rounded-2xl bg-muted"></div>

          <div class="min-w-0 space-y-2 md:hidden">
            <div class="h-3 w-12 rounded bg-muted"></div>
            <div class="h-4 w-28 rounded bg-muted"></div>
          </div>
        </div>

        <div class="min-w-0 flex-1 space-y-2">
          <div class="hidden space-y-2 md:block">
            <div class="h-3 w-16 rounded bg-muted"></div>
            <div class="h-5 w-40 max-w-full rounded bg-muted"></div>
          </div>

          <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
            <div class="h-7 w-24 rounded-full bg-muted"></div>
            <div class="h-3 w-20 rounded bg-muted"></div>
            <div class="h-3 w-16 rounded bg-muted"></div>
          </div>
        </div>

        <div class="flex flex-col gap-3 border-t border-border pt-4 md:col-span-2 md:flex-row md:items-center md:justify-between xl:col-span-1 xl:min-w-52 xl:border-l xl:border-t-0 xl:pl-5 xl:pt-0">
          <div class="flex flex-wrap items-center gap-2 xl:justify-end">
            <div class="h-7 w-24 rounded-full bg-muted"></div>
            <div class="h-7 w-24 rounded-full bg-muted"></div>
          </div>

          <div class="rounded-2xl bg-muted px-3.5 py-2.5 md:min-w-28 md:text-right">
            <div class="ml-auto h-3 w-12 rounded bg-background/70"></div>
            <div class="mt-2 ml-auto h-6 w-20 rounded bg-background/70"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

