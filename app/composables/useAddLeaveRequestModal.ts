import { ref } from "vue";

export function useAddLeaveRequestModal() {
  const isOpen = useState("leaveisopen", () => false);
  const selectedStaffId = useState<string | null>("selected", () => null);

  const openModal = (staffId?: string) => {
    if (staffId) {
      selectedStaffId.value = staffId;
    }
    isOpen.value = true;
  };

  const closeModal = () => {
    isOpen.value = false;
    selectedStaffId.value = null;
  };

  return {
    isOpen,
    selectedStaffId,
    openModal,
    closeModal,
  };
}
