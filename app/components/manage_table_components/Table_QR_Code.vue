<script lang="ts" setup>

import { useRuntimeConfig } from '#app';
import type { Table } from '~/generated/prisma/client';

const props = defineProps<{ table: Table}>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:show', value: boolean): void;
}>();

const toast = useToast();

const runtime = useRuntimeConfig();

const url = ref(`${runtime.public.BASE_URL}/order-table/${props.table.id}`)

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(url.value);
    toast.success({ title: 'Link copied' });
  } catch (e) {
    toast.error({ title: 'Copy failed' });
  }
};

const close = () => {
  emit('update:show', false);
  emit('close');
};
</script>

<template>

      <div class="w-full max-w-md p-6 bg-card rounded-lg shadow-lg relative">
        <button @click="close" class="absolute top-3 right-3 text-sm rounded p-1 hover:bg-muted/20">✕</button>

        <h3 class="text-2xl mb-4 text-center"> Table: {{ table.number }}</h3>

        <div  class="flex flex-col items-center space-y-4">
     <Qrcode :value="`${runtime.public.BASE_URL}/order-table/${table.id}`" ></Qrcode>

          <div class="flex space-x-2 mt-4">
            <button @click="copyLink" class="px-4 py-2 rounded-lg border hover:border-ring">Copy Link</button>
            <button @click="close" class="px-4 py-2 rounded-lg border">Close</button>
          </div>
        </div>
</div>
  
</template>