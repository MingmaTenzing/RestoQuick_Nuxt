<script setup lang="ts">
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
const chatViewport = useTemplateRef<HTMLDivElement>('chatViewport')
const hasConversation = computed(() => messages.value.length > 0)

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
    <div class="h-full">

        <main
            :class="['flex h-full w-full flex-col justify-center items-center', !hasConversation ? 'gap-12' : 'gap-6']">
            <div v-if="!hasConversation">
                <h1 class="text-3xl">Hi, How can I Assist You?</h1>
            </div>
            <div v-else class="flex min-h-0 w-full max-w-6xl flex-1 overflow-y-scroll">
                <div ref="chatViewport" class="flex w-full flex-col gap-8">
                    <div v-for="message in messages" :key="message.id" :data-message-id="message.id"
                        :class="['flex items-start ', message.role === 'assistant' ? 'justify-start' : 'justify-end']">
                        <div
                            :class="['p-4 text-base prose dark:prose-invert max-w-none', message.role === 'assistant' ? 'max-w-[70%] [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:leading-7 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1' : 'bg-secondary text-secondary-foreground rounded-full']">
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
            <div :class="['flex items-center justify-center ', !hasConversation ? 'w-3xl' : 'w-6xl']">
                <form class="w-full  rounded-4xl border border-border bg-card/95 p-2 " @submit.prevent="sendMessage()">
                    <div class="flex items-center gap-3 rounded-[1.6rem]   px-2 py-2">
                        <textarea v-model="draftMessage" rows="1" placeholder="Message RestoQuick Agent"
                            class="max-h-40 min-h-7 flex-1 resize-none  text-base text-foreground outline-none placeholder:text-muted-foreground"
                            @keydown.enter.exact.prevent="sendMessage()" />

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

.prose table {
    width: 100%;
    border-collapse: collapse;
}

.prose th,
.prose td {
    border: 1px solid #d1d5db;
    padding: 0.75rem;
    text-align: left;
}

.prose th {
    font-weight: 600;
}
</style>