export const useShiftMutation = () => {
  // this global boolean is used to prevent showing skeleton
  //loading when user edits shifts or make changes to draft shift or save

  const is_useShiftMutating = useState("is_useShiftMutating", () => false);

  return {
    is_useShiftMutating,
  };
};
