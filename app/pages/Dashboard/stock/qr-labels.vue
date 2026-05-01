<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});

import type { StockItem } from "~/generated/prisma/client";

const { data: stockItems, status } = await useFetch<StockItem[]>("/api/stock");
const runtime = useRuntimeConfig();

const getStockQrValue = (stockId: string) => {
  return `${runtime.public.BASE_URL}/dashboard/stock/update/${stockId}`;
};
</script>

<template>
  <main class="p-4 space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="font-bold text-3xl md:text-4xl">Stock QR Labels</h2>
        <p class="text-muted-foreground">
          Generate scannable labels linked to stock item IDs
        </p>
      </div>

      <NuxtLink to="/dashboard/stock/print-qr-labels">
        <button
          class="px-4 py-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors border border-primary"
        >
          Print All
        </button>
      </NuxtLink>
    </div>

    <div v-if="status === 'pending'" class="text-muted-foreground">
      Loading stock labels...
    </div>

    <div
      v-else-if="!stockItems?.length"
      class="border border-border rounded-3xl bg-card p-8 text-center text-muted-foreground"
    >
      No stock items found.
    </div>

    <div v-else class="flex w-full flex-wrap gap-4">
      <div
        v-for="item in stockItems"
        :key="item.id"
        class="p-6 flex flex-col space-y-3 items-center rounded-3xl border border-border bg-card w-70"
      >
        <span class="text-lg font-semibold text-center">{{ item.name }}</span>
        <Qrcode :value="getStockQrValue(item.id)" />
        <span class="text-xs text-muted-foreground break-all text-center"
          >ID: {{ item.id }}</span
        >
        <span class="text-sm text-muted-foreground text-center"
          >Scan to open stock update page</span
        >
      </div>
    </div>
  </main>
</template>
