<script setup lang="ts">
import type { StockItem } from '~/generated/prisma/client'


definePageMeta({
  layout: 'dashboard-layout',
  colorMode: 'light'
})

const { data: stockItems } = await useFetch<StockItem[]>('/api/stock')
const runtime = useRuntimeConfig()

const getStockQrValue = (stockId: string) => {
  return `${runtime.public.BASE_URL}/dashboard/stock/update/${stockId}`
}
</script>

<template>
  <main class="space-y-6">
    <div class="flex w-full flex-wrap gap-4">
      <div
        v-for="item in stockItems"
        :key="item.id"
        class="p-6 flex flex-col space-y-3 items-center rounded-3xl border w-60"
      >
        <span class="text-base font-semibold text-center">{{ item.name }}</span>
        <Qrcode :value="getStockQrValue(item.id)" />
        <span class="text-xs text-muted-foreground break-all text-center">ID: {{ item.id }}</span>
      </div>
    </div>
  </main>
</template>
