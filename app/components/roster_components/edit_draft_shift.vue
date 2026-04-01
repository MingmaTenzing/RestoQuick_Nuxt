<script setup lang="ts">
import type { Shift_With_Staff_Payload } from '~~/types/shift_include_staff';

const { close_edit_draft_shiftModal , editDraftShiftModal, edit_draft_shift} = useDraftShift();




const shift_form = ref({
  startTime: editDraftShiftModal.value.shift?.startTime ?? '',
  endTime: editDraftShiftModal.value.shift?.endTime ?? '',
  position: editDraftShiftModal.value.shift?.position ?? '',
});

function submit_shift() {
    const currentShift = editDraftShiftModal.value.shift

    if (!currentShift) {
      return console.log("No Current Draft Shift")
    }

    const updatedShift: Shift_With_Staff_Payload = {
      ...currentShift,
      startTime: shift_form.value.startTime,
      endTime: shift_form.value.endTime,
      position: shift_form.value.position,
    }

    edit_draft_shift(updatedShift)

}
</script>

<template>
  <div class="flex justify-center items-center fixed w-screen h-screen bg-background/90 backdrop-blur-xs top-0 z-10 left-0">
    <div class="w-125 flex flex-col gap-4 p-4 bg-background drop-shadow-lg border drop-shadow-accent opacity-100 rounded-3xl">
      <section class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xl text-card-foreground font-semibold">Edit Draft Shift</span>
          <button @click="close_edit_draft_shiftModal()">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="font-light text-muted-foreground">
          Edit {{ editDraftShiftModal.shift?.staff.firstname }} {{ editDraftShiftModal.shift?.staff.lastName }}'s draft shift
        </div>
      </section>

      <section>
        <form @submit.prevent="submit_shift" class="space-y-4">
          <section class="space-y-2">
            <div class="text-sm font-medium">Staff Member</div>
            <div class="relative items-center w-1/2">
              <div class="border border-border p-2 rounded-3xl flex justify-between items-center">
                <input
                  disabled
                  class="text-muted-foreground font-light outline-none text-sm"
                  :value="editDraftShiftModal.shift?.staff.firstname"
                >
              </div>
            </div>
          </section>

          <section class="flex justify-between">
            <div class="flex flex-col w-[45%]">
              <span class="text-sm font-medium">Start Time</span>
              <div class="border border-border p-2 rounded-3xl">
                <input required class="outline-none text-primary" type="time" v-model="shift_form.startTime">
              </div>
            </div>

            <div class="flex flex-col w-[45%]">
              <span class="text-sm font-medium">End Time</span>
              <div class="border border-border focus:border-ring p-2 rounded-3xl">
                <input required class="outline-none text-primary" type="time" v-model="shift_form.endTime">
              </div>
            </div>
          </section>

          <section class="flex flex-col space-y-2">
            <span class="text-sm font-medium">Position</span>
            <input class="outline-none border border-border rounded-3xl p-2 text-sm" type="text" v-model="shift_form.position">
          </section>

          <section class="flex justify-end space-x-2 items-center text-sm">
            <button type="button" @click="close_edit_draft_shiftModal" class="px-4 py-2 hover:border-ring rounded-3xl border border-border">Cancel</button>
            <button type="submit" class="px-4 py-2 hover:border-ring rounded-3xl border border-border bg-green-600 text-green-50">
              Update Draft
            </button>
          </section>
        </form>
      </section>
    </div>
  </div>
</template>
