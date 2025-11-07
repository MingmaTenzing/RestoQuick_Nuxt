interface shiftModal {
  date: Date | null;
  isOpen: boolean;
}
export const useAddShiftModal = () => {
  const addShiftModal = useState<shiftModal>("addshiftModal", () => ({
    date: null,
    isOpen: false,
  }));

  // methods for closing and opening the add shift popover
  const open_add_shiftModal = (date: Date) => (
    (addShiftModal.value.date = date),
    (addShiftModal.value.isOpen = true),
    document.body.classList.add("overflow-hidden")
  );
  const close_add_shiftModal = () => (
    (addShiftModal.value.isOpen = false),
    (addShiftModal.value.date = null),
    document.body.classList.remove("overflow-hidden")
  );

  return {
    addShiftModal,
    open_add_shiftModal,
    close_add_shiftModal,
  };
};
