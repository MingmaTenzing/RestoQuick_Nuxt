export const useTheme = () => {
  const theme = useState("theme", () => "dark");

  const setDarkTheme = () => (theme.value = "dark");
  const setLightTheme = () => (theme.value = "light");

  return { theme, setDarkTheme, setLightTheme };
};
