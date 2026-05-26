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
    {
        id: 'assistant-welcome',
        role: 'assistant',
        content: 'Hello. I can help with menu updates, bookings, staff scheduling, and order flow questions.'
    },
    {
        id: 'user-shifts',
        role: 'user',
        content: 'Show me a quick summary of today\'s staffing gaps.'
    },
    {
        id: 'assistant-shifts',
        role: 'assistant',
        content: 'Lunch service is fully covered. The main gap is one extra floor staff member between 6:00 PM and 8:00 PM.'
    },
    {
        id: 'user-bookings',
        role: 'user',
        content: 'Any large bookings I should be aware of tonight?'
    },
    {
        id: 'assistant-bookings',
        role: 'assistant',
        content: 'Yes. There is a party of 10 at 7:30 PM and a party of 8 at 8:15 PM, both requesting indoor seating.'
    },
    {
        id: 'user-prep',
        role: 'user',
        content: 'How is the kitchen looking for the dinner rush?'
    },
    {
        id: 'assistant-prep',
        role: 'assistant',
        content: 'Prep is mostly on track. Grill and fry sections are ready, but desserts are behind by around 20 minutes because one batch of tiramisu is still chilling.'
    },
    {
        id: 'user-orders',
        role: 'user',
        content: 'Do we have any delayed orders open right now?'
    },
    {
        id: 'assistant-orders',
        role: 'assistant',
        content: 'There are three orders past the target prep time. Two are waiting on mains and one takeaway order is delayed because garlic naan is being remade.'
    },
    {
        id: 'user-stock',
        role: 'user',
        content: 'Anything low in stock that could become a problem tonight?'
    },
    {
        id: 'assistant-stock',
        role: 'assistant',
        content: 'Salmon portions are down to six, mint chutney is low, and only one tray of chocolate mousse remains. If bookings hold, salmon is the first item likely to run short.'
    },
    {
        id: 'user-menu',
        role: 'user',
        content: 'Should we hide salmon from online ordering now or wait a bit longer?'
    },
    {
        id: 'assistant-menu',
        role: 'assistant',
        content: 'I would wait for the next 30 minutes and review after the 6:30 PM booking wave. If two more salmon orders come in before then, it is safer to disable it online and keep the remaining portions for dine-in tables.'
    },
    {
        id: 'user-staff-followup',
        role: 'user',
        content: 'Can the current floor team handle the two larger bookings without moving anyone?'
    },
    {
        id: 'assistant-staff-followup',
        role: 'assistant',
        content: 'They can cover it if service stays steady, but it will be tight between 7:15 PM and 8:00 PM. Moving one staff member from the takeaway counter to the floor for that window would reduce pressure.'
    },
    {
        id: 'user-special-requests',
        role: 'user',
        content: 'Any notable guest notes for tonight that the team should know about?'
    },
    {
        id: 'assistant-special-requests',
        role: 'assistant',
        content: 'One table requested a birthday dessert plate, another booking has a shellfish allergy, and the 8:15 PM party asked for separate bills. Front of house should brief the team before the rush starts.'
    },
    {
        id: 'user-summary',
        role: 'user',
        content: 'Summarize the main risks for the next two hours in one message.'
    },
    {
        id: 'assistant-summary',
        role: 'assistant',
        content: 'For the next two hours, the service picture is manageable but there are three pressure points that deserve attention. The first is floor coverage during the overlap between the 7:30 PM and 8:15 PM larger bookings. The current team can handle normal traffic, but if walk-ins arrive in clusters or one of the larger parties is seated late and compressed into the same service window, the floor will slow down on greeting, drink orders, and table resets. The second risk is menu availability, especially salmon. Stock is low enough that a small run of online orders could force a last-minute change, which is always messier during peak service than making a controlled decision earlier. The third risk is dessert timing. It is not a major issue yet, but if the current prep delay carries into the second half of service, tables ordering desserts after mains may start to feel the wait. My recommendation is to shift one staff member to the floor between 7:15 PM and 8:00 PM, have the kitchen or manager review salmon sales every 15 minutes, and brief front of house now on the allergy note, birthday request, and split-bill table so those details do not become avoidable service errors. If those three actions happen early, the shift should stay stable even if demand picks up faster than expected.'
    }
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
    <div class="flex flex-col w-full h-full justify-center items-center">

        <main :class="!hasConversation ? '' : 'gap-6'">
            <div v-if="!hasConversation">
                <h1 class="text-3xl">Hi, How can I Assist You?</h1>
            </div>
            <div v-else class="w-full max-w-6xl h-[80vh]  overflow-y-scroll ">
                <div ref="chatViewport" class="   gap-8 flex flex-col">
                    <div v-for="message in messages" :key="message.id"
                        :class="['flex items-start ', message.role === 'assistant' ? 'justify-start' : 'justify-end']">
                        <div
                            :class="['  p-4 ', message.role === 'assistant' ? '' : 'bg-secondary text-secondary-foreground rounded-full']">
                            {{ message.content }}
                        </div>
                    </div>
                </div>

            </div>
            <div :class="['flex items-center justify-center ', !hasConversation ? 'w-3xl' : 'w-6xl']">
                <form
                    class="w-full  rounded-4xl border border-border bg-card/95 p-3 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.35)] backdrop-blur"
                    @submit.prevent="sendMessage()">
                    <div class="flex items-center gap-3 rounded-[1.6rem]   px-4 py-3">
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