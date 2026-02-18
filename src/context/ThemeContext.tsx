import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "dark" | "day";

type ThemeContextValue = {
  mode: ThemeMode;
  toggle: () => void;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("themeMode") as ThemeMode | null;
    return stored === "day" || stored === "dark" ? stored : "dark";
  });

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem("themeMode", next);
    } catch {
      // noop
    }
  }, []);

  const toggle = useCallback(() => {
    setModeState((prev: ThemeMode) => {
      const next: ThemeMode = prev === "dark" ? "day" : "dark";
      try {
        localStorage.setItem("themeMode", next);
      } catch {
        // noop
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.body.dataset.theme = mode;
  }, [mode]);

  const value = useMemo(() => ({ mode, toggle, setMode }), [mode, toggle, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
