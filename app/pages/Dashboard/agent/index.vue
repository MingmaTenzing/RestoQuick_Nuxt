<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

definePageMeta({
    layout: 'dashboard-layout',
    middleware: ['is-admin']
})

type ChatRole = 'assistant' | 'user'

type ChatMessage = {
    id: string
    role: ChatRole
    content: string
}

const messages = ref<ChatMessage[]>([

])


const draftMessage = ref('')
const isResponding = ref(false)
const responseError = ref('')
const isExternalToolsMenuOpen = ref(false)
const isComposioToolsModalOpen = ref(false)
const chatViewport = useTemplateRef<HTMLDivElement>('chatViewport')
const hasConversation = computed(() => messages.value.length > 0)

const ComposioToolsModal = defineAsyncComponent(
    () => import('~/components/agent_components/ComposioToolsModal.vue')
)

const openComposioToolsModal = () => {
    isExternalToolsMenuOpen.value = false
    isComposioToolsModalOpen.value = true
}

const scrollMessageToTop = async (messageId: string) => {
    await nextTick()

    const messageElement = chatViewport.value?.querySelector<HTMLElement>(`[data-message-id="${messageId}"]`)

    if (messageElement) {
        messageElement.scrollIntoView({ block: 'start' })
    }
}

const streamAssistantReply = async (assistantMessageId: string, userMessageId: string) => {
    //here assistanMessage_Id is required becuase we are streaming the response,
    // assistantMesageId will add the message to the correct index in the messages array and update the content as the stream progresses.
    const response = await $fetch<ReadableStream>('/api/restoquick-agent', {
        method: 'POST',
        // Exclude the trailing placeholder assistant message because it has no content yet.
        body: { messages: messages.value.slice(0, -1) },
        responseType: 'stream'
    })

    if (!response) {
        throw new Error('Streaming is not available for this response.')
    }

    const reader = response
        .pipeThrough(new TextDecoderStream())
        .getReader()

    while (true) {
        const { done, value } = await reader.read()

        if (done) {
            break
        }

        const assistantMessage = messages.value.find((message) => message.id === assistantMessageId)

        if (assistantMessage) {
            assistantMessage.content += value
        }

        await scrollMessageToTop(userMessageId)
    }
}

const sendMessage = async () => {
    const content = draftMessage.value.trim()

    if (!content || isResponding.value) {
        return
    }

    const userMessageId = `user-${crypto.randomUUID()}`

    messages.value.push({
        id: userMessageId,
        role: 'user',
        content
    })

    draftMessage.value = ''
    responseError.value = ''
    isResponding.value = true
    const assistantMessageId = `assistant-${crypto.randomUUID()}`

    messages.value.push({
        id: assistantMessageId,
        role: 'assistant',
        content: ''
    })

    await scrollMessageToTop(userMessageId)

    try {
        await streamAssistantReply(assistantMessageId, userMessageId)
    } catch (error) {
        responseError.value = error instanceof Error ? error.message : 'Failed to stream assistant response.'

        const assistantMessage = messages.value.find((message) => message.id === assistantMessageId)
        if (assistantMessage && !assistantMessage.content.trim()) {
            assistantMessage.content = responseError.value
        }
    } finally {
        isResponding.value = false
    }
}
</script>

