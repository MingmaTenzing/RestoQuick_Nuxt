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
    <div class="h-full">

        <main
            :class="['flex h-full w-full flex-col justify-center items-center', !hasConversation ? 'gap-4' : 'gap-6']">
            <div v-if="!hasConversation">
                <h1 class="text-3xl">Hi, How can I Assist You?</h1>
            </div>
            <div v-else class="flex min-h-0 w-full max-w-6xl flex-1 overflow-y-scroll">
                <div ref="chatViewport" class="flex w-full flex-col gap-8">
                    <div v-for="message in messages" :key="message.id"
                        :class="['flex items-start ', message.role === 'assistant' ? 'justify-start' : 'justify-end']">
                        <div
                            :class="['p-4 text-base', message.role === 'assistant' ? 'max-w-[70%] [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-1 [&_p]:leading-7 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-1' : 'bg-secondary text-secondary-foreground rounded-full']">
                            <MDC v-if="message.role === 'assistant'" :value="message.content" tag="article" />
                            <template v-else>
                                {{ message.content }}
                            </template>
                        </div>
                    </div>
                </div>

            </div>
            <div :class="['flex items-center justify-center ', !hasConversation ? 'w-3xl' : 'w-6xl']">
                <form
                    class="w-full  rounded-4xl border border-border bg-card/95 p-2 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur"
                    @submit.prevent="sendMessage()">
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