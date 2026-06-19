<script setup lang="ts">
definePageMeta({
    layout: 'dashboard-layout'
})

import { computed, ref } from 'vue'
import type { TableSessionWithOrders } from '~~/types/table_session_with_orders'

type SessionStatusFilter = 'all' | 'active' | 'closed'

const selectedStatus = ref<SessionStatusFilter>('all')
const tableSearch = ref('')
const submittedTableSearch = ref('')

function submitTableSearch() {
    submittedTableSearch.value = tableSearch.value.trim()
}

const { data: sessions, status: sessionsStatus } = await useFetch<TableSessionWithOrders[]>('/api/table-sessions', {
    query: computed(() => ({
        ...(selectedStatus.value === 'all' ? {} : { status: selectedStatus.value }),
        ...(submittedTableSearch.value ? { table: submittedTableSearch.value } : {})
    })),
    watch: [selectedStatus, submittedTableSearch],
    lazy: true
})

const sessionList = computed(() => sessions.value ?? [])

const activeSessionCount = computed(() => {
    return sessionList.value.filter((session) => session.status === 'ACTIVE').length
})

const closedSessionCount = computed(() => {
    return sessionList.value.filter((session) => session.status === 'CLOSED').length
})

const totalOrderCount = computed(() => {
    return sessionList.value.reduce((total, session) => total + session.orders.length, 0)
})

const totalItemCount = computed(() => {
    return sessionList.value.reduce((total, session) => total + sessionItemCount(session), 0)
})

const totalSessionRevenueCents = computed(() => {
    return sessionList.value.reduce((sessionTotal, session) => {
        return sessionTotal + session.orders.reduce((orderTotal, order) => orderTotal + order.totalAmountCents, 0)
    }, 0)
})

function sessionTotalCents(session: TableSessionWithOrders) {
    return session.orders.reduce((total, order) => total + order.totalAmountCents, 0)
}

function sessionItemCount(session: TableSessionWithOrders) {
    return session.orders.reduce((total, order) => total + order.items.length, 0)
}
</script>