<template>
    <div class="h-full min-h-0">

        <main :class="[
            'flex h-full min-h-0 w-full flex-col items-center px-2 py-3 sm:px-6 sm:py-6',
            !hasConversation ? 'justify-center gap-8 sm:gap-12' : 'gap-4 sm:gap-6'
        ]">
            <div v-if="!hasConversation" class="px-2 text-center">
                <h1 class="text-2xl sm:text-3xl">Hi, How can I Assist You?</h1>
            </div>
            <div v-else class="flex min-h-0 w-full max-w-6xl flex-1 overflow-y-auto">
                <div ref="chatViewport" class="flex w-full flex-col gap-8">
                    <div v-for="message in messages" :key="message.id" :data-message-id="message.id"
                        :class="['flex items-start ', message.role === 'assistant' ? 'justify-start' : 'justify-end']">
                        <div :class="[
                            'chat-markdown min-w-0 max-w-[88%] p-3 text-sm sm:max-w-[75%] sm:p-4 sm:text-base',
                            message.role === 'assistant'
                                ? 'overflow-hidden text-foreground'
                                : 'rounded-3xl bg-secondary text-secondary-foreground wrap-break-word'
                        ]">
                            <MDC v-if="message.role === 'assistant' && message.content" :key="message.id"
                                :value="message.content" tag="article" />
                            <div v-else-if="message.role === 'assistant'"
                                class="loading-dots flex items-center gap-1.5 py-2 p-2 rounded-lg bg-accent/50"
                                aria-label="Assistant is thinking" role="status">
                                <span class="loading-dot" />
                                <span class="loading-dot" />
                                <span class="loading-dot" />
                            </div>
                            <template v-else>
                                {{ message.content }}
                            </template>
                        </div>
                    </div>
                </div>

            </div>
            <div :class="['flex w-full items-center justify-center', !hasConversation ? 'max-w-3xl' : 'max-w-6xl']">
                <form class="w-full rounded-4xl border border-border bg-card/95 p-1.5 sm:p-2"
                    @submit.prevent="sendMessage()">
                    <div class="flex items-end gap-3 rounded-[1.6rem] px-1.5 py-1.5 sm:px-2 sm:py-2">
                        <textarea v-model="draftMessage" rows="1" placeholder="Message RestoQuick Agent"
                            class="min-h-10 max-h-40 flex-1 resize-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
                            @keydown.enter.exact.prevent="sendMessage()" />

                        <div class="relative shrink-0">
                            <button type="button"
                                class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
                                :aria-expanded="isExternalToolsMenuOpen" aria-label="Open tools menu"
                                @click="isExternalToolsMenuOpen = !isExternalToolsMenuOpen">
                                <i class="pi pi-plus text-sm"></i>
                            </button>

                            <div v-if="isExternalToolsMenuOpen"
                                class="absolute bottom-12 right-0 z-20 w-46 rounded-2xl border border-border bg-card p-2 shadow-xl">
                                <button type="button"
                                    class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-accent"
                                    @click="openComposioToolsModal">
                                    <span
                                        class="flex h-8 w-8 items-center justify-center rounded-full bg-background text-muted-foreground">
                                        <i class="pi pi-server text-xs"></i>
                                    </span>
                                    <span>
                                        <span class="block font-medium">External tools</span>
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button type="submit"
                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="!draftMessage.trim() || isResponding" aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" class="h-4 w-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </main>

        <ComposioToolsModal v-if="isComposioToolsModalOpen" @close="isComposioToolsModalOpen = false" />


    </div>
</template>

<style scoped>
.loading-dots {
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.loading-dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--muted-foreground) 78%, transparent);

    animation: chatgptDots 1.2s infinite ease-in-out;

    will-change: transform, opacity;
    transform: translateZ(0);
}

.loading-dot:nth-child(2) {
    animation-delay: 0.15s;
}

.loading-dot:nth-child(3) {
    animation-delay: 0.3s;
}

@keyframes chatgptDots {

    0%,
    80%,
    100% {
        transform: scale(0.75);
        opacity: 0.45;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}

.chat-markdown {
    max-width: 100%;
    color: var(--foreground);
    line-height: 1.65;
    overflow-wrap: anywhere;
}

.chat-markdown :deep(*) {
    min-width: 0;
}

.chat-markdown :deep(article > :first-child) {
    margin-top: 0;
}

.chat-markdown :deep(article > :last-child) {
    margin-bottom: 0;
}

.chat-markdown :deep(h1),
.chat-markdown :deep(h2),
.chat-markdown :deep(h3),
.chat-markdown :deep(h4),
.chat-markdown :deep(h5),
.chat-markdown :deep(h6) {
    margin: 1.25rem 0 0.55rem;
    color: var(--foreground);
    font-weight: 650;
    line-height: 1.25;
}

.chat-markdown :deep(h1) {
    font-size: 1.45rem;
}

.chat-markdown :deep(h2) {
    font-size: 1.2rem;
}

.chat-markdown :deep(h3) {
    font-size: 1.05rem;
}

.chat-markdown :deep(h4),
.chat-markdown :deep(h5),
.chat-markdown :deep(h6) {
    font-size: 1rem;
}

.chat-markdown :deep(p) {
    margin: 0.65rem 0;
}

.chat-markdown :deep(a) {
    color: var(--primary);
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--primary) 45%, transparent);
    text-underline-offset: 0.18em;
}

