import { useWindowSize } from "@vueuse/core";

export const useSideBar = () => {
  const isSidebar_open = useState<boolean>("sideBar", () => false);
  const { width } = useWindowSize();
  const open_side_bar = () => (isSidebar_open.value = true);
  const close_side_bar = () => (isSidebar_open.value = false);
  const isTabletOrLarger = computed(() => width.value >= 1536);

  return { isSidebar_open, isTabletOrLarger, open_side_bar, close_side_bar };
};
