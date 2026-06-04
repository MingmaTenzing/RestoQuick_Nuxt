<script setup lang="ts">
definePageMeta({
    layout: 'dashboard-layout',
    middleware: 'is-admin',
})

import { getStaffInitials } from '~/client_utils/staff_avatar'
import type { Prisma, WeekDay } from '~/generated/prisma/client'

type StaffDetailsPayload = Prisma.StaffGetPayload<{
    include: {
        shifts: true
        leaveRequests: true
    }
}>

const route = useRoute()
const staffId = computed(() => String(route.params.staff_id ?? ''))
const { startOfWeek, endOfWeek } = useWeekNavigation()

const weekDays = [
    { label: 'Mon', short: 'M', value: 'MON' },
    { label: 'Tue', short: 'T', value: 'TUE' },
    { label: 'Wed', short: 'W', value: 'WED' },
    { label: 'Thu', short: 'T', value: 'THU' },
    { label: 'Fri', short: 'F', value: 'FRI' },
    { label: 'Sat', short: 'S', value: 'SAT' },
    { label: 'Sun', short: 'S', value: 'SUN' },
] as const

const weekQuery = computed(() => ({
    startDate: startOfWeek.value.toISOString(),
    endDate: endOfWeek.value.toISOString(),
}))

const { data: staff, status: staffStatus } = await useFetch<StaffDetailsPayload | null>(
    () => `/api/staff/${staffId.value}`,
    {
        query: weekQuery,
    },
)
const isStaffLoading = computed(() => staffStatus.value === 'idle')

const formatLabel = (value: string) => {
    return value.replace(/_/g, ' ')
}

const calculateShiftHours = (startTime: string, endTime: string) => {
    const [startHours = 0, startMinutes = 0] = startTime.split(':').map(Number)
    const [endHours = 0, endMinutes = 0] = endTime.split(':').map(Number)
    const startTotalMinutes = startHours * 60 + startMinutes
    const endTotalMinutes = endHours * 60 + endMinutes
    const durationMinutes = endTotalMinutes >= startTotalMinutes
        ? endTotalMinutes - startTotalMinutes
        : endTotalMinutes + 24 * 60 - startTotalMinutes

    return durationMinutes / 60
}

const calculateShiftCost = (startTime: string, endTime: string) => {
    if (!staff.value) return 0
    return calculateShiftHours(startTime, endTime) * Number(staff.value.perHourRate)
}

const staffWeeklyShifts = computed(() => staff.value?.shifts ?? [])

const shiftCostThisWeek = computed(() => {
    return staffWeeklyShifts.value.reduce((total, shift) => {
        return total + calculateShiftCost(shift.startTime, shift.endTime)
    }, 0)
})

const statCards = computed(() => {
    return [
        {
            label: 'Shifts this week',
            value: String(staffWeeklyShifts.value.length),
            note: 'Returned directly by the backend',
        },
        {
            label: 'Shift cost',
            value: `$${shiftCostThisWeek.value.toFixed(2)}`,
            note: 'Total for this week',
        },
        {
            label: 'Leave requests',
            value: String(staff.value?.leaveRequests.length ?? 0),
            note: 'Pending requests only',
        },

    ]
})
</script>

