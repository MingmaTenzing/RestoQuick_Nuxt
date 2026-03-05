<script setup lang="ts">
import type { Shift_With_Staff_Payload } from '~~/types/shift_include_staff';
import { getStaffInitials } from '~/client_utils/staff_avatar';


const { open_edit_draft_shiftModal, remove_draft_shift } = useDraftShift()

defineProps<{
  shift: Shift_With_Staff_Payload;
}>();

const emit = defineEmits<{
  save: [shift: Shift_With_Staff_Payload],
  edit: [shift: Shift_With_Staff_Payload],
  delete: [shift: Shift_With_Staff_Payload],
  
}>();

function save_shift(shift: Shift_With_Staff_Payload) {
  emit('save', shift);
}



function delete_shift(shift: Shift_With_Staff_Payload) {
  remove_draft_shift(shift);
  emit('delete', shift);
}
</script>
  
<template>
  <div class="flex flex-col bg-secondary p-2 rounded-lg w-full border border-dashed hover:border-amber-500">
    <div class="flex justify-end">
      <span
        class="text-[10px] px-2 py-0.5 rounded-full border bg-amber-500/20 border-amber-600 text-amber-600 font-medium"
      >
        Draft
      </span>
    </div>

    <div class="flex justify-between items-end mt-1">
      <div class="space-y-2">
        <NuxtImg
          v-if="shift.staff?.profile_photo_url"
          :src="shift.staff?.profile_photo_url"
          class="w-10 h-10 object-cover rounded-full"
        ></NuxtImg>
        <div v-else class="w-10 h-10 rounded-full bg-card text-muted-foreground flex items-center justify-center text-xs font-semibold">
          {{ getStaffInitials(shift.staff) }}
        </div>

        <div class="flex flex-col">
          <span class="text-xs xl:text-base font-medium">
            {{ shift.staff?.firstname }} {{ shift.staff?.lastName?.[0] }}.
          </span>
          <span class="text-[10px] lg:text-sm">{{ shift.startTime }} - {{ shift.endTime }}</span>
          <span class="text-[10px] lg:text-xs font-light text-muted-foreground">{{ shift.position }}</span>
        </div>
      </div>
    </div>

    <div class=" flex justify-end space-x-4 mt-2">
      
      <button class="cursor-pointer  hover:scale-120 transition-all ease-linear text-muted-foreground hover:text-primary" @click="open_edit_draft_shiftModal(shift)">
        <i class=" pi pi-pen-to-square"></i>
      </button>
      
      <button class="cursor-pointer  hover:scale-120 transition-all ease-linear text-muted-foreground hover:text-primary" @click="save_shift(shift)">
        <i class=" pi pi-save"></i>
        
      </button>
      
      <button class="cursor-pointer  hover:scale-120 transition-all ease-linear text-muted-foreground hover:text-destructive" @click="delete_shift(shift)">
        <i class=" pi pi-times"></i>
      </button>
    </div>
   
  </div>
</template>
