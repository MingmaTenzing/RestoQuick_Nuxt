<script setup lang="ts">
const { isOpen, close } = useAiRosterModal()
</script>

<template>
  <div class="fixed inset-0 z-50">
    <!-- overlay -->
    <div class="absolute inset-0 bg-black/40"></div>

    <!-- sidebar -->
    <aside
      class="absolute flex flex-col right-0 top-0 h-full w-full overflow-y-auto max-w-lg bg-card text-card-foreground shadow-xl  border-l border-border   "
    >

    <div class=" p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs border rounded-full px-2 py-0.5">AI</span>
            <h2 class="text-xl font-semibold">Roster Assistant</h2>
          </div>
          <button v-on:click="close" class="border px-3 py-1 rounded-lg hover:border-ring">
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
        <!-- user message -->
        <div class="flex justify-end">
          <div class="max-w-[80%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm">
            Can you optimize this week’s roster for lunch peak?
          </div>
        </div>

        <!-- ai message -->
        <div class="flex justify-start">
          <div class="max-w-[80%] rounded-lg border bg-muted px-3 py-2 text-sm space-y-2">
            <p>
              I suggest adding 1 extra waiter on Monday and Friday lunch hours
              and extending the chef shift to 18:00.
            </p>
            <div class="bg-background border rounded-md p-2 text-xs">
              <div class="font-medium">Suggested Changes</div>
              <ul class="list-disc pl-4 mt-1 space-y-1">
                <li>Mon: Add Waiter 11:00–15:00</li>
                <li>Fri: Add Waiter 11:00–15:00</li>
                <li>Extend Chef: 09:00–18:00</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- input + actions -->
      <div class="border-t  p-3 ">
        <textarea
          rows="3"
          class="w-full resize-none border rounded-lg px-3 py-2 outline-none"
          placeholder="Ask the AI to optimize your roster..."
        ></textarea>

        <div class="flex items-center justify-between mt-3">
          <button class="border px-4 py-2 rounded-lg hover:border-ring">
            Ask AI
          </button>
          <button class="border px-4 py-2 rounded-lg hover:border-ring bg-accent text-accent-foreground">
            Apply Suggestions
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>