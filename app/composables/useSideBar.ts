export const useSideBar = () => {
  const isSidebar_open = useState<boolean>("sideBar", () => false);

  const open_side_bar = () => (isSidebar_open.value = true);
  const close_side_bar = () => (isSidebar_open.value = false);

  return { isSidebar_open, open_side_bar, close_side_bar };
};
