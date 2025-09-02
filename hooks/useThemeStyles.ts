import { useTheme } from "../contexts/ThemeContext";
import { getThemeStyles } from "../styles/themes";

export const useThemeStyles = () => {
  const { theme } = useTheme();
  return getThemeStyles(theme);
};
