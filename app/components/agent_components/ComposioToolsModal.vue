<script setup lang="ts">
const emit = defineEmits<{
    (event: "close"): void;
}>();

type ComposioConnectionResponse = {
    redirectUrl: string;
};

type ComposioToolkit = {
    slug: string;
    name: string;
    logo: string;
    isNoAuth: boolean;
    connection?: {
        isActive: boolean;
    };
};

type ComposioToolkitsResponse = {
    items: ComposioToolkit[];
    cursor?: string;
    totalPages?: number;
};

const isConnectedTab = ref(true);
const cursor = ref<string>();
const { data: toolkitsResponse, pending: isLoading, error, refresh: loadToolkits } = useFetch<ComposioToolkitsResponse>(
    "/api/composio/toolkits",
    {
        method: "POST",
        body: computed(() => ({
            isConnected: isConnectedTab.value,
            cursor: isConnectedTab.value ? undefined : cursor.value,
        })),
        server: false,
        watch: [isConnectedTab],
        default: () => ({ items: [] }),
    }
);
const toolkits = computed(() => toolkitsResponse.value?.items ?? []);
const hasNextPage = computed(() => !isConnectedTab.value && Boolean(toolkitsResponse.value?.cursor));
const errorMessage = computed(() => error.value?.message || "Failed to load Composio toolkits list.");
const selectedToolkitSlug = ref("");
const connectionErrorMessage = ref("");

const selectToolkitTab = (isConnected: boolean) => {
    cursor.value = undefined;
    isConnectedTab.value = isConnected;
};


const {
    data: connectionRequest,
    pending: isConnectingToolkit,
    error: connectionRequestError,
    execute: createConnectionRequest,
    clear: clearConnectionRequest,
} = useFetch<ComposioConnectionResponse>(
    () => `/api/composio/toolkits/${selectedToolkitSlug.value}/connect`,
    {
        method: "POST",
        immediate: false,
        server: false,
        watch: false,
    }
);

const connectToolkit = async (toolkitSlug: string) => {
    selectedToolkitSlug.value = toolkitSlug;
    connectionErrorMessage.value = "";
    clearConnectionRequest();

    await createConnectionRequest();

    if (connectionRequestError.value) {
        connectionErrorMessage.value = connectionRequestError.value.message || "Failed to create connection request.";
        return;
    }

    if (!connectionRequest.value?.redirectUrl) {
        connectionErrorMessage.value = "Failed to create connection request.";
        return;
    }

    window.location.href = connectionRequest.value.redirectUrl;
};

const loadNextToolkits = async () => {
    if (!toolkitsResponse.value?.cursor) return;

    cursor.value = toolkitsResponse.value.cursor;
    await loadToolkits();
};
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
        <div class="w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
            <div class="flex items-start justify-between gap-4 border-b border-border bg-background/40 px-6 py-5">
                <div>
                    <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">Agent integrations</p>
                    <h2 class="mt-1 text-xl font-semibold text-foreground">Composio Toolkits</h2>
                    <p class="mt-1 text-sm text-muted-foreground">
                        {{ toolkits.length }} {{ isConnectedTab ? "connected" : "unconnected" }} toolkit{{
                            toolkits.length === 1 ? "" : "s" }}
                    </p>
                </div>
                <button type="button"
                    class="rounded-full border border-border bg-card px-2 py-1  text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    @click="emit('close')" aria-label="Close toolkits list">
                    <i class="pi pi-times"></i>
                </button>
            </div>

            <div class="max-h-[70vh] overflow-y-auto px-6 py-5">
                <div v-if="connectionErrorMessage"
                    class="mb-4 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    {{ connectionErrorMessage }}
                </div>

                <div class="mb-5 grid grid-cols-2 rounded-2xl border border-border bg-background p-1.5">
                    <button type="button"
                        :class="['rounded-xl px-4 py-2.5 text-sm font-medium transition', isConnectedTab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground']"
                        @click="selectToolkitTab(true)">
                        Connected
                    </button>
                    <button type="button"
                        :class="['rounded-xl px-4 py-2.5 text-sm font-medium transition', !isConnectedTab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground']"
                        @click="selectToolkitTab(false)">
                        Unconnected
                    </button>
                </div>

                <div v-if="isLoading" class="space-y-3">
                    <article v-for="index in 6" :key="index"
                        class="flex gap-4 rounded-2xl border border-border bg-background p-4">
                        <div class="h-12 w-12 shrink-0 animate-pulse rounded-xl border border-border bg-accent"></div>
                        <div class="min-w-0 flex-1 space-y-3 py-1">
                            <div class="flex items-start justify-between gap-4">
                                <div class="space-y-2">
                                    <div class="h-4 w-36 animate-pulse rounded-full bg-accent"></div>
                                    <div class="h-3 w-24 animate-pulse rounded-full bg-accent"></div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="h-6 w-20 animate-pulse rounded-full bg-accent"></div>
                                    <div class="h-7 w-20 animate-pulse rounded-full bg-accent"></div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>

                <div v-else-if="error"
                    class="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    <p>{{ errorMessage }}</p>
                    <button type="button"
                        class="mt-3 rounded-full border border-destructive/30 px-3 py-1.5 text-xs transition hover:bg-destructive/10"
                        @click="loadToolkits()">
                        Try again
                    </button>
                </div>

                <div v-else-if="toolkits.length" class="space-y-3">
                    <article v-for="toolkit in toolkits" :key="toolkit.slug"
                        class="flex gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-accent/40">
                        <img :src="toolkit.logo" :alt="`${toolkit.name} logo`"
                            class="h-12 w-12 shrink-0 rounded-xl border border-border bg-card object-contain p-2">
                        <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-start justify-between gap-2">
                                <h3 class="text-sm font-semibold text-foreground">
                                    {{ toolkit.name }}
                                </h3>
                                <div class="flex items-center gap-2">
                                    <span :class="[
                                        'rounded-full px-3 py-1 text-xs',
                                        toolkit.connection?.isActive
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                            : 'bg-accent text-muted-foreground'
                                    ]">
                                        {{ toolkit.connection?.isActive ? "Connected" : "Not connected" }}
                                    </span>
                                    <button type="button"
                                        class="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                                        :disabled="(selectedToolkitSlug === toolkit.slug && isConnectingToolkit) || toolkit.isNoAuth || toolkit.connection?.isActive"
                                        @click="connectToolkit(toolkit.slug)">
                                        <span v-if="toolkit.connection?.isActive">Connected</span>
                                        <span v-else-if="toolkit.isNoAuth">No auth</span>
                                        <span
                                            v-else-if="selectedToolkitSlug === toolkit.slug && isConnectingToolkit">Connecting...</span>
                                        <span v-else>Connect</span>
                                    </button>
                                </div>
                            </div>
                            <p class="mt-1 text-xs text-muted-foreground">
                                {{ toolkit.slug }}
                            </p>
                        </div>
                    </article>

                    <div v-if="hasNextPage" class="flex justify-end pt-2">
                        <button type="button"
                            class="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="isLoading" @click="loadNextToolkits">
                            Next
                        </button>
                    </div>
                </div>

                <div v-else
                    class="rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
                    No {{ isConnectedTab ? "connected" : "unconnected" }} toolkits were returned.
                </div>
            </div>
        </div>
    </div>
</template>