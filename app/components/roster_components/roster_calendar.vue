<script lang="ts" setup>

import type { Shift_With_Staff_Payload } from "../../../types/shift_include_staff"
import Edit_draft_shift from "./edit_draft_shift.vue";
import Roster_ai_sidebar_modal from "./roster_ai_sidebar_modal.vue";

const {
    weekDates,
    weekRangeText,
    startOfWeek,
    endOfWeek,
    nextWeek,
    previousWeek,
    goToCurrentWeek,

} = useWeekNavigation();




const { addShiftModal, open_add_shiftModal, close_add_shiftModal } = useAddShiftModal()
const {isOpen, ai_conversation} = useAiRosterModal()
const { editshiftModal } = useeditShiftModal()

const { editDraftShiftModal} = useDraftShift()
const { is_useShiftMutating } = useShiftMutation()
const toast = useToast();





//intial shifts fetch with staff data for current week
const { data: shifts, status, refresh } = await useAsyncData(
  "shifts",
  () => $fetch<Shift_With_Staff_Payload[]>("/api/shift", {
    query: {
      startDate: startOfWeek.value.toISOString(),
      endDate: endOfWeek.value.toISOString()
    }
  }), 
  {
    lazy: true,
    watch: [startOfWeek, endOfWeek] // Refetch when week changes
  }
); 

const formatDateKey = (date: Date | string) => {
    const currentDate = new Date(date);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// Builds the list of shifts for a given day by combining:
// 1) persisted shifts loaded from the API, and
// 2) temporary AI-generated draft shifts from the roster modal.
// Each item is tagged with isDraft so the template can render saved vs draft UI differently.
const shiftsForDate = (date: Date) => {
    const dayKey = formatDateKey(date);

    const persisted = (shifts.value ?? [])
        .filter((shift) => formatDateKey(shift.date) === dayKey)
        .map((shift) => ({
            shift,
            isDraft: false,
        }));

    const draft = (ai_conversation.value.shifts ?? [])
        .filter((shift) => formatDateKey(shift.date) === dayKey)
        .map((shift) => ({
            shift,
            isDraft: true,
        }));

    return [...persisted, ...draft];
};

// this function is triggered from the emitted event from the staff shift component
async function deleteShift(shiftId: string) {
    is_useShiftMutating.value = true

    try {
        const delete_staff = await $fetch( `/api/shift/${shiftId}`, {
            method:'delete'
        })
    
        if (delete_staff) {
            
            toast.success({title:"Success", message:"Shift Deleted"})
            // Trigger refetch in parent component
            await refresh()
    
        }
        
    } catch (error) {
        const nuxtError = isNuxtError(error) ? error : null
        toast.error({
            title: nuxtError?.name ?? "Error",
            message: nuxtError?.message ?? "Failed to delete shift"
        })
    } finally {
        is_useShiftMutating.value = false
    }
   
    }


async function saveDraftShift(shift: Shift_With_Staff_Payload) {
    is_useShiftMutating.value = true
    try {
        const savedShift = await $fetch('/api/shift', {
            method: 'post',
            body: {
                staffId: shift.staffId,
                date: shift.date,
                startTime: shift.startTime,
                endTime: shift.endTime,
                position: shift.position,
            }
        })

        if (savedShift) {
            ai_conversation.value.shifts = (ai_conversation.value.shifts ?? []).filter(
                (draftShift) => draftShift.id !== shift.id,
            )

            await refresh()
            toast.success({ title: 'Success', message: 'Shift Saved' })
        }
    } catch (error) {
        const nuxtError = isNuxtError(error) ? error : null
        toast.error({
            title: nuxtError?.name ?? 'Error',
            message: nuxtError?.message ?? 'Failed to save shift',
        })
    } finally {
        is_useShiftMutating.value = false
    }
}



    
    

</script>




<template> 

<div class=" " >
    <div class=" flex justify-between items-center w-full my-4">

        <span class=" text-2xl font-semibold">Weekly 
            Schedule</span>

            <div class=" flex gap-4 items-center">
                <button v-on:click="previousWeek()" class=" border px-4 py-2 bg-card hover:border-ring  rounded-lg"><</button>
                <span class=" font-medium text-lg">
                    
                    {{ weekRangeText }}
                </span>
                <button v-on:click="nextWeek()" class=" border px-4 bg-card hover:border-ring  py-2 rounded-lg">></button>
                <button  v-on:click="goToCurrentWeek()" class=" rounded-lg border border-border bg-card hover:border-ring   px-4 py-2  text-accent-foreground">Get Current Week</button>
            </div>
    </div>



    <!-- week dates -->

    <section class=" flex  justify-around gap-2 ">
        <div class=" flex w-full flex-col gap-4" v-for="date in weekDates" :key="date.date.toLocaleDateString()">
        <div :class="['flex flex-col items-center justify-center p-4 rounded-lg  ', date.isToday ? 'bg-accent text-primary':' bg-accent/50']">
            <span class=" font-light">{{ date.dayName }}</span>
            <div class=" flex gap-1 font-bold">
                <span>{{ date.dayNumber }}</span>
                <span>{{ date.month }}</span>

            </div>


        </div>



<!-- drag and drop is not the best suit so will be moving to adding manually from the shift container
 this section is only being commented out but will have a look in the future possibilities so its not removed-->
<!-- 
        <div @drop="onDrop($event, date.date) "
        @dragover.prevent  
       

        :class="['  flex flex-col gap-2 p-2   min-h-[120px] border-2 border-dashed rounded-lg', isStaffDragged?'border-amber-600':'']">

        <div   v-for="shift in shifts.filter((shift) => shift.date.toDateString() == date.date.toDateString())" :key="shift.id">
            <div>
              

                <div>
                    <roster-components-staff-shift :staff_id="shift.staffId" :shift_id="shift.id" ></roster-components-staff-shift>
                </div>

               
            </div>
            
        </div>

        </div> -->
    

        <!-- shifts of the day container-->
 <div    class='  flex flex-col gap-2 p-2   min-h-30 border-2 border-dashed rounded-lg hover:border-ring'>

<!-- add shift button -->
      <button v-on:click="open_add_shiftModal(date.date)" class=" flex justify-end">
           <i class=" pi pi-plus"></i>
           
           
      </button>


   <!-- staff shift time and name -->


     <div v-if="status == 'pending' && !is_useShiftMutating">
 <roster-components-shift-loading></roster-components-shift-loading>
  </div>

                <div
                    v-else
                    v-for="entry in shiftsForDate(date.date)"
                    :key="`${entry.isDraft ? 'draft' : 'saved'}-${entry.shift.id}`"
                >
                    <roster-components-draft-shift
                        v-if="entry.isDraft"
                        :shift="entry.shift"
                        @save="saveDraftShift"
                    ></roster-components-draft-shift>

                    <roster-components-staff-shift
                        v-else
                        :shift="entry.shift"
                        @delete-shift="deleteShift"
                    ></roster-components-staff-shift>
                </div>

    </div>

    </div>


    </section>   
    
    
<!-- addd shift modal form -->

  <roster-components-add-shift v-if="addShiftModal.isOpen"></roster-components-add-shift>

  <!-- edit shift-modal -->
<roster-components-edit-shift v-if="editshiftModal.isOpen"></roster-components-edit-shift>

<edit_draft_shift v-if="editDraftShiftModal.isOpen"  ></edit_draft_shift>



 <!-- ai roster modal -->
 <div v-if="isOpen">
    <roster_ai_sidebar_modal />
  </div>

</div>



</template>