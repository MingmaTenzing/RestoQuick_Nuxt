import type { Shift_With_Staff_Payload } from "~~/types/shift_include_staff";

interface EditDraftShiftModal {
  isOpen: boolean;
  shift: Shift_With_Staff_Payload | null;
}

export const useEditDraftShift = () => {
  const { ai_conversation } = useAiRosterModal();
  const editDraftShiftModal = useState<EditDraftShiftModal>(
    "edit-draft-shift-modal",
    () => ({
      isOpen: false,
      shift: null,
    }),
  );

  const open_edit_draft_shiftModal = (shift: Shift_With_Staff_Payload) => {
    editDraftShiftModal.value = {
      isOpen: true,
      shift,
    };
    document.body.classList.add("overflow-hidden");
  };

  const close_edit_draft_shiftModal = () => {
    editDraftShiftModal.value = {
      isOpen: false,
      shift: null,
    };
    document.body.classList.remove("overflow-hidden");
  };

  const edit_draft_shift = (updated_draft_shift: Shift_With_Staff_Payload) => {
    ai_conversation.value.shifts = (ai_conversation.value.shifts ?? []).map(
      (shift) =>
        shift.id === updated_draft_shift.id ? updated_draft_shift : shift,
    );

    close_edit_draft_shiftModal();
  };

  return {
    editDraftShiftModal,
    open_edit_draft_shiftModal,
    close_edit_draft_shiftModal,
    edit_draft_shift,
  };
};
