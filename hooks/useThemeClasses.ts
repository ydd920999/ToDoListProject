import { useTheme } from "../contexts/ThemeContext";
import { getThemeClasses } from "../styles/themes";

export const useThemeClasses = () => {
  const { theme } = useTheme();
  return getThemeClasses(theme);
};
