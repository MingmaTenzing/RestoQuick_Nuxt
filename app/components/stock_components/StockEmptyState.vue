<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'No items found',
  description: 'Try adjusting your search or filters'
})
</script>

<template>
  <div class="rounded-lg border p-12 text-center space-y-4">
    <i class="pi pi-box text-5xl text-muted-foreground mx-auto opacity-50" />
    <p class="text-lg font-medium">{{ title }}</p>
    <p class="text-sm text-muted-foreground">{{ description }}</p>
  </div>
</template>
