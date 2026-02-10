export const useAiRosterModal = () => {
  const isOpen = useState<boolean>("ai-roster-modal-open", () => false);

  const open = () => {
    isOpen.value = true;
  };
  const close = () => {
    isOpen.value = false;
  };

  return { isOpen, open, close };
};
