<script lang="ts" setup>
import type { Table } from '~/generated/prisma/client'

defineProps<{
    table: Table
    isActive?: boolean
}>()
</script>


<template>
    <div class="flex h-full min-h-56 flex-col justify-between overflow-hidden rounded-4xl border bg-card shadow-sm transition-all"
        :class="isActive ? 'border-green-500/70 shadow-green-500/10 hover:border-green-500' : 'border-border hover:border-ring/60'">
        <div class="flex flex-1 flex-col gap-6 p-5 md:p-6">
            <div class="inline-flex w-fit items-center rounded-2xl px-3.5 py-1.5 text-sm font-medium"
                :class="isActive ? 'bg-green-500/10 text-green-700' : 'bg-accent text-foreground'">
                <span>{{ isActive ? 'Active' : 'Table' }}</span>
            </div>

            <div class="space-y-2">
                <h2 class="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">{{ table.number }}</h2>
                <p class="text-sm text-muted-foreground">{{ isActive ? 'This table currently has an active session.' :
                    'Ready for a new dining order.' }}</p>
            </div>
        </div>

        <div class="flex items-center justify-between gap-3 border-t px-5 py-4 md:px-6"
            :class="isActive ? 'border-green-500/20 bg-green-500/5' : 'border-border bg-accent/30'">
            <div>
                <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">{{ isActive ? 'Status' :
                    'Capacity' }}</p>
                <p class="mt-1 text-sm font-medium text-foreground">{{ isActive ? 'Occupied' : 'Seats available' }}</p>
            </div>

            <div class="inline-flex items-center gap-2 rounded-2xl bg-background px-3.5 py-2 text-sm font-medium shadow-sm"
                :class="isActive ? 'text-green-700' : 'text-foreground'">
                <i
                    :class="isActive ? 'pi pi-circle-fill text-[10px] text-green-500' : 'pi pi-users text-xs text-muted-foreground'"></i>
                <span>{{ isActive ? 'Active' : table.capacity }}</span>
            </div>
        </div>
    </div>
</template>