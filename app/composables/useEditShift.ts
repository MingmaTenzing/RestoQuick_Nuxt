import type { Shift } from "~/generated/prisma/client";
import type { Shift_With_Staff_Payload } from "../../types/shift_include_staff";

interface edit_shiftModal {
  isOpen: boolean;
  shift: Shift_With_Staff_Payload | null;
}
export const useeditShiftModal = () => {
  const editshiftModal = useState<edit_shiftModal>("editshiftModal", () => ({
    shift: null,
    isOpen: false,
  }));

  const open_edit_shiftModal = (shift: Shift_With_Staff_Payload) => (
    (editshiftModal.value.shift = shift),
    (editshiftModal.value.isOpen = true),
    document.body.classList.add("overflow-hidden")
  );
  const close_edit_shiftModal = () => (
    (editshiftModal.value.isOpen = false),
    (editshiftModal.value.shift = null),
    document.body.classList.remove("overflow-hidden")
  );

  return {
    editshiftModal,
    open_edit_shiftModal,
    close_edit_shiftModal,
  };
};
