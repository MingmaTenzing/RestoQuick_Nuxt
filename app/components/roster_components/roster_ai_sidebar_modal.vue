<script setup lang="ts">
const { close: closeModal, send_prompt: sendPrompt } = useAiRosterModal();

type ChatRole = "user" | "assistant" | "warning";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const prompt = ref("");
const isLoading = ref(false);
const chatMessages = ref<ChatMessage[]>([]);

const askAi = async () => {
  const message = prompt.value.trim();

  if (!message || isLoading.value) {
    return;
  }

  chatMessages.value.push({
    role: "user",
    content: message,
  });

  prompt.value = "";
  isLoading.value = true;

  try {
    const response = await sendPrompt(message);

    if (response.assistantMessage) {
      chatMessages.value.push({
        role: "assistant",
        content: response.assistantMessage,
      });
    }

    if (response.warning) {
      chatMessages.value.push({
        role: "warning",
        content: response.warning,
      });
    }
  } finally {
    isLoading.value = false;
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
          v-for="(message, index) in chatMessages"
          :key="index"
          :class="message.role === 'user' ? 'flex justify-end' : 'flex justify-start'"
        >
          <div
            :class="[
              'max-w-[80%] rounded-lg px-3 py-2 text-sm',
              message.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : message.role === 'warning'
                  ? 'bg-background border rounded-md text-xs'
                  : 'border bg-muted',
            ]"
          >
            {{ message.content }}
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
          <button v-on:click="askAi" class="border px-4 py-2 rounded-lg hover:border-ring" :disabled="isLoading">
            {{ isLoading ? 'Asking...' : 'Ask AI' }}
          </button>
          <button class="border px-4 py-2 rounded-lg hover:border-ring bg-accent text-accent-foreground">
            Apply Suggestions
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>