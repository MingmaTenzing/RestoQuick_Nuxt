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
  <div class="flex flex-col gap-4 rounded-4xl border border-border bg-card p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
    <div class="flex w-full items-center gap-3 rounded-2xl border border-border bg-muted/50 px-4 py-3 lg:max-w-md">
      <i class="pi pi-search text-sm text-muted-foreground" />
      <input
        :value="searchQuery"
        @input="updateSearch"
        type="text"
        placeholder="Search items..."
        class="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
      />
    </div>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="updateFilter(filter.value)"
        :class="[
          'inline-flex items-center gap-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
          modelValue === filter.value
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'border border-border bg-muted/50 text-foreground hover:bg-accent'
        ]"
      >
        {{ filter.label }}
        <span v-if="filter.count !== undefined" class="text-xs opacity-80">{{ filter.count }}</span>
      </button>
    </div>
  </div>
</template>
