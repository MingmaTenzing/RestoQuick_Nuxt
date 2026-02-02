<script setup lang="ts">
interface FilterOption {
  value: string
  label: string
  count?: number
}

interface Props {
  modelValue: string
  searchQuery: string
  filters: FilterOption[]
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'update:searchQuery', value: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateFilter = (value: string) => {
  emit('update:modelValue', value)
}

const updateSearch = (event: Event) => {
  emit('update:searchQuery', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <input
      :value="searchQuery"
      @input="updateSearch"
      type="text"
      placeholder="Search items..."
      class="max-w-sm px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    />
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="updateFilter(filter.value)"
        :class="[
          'px-4 py-2 rounded-md transition-colors',
          modelValue === filter.value
            ? 'bg-primary text-primary-foreground'
            : 'border border-input bg-background hover:bg-accent'
        ]"
      >
        {{ filter.label }}
        <span v-if="filter.count !== undefined"> ({{ filter.count }})</span>
      </button>
    </div>
  </div>
</template>
