<script lang="ts" setup>
type CategorySold = {
  category: string
  percentage: number
}

defineOptions({
  tags: ['donutcharts', 'basic']
})

const { data: soldByCategory } = await useLazyFetch<CategorySold[]>('/api/dashboard/stats/soldbycategory')

const categoryColors: Record<string, string> = {
  APPETIZER: 'var(--color-amber-500)',
  MAIN_COURSE: 'var(--color-emerald-500)',
  DESSERT: 'var(--color-pink-500)',
  BEVERAGE: 'var(--color-sky-500)',
  SIDE: 'var(--color-purple-500)',
  SALAD: 'var(--color-lime-500)',
  OTHER: 'var(--color-neutral-400)',
}

const categoryLabels: Record<string, string> = {
  APPETIZER: 'Appetizer',
  MAIN_COURSE: 'Main Course',
  DESSERT: 'Dessert',
  BEVERAGE: 'Beverage',
  SIDE: 'Side',
  SALAD: 'Salad',
  OTHER: 'Other',
}

const categories = computed(() => {
  const result: Record<string, { name: string; color: string }> = {}
  for (const item of soldByCategory.value ?? []) {
    result[item.category] = {
      name: categoryLabels[item.category] ?? item.category,
      color: categoryColors[item.category] ?? 'var(--color-neutral-400)',
    }
  }
  return result
})

const chartData = computed(() => (soldByCategory.value ?? []).map((i) => i.percentage))

</script>

<template>
    <section class="min-w-0 w-full  flex justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">

        <div id="show_percentage" class="min-w-0 w-1/3 xl:shrink-0">
          <div class="flex h-full flex-col">
            <h4 class="mb-4 text-sm font-semibold text-card-foreground">
              Sales by Category
            </h4>
            <ul class="flex flex-1 flex-col gap-3">
              <li
                v-for="item in soldByCategory" 
                :key="item.category"
                class="flex items-center justify-between"
              >
                <div class="flex items-center gap-2">
                  <span
                    class="h-3 w-3 rounded-full"
                    :style="{ backgroundColor: categoryColors[item.category] ?? 'var(--color-neutral-400)' }"
                  />
                  <span class="text-sm text-muted-foreground">
                    {{ categoryLabels[item.category] ?? item.category }}
                  </span>
                </div>
                <span class="text-sm font-medium text-card-foreground">
                  {{ item.percentage }}%
                </span>
              </li>
            </ul>
          </div>
        </div>
      

        <div class="min-w-0 flex-1">
        <DonutChart
          :data="chartData"
          :height="200"
          :categories="categories"
          :hide-legend="false"
          :type="DonutType.Full"
          :radius="0"
        >
          <div class="text-center">
            <div class="text-sm font-semibold">
                Sold by Category
             
            </div>
         
          </div>
        </DonutChart>
        </div>
    </section>
</template>