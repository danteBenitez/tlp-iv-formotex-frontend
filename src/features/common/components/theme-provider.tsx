import { createContext, ReactNode, useEffect } from "react";
import useLocalStorage from "../use-storage";

export type ThemeContextType = {
  theme: "light" | "dark" | "system";
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeProvider(props: { children: ReactNode }) {
  const storage = useLocalStorage("theme");
  let theme = storage.value as ThemeContextType["theme"];
  const setTheme = storage.setItem;

  if (!theme) theme = "light";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const toggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme: theme as ThemeContextType["theme"], toggle }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}
