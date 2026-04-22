<script setup lang="ts">
withDefaults(
    defineProps<{
        orderCardCount?: number;
    }>(),
    {
        orderCardCount: 3,
    },
);
</script>

<template>
    <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div class="space-y-4">
            <div v-for="index in orderCardCount" :key="index"
                class="h-40 animate-pulse rounded-3xl border border-border bg-card" />
        </div>

        <div class="h-96 animate-pulse rounded-3xl border border-border bg-card" />
    </div>
</template>