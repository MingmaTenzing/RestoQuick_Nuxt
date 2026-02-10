<script setup lang="ts">
const { isOpen, close } = useAiRosterModal()
</script>

<template>
  
    <div  class="fixed inset-0 z-50">
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/40" @click="close"></div>

      <!-- sidebar -->
      <aside
        class="absolute right-0 top-0 h-full w-full max-w-md bg-card text-card-foreground shadow-xl border-l border-border p-6 flex flex-col gap-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">AI Roster Suggestions</h2>
          <button class="border px-3 py-1 rounded-lg hover:border-ring" @click="close">
            Close
          </button>
        </div>

        <div class="text-sm text-muted-foreground">
          Generate optimized staff schedules based on availability, roles, and demand.
        </div>

        <div class="flex flex-col gap-3">
          <button class="border px-4 py-2 rounded-lg hover:border-ring">
            Generate Suggestions
          </button>
          <button class="border px-4 py-2 rounded-lg hover:border-ring">
            Apply Suggestions
          </button>
        </div>
      </aside>
    </div>

</template>