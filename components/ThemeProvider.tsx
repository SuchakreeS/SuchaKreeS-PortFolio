"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "seventh-trumpet" | "black-parade" | "californication";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "seventh-trumpet",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("seventh-trumpet");

  // Read persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("portfolio-theme") as Theme | null;
    if (stored === "black-parade" || stored === "seventh-trumpet" || stored === "californication") {
      setThemeState(stored);
    }
  }, []);

  // Apply theme to <html> element and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "black-parade" || theme === "californication") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const setTheme = (t: Theme) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
