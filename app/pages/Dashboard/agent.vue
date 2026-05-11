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

const cannedReplies = [
    'I can turn that into a workflow. Once the backend is wired, this panel can inspect stock, menu performance, staff coverage, and open tasks before returning a plan.',
    'This workspace is set up to feel like an operations copilot: one conversation, multiple restaurant systems, and clear actions before anything is applied.',
    'The final version can branch from chat into guided automations like menu generation, stock updates, roster adjustments, and service prep summaries.'
]

const messages = ref<ChatMessage[]>([
    {
        id: 'assistant-welcome',
        role: 'assistant',
        content:
            'Welcome to RestoQuick Assistant. This is a simple chat template for future automations like menu creation, stock updates, and staff changes.'
    },
    {
        id: 'user-example',
        role: 'user',
        content: 'Can you create a new seasonal menu draft from ingredients already in stock and flag anything we need to buy first?'
    },
    {
        id: 'assistant-example',
        role: 'assistant',
        content:
            'Yes. I would first inspect current stock, identify high-turn ingredients, propose a menu draft around those items, and separate missing ingredients into a purchasing list for approval.'
    }
])

const draftMessage = ref('')
const isResponding = ref(false)
const chatViewport = useTemplateRef<HTMLDivElement>('chatViewport')

const scrollChatToBottom = async () => {
    await nextTick()

    if (chatViewport.value) {
        chatViewport.value.scrollTop = chatViewport.value.scrollHeight
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
    isResponding.value = true
    await scrollChatToBottom()

    const reply = cannedReplies[(messages.value.length + content.length) % cannedReplies.length]
        ?? 'I can help draft that workflow once backend actions are connected.'

    messages.value.push({
        id: `assistant-${crypto.randomUUID()}`,
        role: 'assistant',
        content: reply
    })

    isResponding.value = false
    await scrollChatToBottom()
}

onMounted(() => {
    scrollChatToBottom()
})
</script>

<template>
    <main class="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-6">


        <section class="flex min-h-[76dvh] flex-1 flex-col bg-background">
            <div ref="chatViewport" class="flex-1 space-y-6 overflow-y-auto px-4 py-6 pb-40 md:px-8">
                <div class="mx-auto flex max-w-3xl flex-wrap gap-2 pb-2">
                    <button v-for="prompt in starterPrompts" :key="prompt" type="button"
                        class="rounded-full bg-card px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent"
                        @click="sendMessage(prompt)">
                        {{ prompt }}
                    </button>
                </div>

                <div v-for="message in messages" :key="message.id" class="mx-auto flex max-w-3xl"
                    :class="message.role === 'user' ? 'justify-end' : 'justify-start'">
                    <article class="max-w-[85%] rounded-3xl px-5 py-4"
                        :class="message.role === 'user' ? 'border border-primary bg-primary text-primary-foreground' : 'border border-border bg-card text-card-foreground'">
                        <p class="text-sm leading-7 md:text-[15px]">{{ message.content }}</p>
                    </article>
                </div>

                <div v-if="isResponding" class="mx-auto flex max-w-3xl justify-start">
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm text-muted-foreground">
                        <i class="pi pi-spin pi-spinner text-xs"></i>
                        Drafting response...
                    </div>
                </div>
            </div>

            <form class="sticky bottom-0 bg-background/95 px-4 py-4 backdrop-blur md:px-8"
                @submit.prevent="sendMessage()">
                <div class="mx-auto max-w-3xl">
                    <div class="rounded-3xl bg-card p-3 shadow-sm">
                        <textarea v-model="draftMessage" rows="3"
                            class="w-full resize-none bg-transparent pr-14 text-sm leading-7 text-foreground outline-none placeholder:text-muted-foreground"
                            placeholder="Message RestoQuick Assistant..."></textarea>

                        <div class="mt-3 flex justify-end">
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