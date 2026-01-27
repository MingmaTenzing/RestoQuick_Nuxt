import type { Staff } from "~/generated/prisma/client";

export const useEdit_Staff = () => {
  const edit_staff_modal = useState<{ staff: Staff | null; isOpen: boolean }>(
    "edit-staff-modal",
    () => ({
      staff: null,
      isOpen: false,
    }),
  );

  const open_edit_staff_modal = (staff: Staff) => {
    ((edit_staff_modal.value.staff = staff),
      (edit_staff_modal.value.isOpen = true));
  };

  const close_edit_staff_modal = () => {
    ((edit_staff_modal.value.staff = null),
      (edit_staff_modal.value.isOpen = false));
  };

  return {
    edit_staff_modal,
    open_edit_staff_modal,
    close_edit_staff_modal,
  };
};
