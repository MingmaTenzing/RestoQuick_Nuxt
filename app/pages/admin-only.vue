<template>
    <main
        class="relative isolate min-h-screen overflow-hidden bg-background px-6 py-16 text-foreground sm:px-10 lg:px-16">
        <div
            class="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

        <section class="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center">
            <div class="grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div class="space-y-6">
                    <p class="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                        Access restricted
                    </p>
                    <div class="h-px w-24 bg-border" />
                </div>

                <div class="max-w-2xl lg:justify-self-end lg:border-l lg:border-border lg:pl-12 xl:pl-16">
                    <h1
                        class="text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                        Only admin is allowed to view this page.
                    </h1>

                    <p class="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                        You do not have permission to open this area. Head back home to continue using the public parts
                        of the app.
                    </p>

                    <div class="mt-10">
                        <NuxtLink to="/"
                            class="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                            Go home
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </main>
</template>