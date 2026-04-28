<template>
    <div
        class="flex h-full min-h-55 flex-col justify-between overflow-hidden rounded-4xl border border-border bg-card shadow-sm">
        <div class="flex flex-1 flex-col gap-6 p-5 md:p-6">
            <div class="h-8 w-24 animate-pulse rounded-2xl bg-accent" />

            <div class="space-y-3">
                <div class="h-12 w-24 animate-pulse rounded-2xl bg-muted md:h-14 md:w-28" />
                <div class="space-y-2">
                    <div class="h-4 w-48 animate-pulse rounded-full bg-muted/80" />
                    <div class="h-4 w-36 animate-pulse rounded-full bg-muted/70" />
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between gap-3 border-t border-border bg-accent/30 px-5 py-4 md:px-6">
            <div class="space-y-2">
                <div class="h-3 w-16 animate-pulse rounded-full bg-muted/70" />
                <div class="h-4 w-24 animate-pulse rounded-full bg-muted/80" />
            </div>

            <div class="inline-flex items-center gap-2 rounded-2xl bg-background px-3.5 py-2 shadow-sm">
                <div class="h-3 w-3 animate-pulse rounded-full bg-muted/70" />
                <div class="h-4 w-10 animate-pulse rounded-full bg-muted/80" />
            </div>
        </div>
    </div>
</template>