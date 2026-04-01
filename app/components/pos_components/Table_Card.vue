<script lang="ts" setup>
import type { Table } from '~/generated/prisma/client'

defineProps<{
    table: Table
}>()
</script>


<template>
    <div class="flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-4xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-ring/60 hover:shadow-md">
        <div class="flex flex-1 flex-col gap-6 p-5 md:p-6">
            <div class="inline-flex w-fit items-center rounded-2xl bg-accent px-3.5 py-1.5 text-sm font-medium text-foreground">
                <span>Table</span>
            </div>

            <div class="space-y-2">
                <h2 class="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{{ table.number }}</h2>
                <p class="text-sm text-muted-foreground">Ready for a new dining order.</p>
            </div>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-border bg-accent/30 px-5 py-4 md:px-6">
            <div>
                <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
                <p class="mt-1 text-sm font-medium text-foreground">Seats available</p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-2xl bg-background px-3.5 py-2 text-sm font-medium text-foreground shadow-sm">
                <i class="pi pi-users text-xs text-muted-foreground"></i>
                <span>{{ table.capacity }}</span>
            </div>
        </div>
    </div>
</template>