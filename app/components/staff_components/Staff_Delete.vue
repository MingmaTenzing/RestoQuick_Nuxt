<script lang="ts" setup>
import type { Staff } from '~/generated/prisma/browser';

const props = defineProps<{ staff: Staff }>();
const emit = defineEmits<{ close: [] }>();

const isDeleting = ref(false);
const toast = useToast();

async function deleteStaff() {
  isDeleting.value = true;
  try {
    await $fetch(`/api/staff/${props.staff.id}`, {
      method: 'DELETE',
    });
    toast.success({
      title: 'Staff Deleted',
      message: `${props.staff.firstname} ${props.staff.lastName} has been removed`,
    });
    await refreshNuxtData('staffs');
    emit('close');
  } catch (error) {
    toast.error({
      title: 'Error',
      message:
        error instanceof Error
          ? error.message
          : 'Failed to delete staff member',
    });
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-card rounded-lg border border-border p-6 shadow-lg max-w-md w-full"
    >
      <div class="flex items-center gap-4 mb-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"
        >
          <i class="pi pi-exclamation-triangle text-destructive text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold">Delete Staff Member</h3>
          <p class="text-sm text-muted-foreground">
            This action cannot be undone
          </p>
        </div>
      </div>
      <p class="text-sm text-foreground mb-6">
        Are you sure you want to delete
        <strong>{{ props.staff.firstname }} {{ props.staff.lastName }}</strong
        >?
        This will permanently remove their profile, shifts, and leave
        requests.
      </p>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          :disabled="isDeleting"
          @click="emit('close')"
          class="px-4 py-2 rounded-md border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="isDeleting"
          @click="deleteStaff"
          class="px-4 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <i v-if="isDeleting" class="pi pi-spinner animate-spin"></i>
          <span>{{ isDeleting ? 'Deleting...' : 'Delete' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

