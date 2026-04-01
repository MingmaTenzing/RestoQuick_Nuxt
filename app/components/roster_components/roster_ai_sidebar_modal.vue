<script setup lang="ts">
const {
  close: closeModal,
  send_prompt: sendPrompt,
  ai_conversation,
  response_loading
} = useAiRosterModal();

const { save_all_draft_shift } = useDraftShift()

const prompt = ref("");
const toast = useToast()
const is_applying_suggestions = ref(false)

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



async function apply_suggestion() {
  is_applying_suggestions.value = true
  try {
    const data = await save_all_draft_shift()

    if (!data) {
      toast.info({
        message: "No draft shifts to save",
      })
      return
    }
 
    if (data?.response.count) {
      toast.success({
        message: "Saved all Draft Shifts"
      })
    }
    
  } catch (error) {
    toast.error({
      message: error instanceof Error ? error.message : "Failed to save draft shifts",
    })
  } finally {
    is_applying_suggestions.value = false
  }
}

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
          <button v-on:click="closeModal" class="border px-3 py-1 rounded-3xl hover:border-ring">
            Close
          </button>
        </div>
  
        <div class="text-sm text-muted-foreground ">
          Ask for optimized rosters, staffing coverage, and budget-aware suggestions.
        </div>

    </div>

    <!-- weekly budget section commented out for now 
     focusing creating roster just using chats -->
      <!-- <div class="border border-t p-4  flex items-center gap-4">
        <div>

            <div class="text-sm font-medium">Weekly Budget</div>
            <div class="text-xs text-muted-foreground">Set a max weekly staffing spend</div>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm">$</span>
          <input
            type="number"
            min="0"
            class="w-full border rounded-3xl px-3 py-2 bg-background"
            placeholder="5000"
          />
        </div>
      </div> -->

      <!-- chat area -->
      <div class="flex-1 min-h-0 overflow-y-auto  border-y  p-4  space-y-4">
        <div
          v-for="(message, index) in ai_conversation.assistantMessage"
          :key="`${message.role}-${index}`"
          class="space-y-2"
        >
          <div :class="message.role === 'USER' ? 'flex justify-end' : 'flex justify-start'">
            <div class="max-w-[80%] rounded-3xl px-3 py-2 text-sm border" :class="message.role === 'USER' ? 'bg-accent' : 'bg-muted'">
              {{ message.content }}
            </div>
          </div>

          <div v-if="message.role === 'AI' && message.caution" class="flex justify-start">
            <div class="max-w-[80%] rounded-2xl px-3 py-2 text-xs bg-background border">
              {{ message.caution }}
            </div>
          </div>
        </div>
      </div>

      <!-- input + actions -->
      <form @submit.prevent="askAi" class="border-t  p-3 ">
        <textarea
          v-model="prompt"
          @keydown.enter.exact.prevent="askAi"
          rows="3"
          class="w-full resize-none border rounded-3xl px-3 py-2 outline-none"
          placeholder="Ask the AI to optimize your roster..."
        ></textarea>

        <div class="flex items-center justify-between mt-3">
          <button type="submit" class="border px-4 py-2 rounded-3xl hover:border-ring flex items-center gap-2" :disabled="response_loading">
            <i v-if="response_loading" class="pi pi-spin pi-spinner"></i>
            <span>Ask AI</span>
          </button>
          <button type="button" @click="apply_suggestion" :disabled="is_applying_suggestions" class="border px-4 py-2 rounded-3xl hover:border-ring bg-accent text-accent-foreground flex items-center gap-2">
            <i v-if="is_applying_suggestions" class="pi pi-spin pi-spinner"></i>
            Apply Suggestions
          </button>
        </div>
      </form>
    </aside>
  </div>
</template>