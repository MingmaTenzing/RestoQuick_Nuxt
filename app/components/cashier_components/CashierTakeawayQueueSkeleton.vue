<script setup lang="ts">
withDefaults(
    defineProps<{
        count?: number;
    }>(),
    {
        count: 6,
    },
);
</script>

<template>
    <section class="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <article v-for="index in count" :key="index" class="rounded-4xl border border-border bg-card p-6 shadow-sm">
            <div class="flex items-start justify-between gap-3">
                <div class="space-y-2">
                    <div class="h-3 w-14 animate-pulse rounded-full bg-muted/70" />
                    <div class="h-9 w-28 animate-pulse rounded-2xl bg-muted" />
                </div>

                <div class="h-7 w-20 animate-pulse rounded-full bg-amber-500/20" />
            </div>

            <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-2xl bg-secondary px-4 py-3">
                    <div class="h-3 w-16 animate-pulse rounded-full bg-muted/70" />
                    <div class="mt-2 h-4 w-24 animate-pulse rounded-full bg-muted" />
                </div>
                <div class="rounded-2xl bg-secondary px-4 py-3">
                    <div class="h-3 w-16 animate-pulse rounded-full bg-muted/70" />
                    <div class="mt-2 h-4 w-20 animate-pulse rounded-full bg-muted" />
                </div>
            </div>

            <div class="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div class="h-4 w-20 animate-pulse rounded-full bg-muted/70" />
                <div class="h-4 w-24 animate-pulse rounded-full bg-muted/70" />
            </div>

            <ul class="mt-5 space-y-3 border-t border-border pt-5">
                <li v-for="itemIndex in 3" :key="itemIndex" class="flex items-start justify-between gap-3">
                    <div class="min-w-0 flex-1 space-y-2">
                        <div class="h-4 w-4/5 animate-pulse rounded-full bg-muted" />
                        <div class="h-3 w-1/2 animate-pulse rounded-full bg-muted/70" />
                    </div>

                    <div class="h-4 w-14 animate-pulse rounded-full bg-muted/70" />
                </li>
            </ul>

            <div class="mt-5 flex justify-end border-t border-border pt-5">
                <div class="h-10 w-32 animate-pulse rounded-2xl bg-secondary" />
            </div>
        </article>
    </section>
</template>