.chat-markdown :deep(a:hover) {
    text-decoration-color: var(--primary);
}

.chat-markdown :deep(strong) {
    color: var(--foreground);
    font-weight: 650;
}

.chat-markdown :deep(em) {
    color: color-mix(in srgb, var(--foreground) 86%, var(--muted-foreground));
}

.chat-markdown :deep(s) {
    color: var(--muted-foreground);
}

.chat-markdown :deep(hr) {
    height: 1px;
    margin: 1.35rem 0;
    border: 0;
    background: var(--border);
}

.chat-markdown :deep(blockquote) {
    margin: 0.85rem 0;
    border-left: 3px solid var(--border);
    padding: 0.05rem 0 0.05rem 0.9rem;
    color: var(--muted-foreground);
}

.chat-markdown :deep(blockquote p) {
    margin: 0.45rem 0;
}

.chat-markdown :deep(ul),
.chat-markdown :deep(ol) {
    margin: 0.65rem 0 0.65rem 1.35rem;
    padding: 0;
}

.chat-markdown :deep(ul) {
    list-style: disc;
}

.chat-markdown :deep(ol) {
    list-style: decimal;
}

.chat-markdown :deep(li) {
    margin: 0.25rem 0;
    padding-left: 0.15rem;
}

.chat-markdown :deep(li > p) {
    margin: 0.25rem 0;
}

.chat-markdown :deep(li > ul),
.chat-markdown :deep(li > ol) {
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
}

.chat-markdown :deep(input[type='checkbox']) {
    width: 0.95rem;
    height: 0.95rem;
    margin: 0 0.45rem 0.1rem -1.35rem;
    vertical-align: middle;
    accent-color: var(--primary);
}

.chat-markdown :deep(code) {
    border: 1px solid color-mix(in srgb, var(--border) 86%, transparent);
    border-radius: 0.4rem;
    background: var(--muted);
    padding: 0.12rem 0.35rem;
    color: var(--foreground);
    font-family: var(--font-mono);
    font-size: 0.88em;
}

.chat-markdown :deep(pre) {
    max-width: 100%;
    margin: 0.85rem 0;
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--card) 78%, var(--muted));
    padding: 0.9rem 1rem;
}

.chat-markdown :deep(pre code) {
    display: block;
    min-width: max-content;
    border: 0;
    background: transparent;
    padding: 0;
    color: inherit;
    font-size: 0.88rem;
    line-height: 1.65;
    white-space: pre;
}

.chat-markdown :deep(table) {
    display: block;
    width: 100%;
    max-width: 100%;
    margin: 0.9rem 0;
    overflow-x: auto;
    border-collapse: collapse;
    white-space: nowrap;
}

.chat-markdown :deep(th),
.chat-markdown :deep(td) {
    border: 1px solid var(--border);
    padding: 0.65rem 0.8rem;
    text-align: left;
    vertical-align: top;
}

.chat-markdown :deep(th) {
    background: var(--muted);
    font-weight: 600;
}

.chat-markdown :deep(td) {
    background: color-mix(in srgb, var(--card) 72%, transparent);
}

.chat-markdown :deep(img) {
    max-width: min(100%, 42rem);
    height: auto;
    margin: 0.85rem 0;
    border-radius: 0.9rem;
    border: 1px solid var(--border);
}

.chat-markdown :deep(kbd) {
    border: 1px solid var(--border);
    border-bottom-width: 2px;
    border-radius: 0.4rem;
    background: var(--muted);
    padding: 0.08rem 0.35rem;
    font-family: var(--font-mono);
    font-size: 0.82em;
}

.chat-markdown :deep(sup) {
    font-size: 0.72em;
    line-height: 0;
}
</style>