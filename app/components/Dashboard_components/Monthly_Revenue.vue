<script lang="ts" setup>

import type { RevenueTrend } from "~~/types/revenuetrend"
defineOptions({
  tags: ['linecharts', 'singleline']
})

withDefaults(
  defineProps<{
    showTitle?: boolean
  }>(),
  {
    showTitle: false
  }
)


const { data } = await useLazyFetch<RevenueTrend[]>('/api/dashboard/stats/revenue-trend',)
const dataForChart = computed(() => {
  return (data.value ?? []).map((item) => ({
    date: new Intl.DateTimeFormat('en-AU', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(String(item.createdAt))),
    totalRevenue: (item._sum.totalAmountCents ?? 0) / 100
  }))
})

const categories: Record<string, BulletLegendItemInterface> = {
  totalRevenue: { name: 'Total Revenue', color: '#22c55e' }
}

const xFormatter = (tick: number, _i?: number, _ticks?: number[]): string => {
  return dataForChart.value[tick]?.date ?? ''
}
</script>

<template>


<section>

  
  
  <div
    class="min-w-0 w-full space-y-6 rounded-3xl bg-card p-6 border"
    :class="showTitle ? 'p-6' : ''"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        Line Chart
      </h3>
      <NuxtLink to="/blocks/line-charts">
        <UButton
          icon="i-lucide-copy"
          size="sm"
          variant="soft"
          color="neutral"
        />
      </NuxtLink>
    </div>
    <LineChart
      :data="dataForChart"
      :height="360"
      
      x-label="Time"
      y-label="Revenue"
      :categories="categories"
      :y-num-ticks="4"
      :x-num-ticks="7"
      :x-formatter="xFormatter"
      :curve-type="CurveType.Basis"
      :legend-position="LegendPosition.TopRight"
      :hide-legend="false"
      :y-grid-line="true"
    />
  </div>
</section>
</template>
