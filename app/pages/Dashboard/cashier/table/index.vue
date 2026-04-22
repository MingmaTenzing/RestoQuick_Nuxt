<script setup lang="ts">
definePageMeta({
    layout: 'dashboard-layout'
})

import { computed, ref } from 'vue'
import type { TableGetPayloadWithSession } from '~~/types/table_include_session'
import Table_Card from '~/components/pos_components/Table_Card.vue'
import TableCardSkeleton from '~/components/pos_components/TableCardSkeleton.vue'


const router = useRouter()

const searchQuery = ref('')

const { data: tables, pending: tablesPending } = await useFetch<TableGetPayloadWithSession[]>('/api/tables', {
    lazy: true
})

const searchFilteredTables = computed(() => {
    const allTables = tables.value ?? []
    const normalizedQuery = searchQuery.value.trim().toLowerCase()

    if (!normalizedQuery) {
        return allTables
    }

    return allTables.filter((table) => {
        return table.number.toLowerCase().includes(normalizedQuery) || String(table.capacity).includes(normalizedQuery)
    })
})

const activeSessionCount = computed(() => {
    const allTables = tables.value ?? []

    return allTables.filter((table) => table.sessions.length > 0).length
})

function openTableCheckout(table_session_id: string) {
    router.push(`/dashboard/cashier/table/checkout/${table_session_id}`)
}

function hasActiveSession(table: TableGetPayloadWithSession) {
    return table.sessions.length > 0
}


</script>

<template>
    <main class="space-y-8">
        <section class="px-1 pt-2">
            <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div class="max-w-3xl space-y-4">
                    <div class="inline-flex items-center gap-3">
                        <p class="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80">Cashier</p>
                    </div>

                    <div class="space-y-3">
                        <h1 class="text-2xl md:text-5xl">Choose an active table session.</h1>

                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-3 lg:justify-end">
                    <div
                        class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm">
                        <span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                        <span>{{ activeSessionCount }} active session{{ activeSessionCount !== 1 ? 's' : '' }}</span>
                    </div>
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm text-foreground">
                        <i class="pi pi-th-large text-xs"></i>
                        <span>{{ tables?.length ?? 0 }} table{{ (tables?.length ?? 0) !== 1 ? 's' : '' }}</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="rounded-4xl border border-border bg-card p-5 shadow-sm md:p-6">
            <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <p class="text-sm font-medium text-foreground">Table overview</p>
                    <p class="mt-1 text-sm text-muted-foreground">Browse the floor and open the table checkout you need.
                    </p>
                </div>

                <div class="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                    <label class="relative block w-full max-w-md">
                        <span
                            class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                            <i class="pi pi-search text-sm"></i>
                        </span>
                        <input v-model="searchQuery" type="search" placeholder="Search by table number or capacity"
                            class="h-12 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20">
                    </label>

                    <div class="inline-flex items-center gap-2 rounded-2xl bg-accent px-3 py-2 text-sm text-foreground">
                        <i class="pi pi-th-large text-xs"></i>
                        <span>{{ searchFilteredTables.length }} of {{ tables?.length ?? 0 }} tables</span>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="tablesPending" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <TableCardSkeleton v-for="index in 8" :key="index" />
        </section>

        <section v-else-if="searchFilteredTables.length"
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button v-for="table in searchFilteredTables" :key="table.id" type="button"
                class="block h-full text-left transition-transform"
                :class="hasActiveSession(table) ? 'hover:-translate-y-0.5 cursor-pointer' : 'cursor-not-allowed opacity-80'"
                :disabled="!hasActiveSession(table)"
                @click="hasActiveSession(table) && openTableCheckout(table.sessions[0]?.id!)">
                <Table_Card :table="table" :is-active="table.sessions.length > 0" />
            </button>
        </section>

        <section v-else-if="tables?.length"
            class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <h2 class="text-xl font-semibold text-foreground">No matching tables</h2>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">
                Try another table number or search by seat capacity.
            </p>
        </section>

        <section v-else class="rounded-4xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <h2 class="text-xl font-semibold text-foreground">No tables available</h2>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">
                Add your tables first before starting a checkout.
            </p>
        </section>
    </main>
</template>