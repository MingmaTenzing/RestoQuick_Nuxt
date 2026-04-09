<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  description: string
  icon: string
  iconColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'text-muted-foreground'
})
</script>

<template>
  <div class="rounded-3xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 space-y-3">
        <div class="space-y-1">
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">{{ title }}</p>
          <div class="text-2xl font-semibold leading-none text-foreground md:text-3xl">{{ value }}</div>
          <p class="text-sm text-muted-foreground">{{ description }}</p>
        </div>
      </div>

      <div class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/70">
        <i :class="[icon, iconColor, 'text-base']" />
      </div>
    </div>
  </div>
</template>
