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
  <div class="rounded-lg border p-6 space-y-2 bg-card hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-muted-foreground">{{ title }}</span>
      <i :class="[icon, iconColor]" />
    </div>
    <div class="text-2xl font-bold">{{ value }}</div>
    <p class="text-xs text-muted-foreground">{{ description }}</p>
  </div>
</template>
