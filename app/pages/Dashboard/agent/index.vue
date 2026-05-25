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

const starterPrompts = [
    'Generate a dinner menu from the stock on hand',
    'Review low-stock items and draft a supplier reorder list',
    'Summarise this week\'s staffing gaps and suggest updates',
    'Create a launch checklist for tomorrow\'s lunch service'
]

const messages = ref<ChatMessage[]>([
    {
        id: 'assistant-welcome',
        role: 'assistant',
        content:
            'Welcome to RestoQuick Assistant. Ask about bookings, orders, stock, roster planning, or table operations and the response will stream here live.'
    }
])

const draftMessage = ref('')
const isResponding = ref(false)
const responseError = ref('')
const chatViewport = useTemplateRef<HTMLDivElement>('chatViewport')

const scrollChatToBottom = async () => {
    await nextTick()

    if (chatViewport.value) {
        chatViewport.value.scrollTop = chatViewport.value.scrollHeight
    }
}

const streamAssistantReply = async (content: string, assistantMessageId: string) => {
    const response = await $fetch<ReadableStream>('/api/restoquick-agent', {
        method: 'POST',
        body: { message: content },
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

        await scrollChatToBottom()
    }
}

const sendMessage = async (value?: string) => {
    const content = (value ?? draftMessage.value).trim()

    if (!content || isResponding.value) {
        return
    }

    messages.value.push({
        id: `user-${crypto.randomUUID()}`,
        role: 'user',
        content
    })

    draftMessage.value = ''
    responseError.value = ''
    isResponding.value = true
    await scrollChatToBottom()

    const assistantMessageId = `assistant-${crypto.randomUUID()}`

    messages.value.push({
        id: assistantMessageId,
        role: 'assistant',
        content: ''
    })

    try {
        await streamAssistantReply(content, assistantMessageId)
    } catch (error) {
        responseError.value = error instanceof Error ? error.message : 'Failed to stream assistant response.'

        const assistantMessage = messages.value.find((message) => message.id === assistantMessageId)
        if (assistantMessage && !assistantMessage.content.trim()) {
            assistantMessage.content = responseError.value
        }
    } finally {
        isResponding.value = false
        await scrollChatToBottom()
    }
}

onMounted(() => {
    scrollChatToBottom()
})
</script>

<template>
    <main class="mx-auto flex min-h-full w-full max-w-[60vw] flex-col gap-6">
        <section class="rounded-4xl border border-border bg-card/70 px-6 py-5 shadow-sm backdrop-blur md:px-8">
            <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div class="space-y-2">
                    <p class="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Operations copilot
                    </p>
                    <h1 class="text-3xl font-semibold tracking-tight md:text-4xl">RestoQuick Assistant</h1>
                    <p class="max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                        Ask for operational summaries, draft actions, or workflow suggestions across bookings, orders,
                        stock, roster, and tables.
                    </p>
                </div>

                <div class="rounded-3xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                    Responses stream live as the model generates them.
                </div>
            </div>
        </section>

        <section class="flex min-h-[76dvh] flex-1 flex-col bg-background">
            <div ref="chatViewport" class="flex-1 space-y-6 overflow-y-auto px-4 py-6 pb-40 md:px-8">
                <div class="mx-auto flex max-w-full flex-wrap gap-2 pb-2">
                    <button v-for="prompt in starterPrompts" :key="prompt" type="button"
                        class="rounded-full bg-card px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="isResponding" @click="sendMessage(prompt)">
                        {{ prompt }}
                    </button>
                </div>

                <div v-for="message in messages" :key="message.id" class="mx-auto flex max-w-full"
                    :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                    <article class="max-w-[85%] rounded-3xl px-5 py-4"
                        :class="message.role === 'user' ? 'border border-primary bg-primary text-primary-foreground' : 'border border-border bg-card text-card-foreground'">
                        <p v-if="message.role === 'user'" class="text-sm leading-7 md:text-[15px]">{{ message.content }}
                        </p>
                        <MDC v-else :value="message.content" tag="div"
                            class="text-sm leading-7 md:text-[15px] [&_code]:rounded-md [&_code]:bg-background/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-background/80 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-5" />
                    </article>
                </div>

                <div v-if="isResponding" class="mx-auto flex max-w-full justify-start">
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground">
                        <i class="pi pi-spin pi-spinner text-xs"></i>
                        Streaming response...
                    </div>
                </div>

                <div v-if="responseError" class="mx-auto flex max-w-full justify-start">
                    <div
                        class="rounded-3xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {{ responseError }}
                    </div>
                </div>
            </div>

            <form class="sticky bottom-0 md:px-8" @submit.prevent="sendMessage()">
                <div class="mx-auto max-w-full">
                    <div class="rounded-3xl bg-card p-4 shadow-sm">
                        <textarea v-model="draftMessage" rows="3"
                            class="w-full resize-none bg-transparent pr-14 text-sm leading-7 text-foreground outline-none placeholder:text-muted-foreground"
                            placeholder="Message RestoQuick Assistant..."></textarea>

                        <div class=" flex justify-end">
                            <button type="submit"
                                class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                                aria-label="Send message" :disabled="!draftMessage.trim() || isResponding">
                                <i class="pi pi-arrow-up text-sm"></i>
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </section>
    </main>
</template>