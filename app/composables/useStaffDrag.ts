export const useStaffDrag = () => {
  const isStaffDragged = useState<boolean>("isStaffDragged", () => false);

  const staffisDragged = () => {
    isStaffDragged.value = true;
  };

  const staffDragEnd = () => {
    isStaffDragged.value = false;
  };

  return {
    isStaffDragged,
    staffDragEnd,
    staffisDragged,
  };
};
