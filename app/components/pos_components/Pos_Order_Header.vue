<script setup lang="ts">
import type { Table } from '~/generated/prisma/browser'

defineProps<{
    table: Table | null | undefined
    totalItems: number
    subtotalCents: number
}>()
</script>

<template>
    <section class="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm md:px-5">
        <div class=" space-y-4">
            <NuxtLink
                to="/dashboard/pos"
                class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
                <i class="pi pi-arrow-left text-xs"></i>
                <span>Back to tables</span>
            </NuxtLink>

            <div class="flex flex-1 flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-foreground">
                        <i class="pi pi-desktop text-base"></i>
                    </div>
                    <div>
                        <p class="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">POS screen</p>
                        <h1 class="text-xl font-semibold tracking-tight text-foreground md:text-2xl">Table {{ table?.number ?? '--' }}</h1>
                    </div>
                </div>

                <div class="grid gap-2 sm:grid-cols-3 xl:w-auto">
                    <div class="rounded-2xl border border-border   bg-secondary  px-4 py-3">
                        <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
                        <p class="mt-1 text-lg font-semibold text-foreground">{{ table?.capacity ?? '--' }}</p>
                    </div>
                    <div class="rounded-2xl border border-border bg-secondary   px-4 py-3">
                        <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Items</p>
                        <p class="mt-1 text-lg font-semibold text-foreground">{{ totalItems }}</p>
                    </div>
                    <div class="rounded-2xl border border-border   bg-secondary  px-4 py-3">
                        <p class="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Subtotal</p>
                        <p class="mt-1 text-lg font-semibold text-foreground">${{ (subtotalCents / 100).toFixed(2) }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>