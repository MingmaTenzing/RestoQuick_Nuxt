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
    <div class=" flex items-center justify-between h-full">

      <div class=" flex flex-col justify-between h-full ">
        <div>
          <span class="font-light text-muted-foreground">{{ title }}</span>

        </div>
        <div>
          <div class="text-lg md:text-4xl lg:text-5xl font-medium">{{ value }}</div>
          <p class="text-muted-foreground font-light text-sm">{{ description }}</p>

        </div>
      </div>
<div>

  <i :class="[icon, iconColor, 'text-[120px] opacity-5']" />
</div>

    </div>
  </div>
</template>
