<script setup lang="ts">
const {
  close: closeModal,
  send_prompt: sendPrompt,
  ai_conversation,
  response_loading
} = useAiRosterModal();

const prompt = ref("");


const askAi = async () => {
  const message = prompt.value.trim();

  if (!message) {
    return;
  }

  prompt.value = "";
 

  try {
    const response = await sendPrompt(message);
   console.log(response)
  } catch (error){
    console.log(error)
  }
};





</script>

<template>
  <div class="fixed inset-0 z-50">
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- sidebar -->
    <aside
      class="absolute flex flex-col right-0 top-0 h-full w-full overflow-y-auto max-w-lg bg-sidebar text-card-foreground shadow-xl  border-l border-border   "
    >

    <div class=" p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs border-green-500 border text-green-500 rounded-full px-2 py-0.5">AI</span>
            <h2 class="text-xl font-semibold">Roster Assistant</h2>
          </div>
          <button v-on:click="closeModal" class="border px-3 py-1 rounded-lg hover:border-ring">
            Close
          </button>
        </div>
  
        <div class="text-sm text-muted-foreground ">
          Ask for optimized rosters, staffing coverage, and budget-aware suggestions.
        </div>

    </div>
      <div class="border border-t p-4  flex items-center gap-4">
        <div>

            <div class="text-sm font-medium">Weekly Budget</div>
            <div class="text-xs text-muted-foreground">Set a max weekly staffing spend</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">$</span>
          <input
            type="number"
            min="0"
            class="w-full border rounded-lg px-3 py-2 bg-background"
            placeholder="5000"
          />
        </div>
      </div>

      <!-- chat area -->
      <div class="flex-1 min-h-0 overflow-y-auto  border-y  p-4  space-y-4">
        <div
          v-for="(message, index) in ai_conversation.assistantMessage"
          :key="`${message.role}-${index}`"
          class="space-y-2"
        >
          <div :class="message.role === 'USER' ? 'flex justify-end' : 'flex justify-start'">
            <div class="max-w-[80%] rounded-lg px-3 py-2 text-sm border" :class="message.role === 'USER' ? 'bg-accent' : 'bg-muted'">
              {{ message.content }}
            </div>
          </div>

          <div v-if="message.role === 'AI' && message.caution" class="flex justify-start">
            <div class="max-w-[80%] rounded-md px-3 py-2 text-xs bg-background border">
              {{ message.caution }}
            </div>
          </div>
        </div>
      </div>

      <!-- input + actions -->
      <div class="border-t  p-3 ">
        <textarea
          v-model="prompt"
          rows="3"
          class="w-full resize-none border rounded-lg px-3 py-2 outline-none"
          placeholder="Ask the AI to optimize your roster..."
        ></textarea>

        <div class="flex items-center justify-between mt-3">
          <button v-on:click="askAi" class="border px-4 py-2 rounded-lg hover:border-ring" :disabled="response_loading">
            {{ response_loading ? 'Asking...' : 'Ask AI' }}
          </button>
          <button class="border px-4 py-2 rounded-lg hover:border-ring bg-accent text-accent-foreground">
            Apply Suggestions
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>