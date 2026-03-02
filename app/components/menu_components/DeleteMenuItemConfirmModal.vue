<script setup lang="ts">
const props = defineProps<{
  itemName: string
  isDeleting?: boolean
}>()

const emit = defineEmits<{
  cancel: []
  confirm: []
}>()
</script>

<template>
  <div
    class="fixed inset-0 z-60 flex items-center justify-center bg-background/80 p-4"
    @click.self="!props.isDeleting && emit('cancel')"
  >
    <div class="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-lg">
      <h3 class="text-lg font-semibold">Delete Menu Item?</h3>
      <p class="mt-2 text-sm text-muted-foreground">
        This will permanently delete
        <span class="font-medium text-foreground">{{ props.itemName }}</span>.
        This action cannot be undone.
      </p>

      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          :disabled="props.isDeleting"
          class="rounded-md border border-input bg-background px-4 py-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:cursor-not-allowed disabled:opacity-50"
          @click="emit('cancel')"
        >
          Cancel
        </button>

        <button
          v-if="!props.isDeleting"
          type="button"
          class="rounded-md bg-destructive px-4 py-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
          @click="emit('confirm')"
        >
          Delete
        </button>

        <div
          v-else
          class="flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-destructive-foreground"
        >
          <i class="pi pi-spinner animate-spin" />
        </div>
      </div>
    </div>
  </div>
</template>