<template>
    <main class="space-y-5">
        <section class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div class="space-y-2">
                <p class="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Operations</p>
                <h1 class="text-2xl md:text-6xl">Table Sessions</h1>
                <p class="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Track active tables first, then open a session when you need the order breakdown.
                </p>
            </div>
        </section>

        <section class="rounded-3xl border border-border bg-card px-4 py-3 shadow-sm sm:px-5">
            <div v-if="sessionsStatus === 'pending'" class="flex flex-wrap gap-3">
                <span class="h-5 w-28 animate-pulse rounded-full bg-muted"></span>
                <span class="h-5 w-24 animate-pulse rounded-full bg-muted"></span>
                <span class="h-5 w-32 animate-pulse rounded-full bg-muted"></span>
            </div>
            <div v-else class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span><strong class="font-semibold text-foreground">{{ sessionList.length }}</strong> sessions</span>
                <span><strong class="font-semibold text-emerald-600">{{ activeSessionCount }}</strong> active</span>
                <span><strong class="font-semibold text-foreground">{{ totalItemCount }}</strong> items</span>
                <span><strong class="font-semibold text-foreground">{{ totalOrderCount }}</strong> orders</span>
                <span><strong class="font-semibold text-foreground">${{ (totalSessionRevenueCents / 100).toFixed(2)
                        }}</strong> sales</span>
            </div>
        </section>

        <section class="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-5">
            <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h2 class="text-lg font-semibold text-foreground">Sessions</h2>
                    <p class="text-sm text-muted-foreground">Open a session to inspect the orders inside it.</p>
                </div>

                <div class="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end">
                    <form class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center"
                        @submit.prevent="submitTableSearch">
                        <input v-model="tableSearch" type="search" placeholder="Search table number"
                            class="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring focus:ring-ring sm:min-w-64" />
                        <button type="submit"
                            class="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                            Search
                        </button>
                    </form>

                    <div class="flex flex-wrap items-center gap-2">
                        <button type="button" @click="selectedStatus = 'all'"
                            :class="selectedStatus === 'all' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent text-muted-foreground hover:bg-accent'"
                            class="rounded-full border px-4 py-2 text-sm transition-colors">
                            All
                        </button>
                        <button type="button" @click="selectedStatus = 'active'"
                            :class="selectedStatus === 'active' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent text-muted-foreground hover:bg-accent'"
                            class="rounded-full border px-4 py-2 text-sm transition-colors">
                            Active
                        </button>
                        <button type="button" @click="selectedStatus = 'closed'"
                            :class="selectedStatus === 'closed' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-transparent text-muted-foreground hover:bg-accent'"
                            class="rounded-full border px-4 py-2 text-sm transition-colors">
                            Closed
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section v-if="sessionsStatus === 'pending'" class="space-y-4">
            <div v-for="index in 4" :key="index" class="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div class="space-y-3">
                        <div class="h-8 w-40 animate-pulse rounded-2xl bg-muted"></div>
                        <div class="h-4 w-64 animate-pulse rounded-2xl bg-muted"></div>
                    </div>
                    <div class="h-10 w-32 animate-pulse rounded-2xl bg-muted"></div>
                </div>
            </div>
        </section>

        <section v-else-if="sessionList.length === 0"
            class="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center shadow-sm">
            <i class="pi pi-inbox mb-4 block text-4xl text-muted-foreground"></i>
            <h2 class="text-xl font-semibold text-foreground">No sessions found</h2>
            <p class="mt-2 text-sm text-muted-foreground">Try another table number or session filter.</p>
        </section>

        <section v-else class="space-y-3">
            <NuxtLink v-for="session in sessionList" :key="session.id" :to="`/dashboard/sessions/${session.id}`"
                class="block rounded-3xl border border-border bg-card p-5 text-left shadow-sm transition hover:border-primary/40 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring focus-visible:ring-ring sm:p-6">
                <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div class="min-w-0 space-y-3">
                        <div class="flex flex-wrap items-center gap-2">
                            <span
                                class="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-sm font-medium text-foreground">
                                <i class="pi pi-table text-xs text-muted-foreground"></i>
                                Table {{ session.table.number }}
                            </span>
                            <span
                                class="inline-flex items-center rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                {{ session.status.toLowerCase() }}
                            </span>
                        </div>

                        <div class="space-y-1">
                            <h3 class="text-2xl font-semibold leading-tight text-foreground sm:text-3xl">Table {{
                                session.table.number }}</h3>
                            <p v-if="session.status === 'ACTIVE'" class="text-sm text-muted-foreground">
                                Open since
                                <NuxtTime :datetime="session.openedAt" relative />
                            </p>
                            <p v-else class="text-sm text-muted-foreground">
                                Closed
                                <NuxtTime :datetime="session.closedAt ?? session.openedAt" relative />
                            </p>
                        </div>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-3 lg:min-w-96">
                        <div class="rounded-2xl border border-border bg-background/50 p-3">
                            <p class="text-xs font-medium text-muted-foreground">Items</p>
                            <p class="mt-1 text-2xl font-semibold text-foreground">{{ sessionItemCount(session) }}</p>
                        </div>
                        <div class="rounded-2xl border border-border bg-background/50 p-3">
                            <p class="text-xs font-medium text-muted-foreground">Orders</p>
                            <p class="mt-1 text-2xl font-semibold text-foreground">{{ session.orders.length }}</p>
                        </div>
                        <div class="rounded-2xl border border-border bg-background/50 p-3">
                            <p class="text-xs font-medium text-muted-foreground">Total</p>
                            <p class="mt-1 break-all text-2xl font-semibold text-foreground">
                                ${{ (sessionTotalCents(session) / 100).toFixed(2) }}
                            </p>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </section>
    </main>
</template>