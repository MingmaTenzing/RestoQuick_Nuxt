<script lang="ts" setup>
type PopularItem = {
  name: string
  sold_quantity: number
}

defineOptions({
  tags: ['barcharts', 'vertical']
})

withDefaults(
  defineProps<{
    showTitle?: boolean
  }>(),
  {
    showTitle: false
  }
)


const { data: popularItems } = await useLazyFetch<PopularItem[]>('/api/dashboard/stats/popular-items')

const Items = computed(() => ({
  sold_quantity: {
    name: 'Items',
    color: '#22c55e'
  }
}))

const xFormatter = (i: number): string => popularItems.value?.[i]?.name ?? ''
const yFormatter = (tick: number) => tick.toString()
</script>

<template>
  <div
    class="min-w-0 w-full space-y-6 rounded-lg border bg-card p-6"
    :class="showTitle ? 'p-6' : ''"
  >
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold">
          Bar Chart
        </h3>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">
          Top selling items over the last 30 days
        </p>
      </div>
      <NuxtLink to="/blocks/bar-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <BarChart
      :data="popularItems ?? []"
      :height="300"
      :categories="Items"
      :y-axis="['sold_quantity']"
      :x-num-ticks="6"
      :radius="4"
      :y-grid-line="true"
      :x-formatter="xFormatter"
      :y-formatter="yFormatter"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
    />
  </div>
</template>