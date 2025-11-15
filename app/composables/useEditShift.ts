interface edit_shiftModal {
  isOpen: boolean;
  shiftId: String;
}
export const useeditShiftModal = () => {
  const editshiftModal = useState<edit_shiftModal>("editshiftModal", () => ({
    shiftId: "",
    isOpen: false,
  }));

  const open_edit_shiftModal = (shiftId: String) => (
    (editshiftModal.value.shiftId = shiftId),
    (editshiftModal.value.isOpen = true),
    document.body.classList.add("overflow-hidden")
  );
  const close_edit_shiftModal = () => (
    (editshiftModal.value.isOpen = false),
    (editshiftModal.value.shiftId = ""),
    document.body.classList.remove("overflow-hidden")
  );

  return {
    editshiftModal,
    open_edit_shiftModal,
    close_edit_shiftModal,
  };
};
