interface shiftModal {
  date: Date | null;
  isOpen: boolean;
}
export const useAddShiftModal = () => {
  const addShiftModal = useState<shiftModal>("addshiftModal", () => ({
    //date is set here so it's easy to track when adding shift
    date: null,
    isOpen: false,
  }));

  const open_add_shiftModal = (date: Date) => (
    //here open_add_shiftModal is takes and sets the date value.

    //the reason for this is cause user is clicking add shift on the calendar itself
    // so doing this will make it easier to track on which date should the shift be added or modified.

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
