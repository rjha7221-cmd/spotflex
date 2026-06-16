import React, { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : false;
  });

  useEffect(() => {
    const mode = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", mode);
    document.documentElement.dataset.theme = mode;
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((current) => !current);

  const theme = useMemo(
    () => ({
      background: "var(--bg)",
      containerBg: "var(--surface)",
      cardBg: "var(--surface)",
      text: "var(--text)",
      subText: "var(--muted)",
      border: "var(--border)",
      shadow: "var(--shadow-soft)",
      isDarkMode,
    }),
    [isDarkMode]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
