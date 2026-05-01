<script setup lang="ts">
import type { StockItem } from "~/generated/prisma/client";

definePageMeta({
  colorMode: "light",
});

const { data: stockItems } = await useFetch<StockItem[]>("/api/stock");
const runtime = useRuntimeConfig();

const getStockQrValue = (stockId: string) => {
  return `${runtime.public.BASE_URL}/dashboard/stock/update/${stockId}`;
};

onMounted(() => {
  // Trigger print dialog after a short delay to ensure QR codes are rendered
  setTimeout(() => {
    window.print();
  }, 500);
});
</script>

<template>
  <main class="space-y-6 p-4">
    <div class="no-print">
      <NuxtLink
        to="/dashboard/stock/qr-labels"
        class="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
      >
        <i class="pi pi-arrow-left text-xs"></i>
        Back
      </NuxtLink>
    </div>

    <div class="print-qr-grid flex w-full flex-wrap gap-2">
      <div
        v-for="item in stockItems"
        :key="item.id"
        class="p-4 flex flex-col space-y-3 items-center border"
      >
        <span class="text-base font-semibold text-center">{{ item.name }}</span>
        <div class="qr-only">
          <Qrcode :value="getStockQrValue(item.id)" width="100" height="100" />
        </div>
      </div>
    </div>
  </main>
</template>

<style>
@media print {
  @page {
    margin: 0;
  }

  body * {
    visibility: hidden !important;
  }

  .print-qr-grid,
  .print-qr-grid * {
    visibility: visible !important;
  }

  .no-print,
  .no-print {
    display: none !important;
  }
}
</style>
