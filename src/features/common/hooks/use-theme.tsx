import { useContext } from "react";
import { ThemeContext } from "../components/theme-provider";

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("`useTheme` debe llamarse dentro de un <ThemeProvider />");
  }
  return ctx;
};
