<script lang="ts" setup>
defineProps<{
    table: {
        id: string
        number: string
        capacity: number
    }
    isAssigning?: boolean
}>()

defineEmits<{
    close: []
    assign: []
}>()
</script>


<template>
    <div class="w-full max-w-md rounded-4xl border border-border bg-card p-6 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
            <div>
                <p class="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Assign table</p>
                <h2 class="mt-1 text-2xl font-semibold text-foreground">Table {{ table.number }}</h2>
                <p class="mt-2 text-sm leading-6 text-muted-foreground">
                    This table is not active yet. Assign it to start the dining session.
                </p>
            </div>
            <button type="button"
                class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                @click="$emit('close')">
                <span class="text-sm font-medium leading-none">x</span>
            </button>
        </div>

        <div class="mt-5 rounded-3xl border border-border bg-accent/30 p-4">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <p class="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">Capacity</p>
                    <p class="mt-1 text-sm font-medium text-foreground">{{ table.capacity }} seats</p>
                </div>
                <div
                    class="inline-flex items-center gap-2 rounded-2xl bg-background px-3.5 py-2 text-sm font-medium text-foreground shadow-sm">
                    <i class="pi pi-users text-xs text-muted-foreground"></i>
                    <span>{{ table.capacity }}</span>
                </div>
            </div>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button"
                class="inline-flex items-center justify-center rounded-2xl border border-border px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-70"
                :disabled="isAssigning" @click="$emit('close')">
                Cancel
            </button>
            <button type="button"
                class="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70"
                :disabled="isAssigning" @click="$emit('assign')">
                {{ isAssigning ? 'Assigning...' : 'Assign Table' }}
            </button>
        </div>
    </div>
</template>