<template>
    <main class="space-y-6">
        <section class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <i class="pi pi-angle-left text-xs"></i>
            <NuxtLink to="/dashboard/staff">Staff</NuxtLink>
        </section>

        <section v-if="isStaffLoading" class="space-y-5">
            <div class="h-12 w-64 animate-pulse rounded-full bg-muted"></div>
            <div class="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                <div class="h-112 animate-pulse rounded-3xl border border-border bg-card"></div>
                <div class="space-y-5">
                    <div class="h-56 animate-pulse rounded-3xl border border-border bg-card"></div>
                    <div class="h-64 animate-pulse rounded-3xl border border-border bg-card"></div>
                </div>
            </div>
        </section>

        <section v-else-if="!staff"
            class="rounded-3xl border border-dashed border-border bg-card px-6 py-12 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <i class="pi pi-user text-xl"></i>
            </div>
            <h1 class="mt-4 text-2xl font-semibold text-foreground">Staff member not found</h1>
            <p class="mt-2 text-sm text-muted-foreground">The profile could not be loaded for this staff ID.</p>
            <NuxtLink to="/dashboard/staff"
                class="mt-6 inline-flex items-center rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                Back to staff list
            </NuxtLink>
        </section>

        <section v-else class="space-y-6">
            <div class="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div class="flex items-start gap-4">
                        <div class="shrink-0">
                            <NuxtImg v-if="staff.profile_photo_url" :src="staff.profile_photo_url"
                                class="h-20 w-20 rounded-full border border-border object-cover" />
                            <div v-else
                                class="flex h-20 w-20 items-center justify-center rounded-full border border-border bg-muted text-xl font-semibold text-foreground">
                                {{ getStaffInitials(staff) }}
                            </div>
                        </div>

                        <div class="space-y-2">
                            <p class="text-sm text-muted-foreground">{{ formatLabel(staff.role) }} • {{
                                formatLabel(staff.employmentType) }}</p>
                            <h1 class="text-3xl font-semibold tracking-tight text-foreground">
                                {{ staff.firstname }} {{ staff.lastName }}
                            </h1>
                            <p class="text-sm text-muted-foreground">
                                Joined
                                <NuxtTime :datetime="staff.joined_date" /> • ${{ Number(staff.perHourRate).toFixed(2)
                                }}/hr
                            </p>
                        </div>
                    </div>

                    <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[24rem]">
                        <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                            <p class="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                            <a :href="`mailto:${staff.email}`"
                                class="mt-1 block break-all text-foreground hover:underline">
                                {{ staff.email }}
                            </a>
                        </div>
                        <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                            <p class="text-xs uppercase tracking-wide text-muted-foreground">Phone</p>
                            <a :href="`tel:${staff.phone}`" class="mt-1 block text-foreground hover:underline">
                                {{ staff.phone }}
                            </a>
                        </div>
                    </div>
                </div>

                <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <article v-for="card in statCards" :key="card.label"
                        class="rounded-2xl border border-border bg-secondary/50 p-4">
                        <p class="text-xs uppercase tracking-wide text-muted-foreground">{{ card.label }}</p>
                        <p class="mt-2 text-2xl font-semibold text-foreground">{{ card.value }}</p>
                        <p class="mt-1 text-sm text-muted-foreground">{{ card.note }}</p>
                    </article>
                </div>
            </div>

            <div class="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.85fr)]">
                <section class="space-y-6">
                    <div class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div class="flex items-center justify-between border-b border-border px-6 py-5">
                            <div>
                                <p class="text-xs uppercase tracking-wide text-muted-foreground">This week</p>
                                <h2 class="mt-1 text-xl font-semibold text-foreground">Shifts this week</h2>
                            </div>
                            <span class="text-sm text-muted-foreground">{{ staffWeeklyShifts.length }}</span>
                        </div>

                        <div v-if="staffWeeklyShifts.length === 0" class="px-6 py-10 text-center">
                            <p class="text-sm text-muted-foreground">No rostered shifts this week.</p>
                        </div>

                        <div v-else class="space-y-3 p-6">
                            <article v-for="shift in staffWeeklyShifts" :key="shift.id"
                                class="grid gap-4 rounded-2xl border border-border bg-secondary/50 p-4 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:items-center">
                                <div>
                                    <p class="text-xs uppercase tracking-wide text-muted-foreground">Day</p>
                                    <p class="mt-1 font-medium text-foreground">
                                        <NuxtTime :datetime="shift.date" weekday="short" day="numeric" month="short" />
                                    </p>
                                </div>

                                <div>
                                    <p class="font-medium text-foreground">{{ shift.startTime }} - {{ shift.endTime }}
                                    </p>
                                    <p class="mt-1 text-sm text-muted-foreground">{{ shift.position }}</p>
                                </div>

                                <div class="text-right">
                                    <p class="text-xs uppercase tracking-wide text-muted-foreground">Cost</p>
                                    <p class="mt-1 font-medium text-foreground">
                                        ${{ calculateShiftCost(shift.startTime, shift.endTime).toFixed(2) }}
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div class="border-b border-border px-6 py-5">
                            <p class="text-xs uppercase tracking-wide text-muted-foreground">Availability</p>
                            <h2 class="mt-1 text-xl font-semibold text-foreground">Preferred work pattern</h2>
                        </div>

                        <div class="flex flex-wrap gap-2 p-6">
                            <span v-for="day in weekDays" :key="day.value"
                                class="rounded-full border px-3 py-1.5 text-sm" :class="staff.availability.includes(day.value as WeekDay)
                                    ? 'border-border bg-secondary/50 text-foreground'
                                    : 'border-dashed border-border bg-muted/40 text-muted-foreground'">
                                {{ day.label }}
                            </span>
                        </div>
                    </div>
                </section>

                <aside class="space-y-6">
                    <div class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div class="border-b border-border px-6 py-5">
                            <p class="text-xs uppercase tracking-wide text-muted-foreground">Profile notes</p>
                            <h2 class="mt-1 text-xl font-semibold text-foreground">Employment details</h2>
                        </div>

                        <div class="space-y-3 p-6">
                            <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                                <p class="text-xs uppercase tracking-wide text-muted-foreground">Role</p>
                                <p class="mt-1 font-medium text-foreground">{{ formatLabel(staff.role) }}</p>
                            </div>
                            <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                                <p class="text-xs uppercase tracking-wide text-muted-foreground">Employment type</p>
                                <p class="mt-1 font-medium text-foreground">{{ formatLabel(staff.employmentType) }}</p>
                            </div>
                            <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                                <p class="text-xs uppercase tracking-wide text-muted-foreground">Hourly rate</p>
                                <p class="mt-1 font-medium text-foreground">${{ Number(staff.perHourRate).toFixed(2)
                                }}/hour</p>
                            </div>
                            <div class="rounded-2xl border border-border bg-secondary/50 p-4">
                                <p class="text-xs uppercase tracking-wide text-muted-foreground">Joined</p>
                                <p class="mt-1 font-medium text-foreground">
                                    <NuxtTime :datetime="staff.joined_date" />
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                        <div class="border-b border-border px-6 py-5">
                            <p class="text-xs uppercase tracking-wide text-muted-foreground">Leave log</p>
                            <h2 class="mt-1 text-xl font-semibold text-foreground">Recent requests</h2>
                        </div>

                        <div v-if="staff.leaveRequests.length === 0" class="px-6 py-10 text-center">
                            <p class="text-sm text-muted-foreground">No leave requests found.</p>
                        </div>

                        <div v-else class="space-y-3 p-6">
                            <article v-for="request in staff.leaveRequests" :key="request.id"
                                class="rounded-2xl border border-border bg-secondary/50 p-4">
                                <div class="flex items-start justify-between gap-3">
                                    <div>
                                        <p class="text-sm font-medium text-foreground">
                                            <NuxtTime :datetime="request.startDate" day="2-digit" month="short"
                                                year="numeric" />
                                            -
                                            <NuxtTime :datetime="request.endDate" day="2-digit" month="short"
                                                year="numeric" />
                                        </p>
                                        <p class="mt-1 text-xs text-muted-foreground">
                                            Submitted
                                            <NuxtTime :datetime="request.submittedAt" day="2-digit" month="short"
                                                year="numeric" hour="2-digit" minute="2-digit" />
                                        </p>
                                    </div>
                                    <span class="rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide"
                                        :class="request.status === 'approved'
                                            ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                                            : request.status === 'rejected'
                                                ? 'border-red-500/20 bg-red-500/10 text-red-600'
                                                : 'border-amber-500/20 bg-amber-500/10 text-amber-600'">
                                        {{ request.status }}
                                    </span>
                                </div>
                                <p class="mt-3 text-sm text-muted-foreground">{{ request.reason }}</p>
                            </article>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    </main>
</template>
