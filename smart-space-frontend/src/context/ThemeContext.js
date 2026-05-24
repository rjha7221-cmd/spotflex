import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage taaki page refresh par bhi user ki preference save rahe
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme ? savedTheme === "dark" : true; // Default dark rakh rahe hain aapke current UI ke hisab se
    });

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Dono themes ke colors yahan define kar diye hain
    const themeColors = {
        background: isDarkMode ? "#0f172a" : "#f8fafc",
        containerBg: isDarkMode ? "rgba(255,255,255,0.05)" : "#ffffff",
        cardBg: isDarkMode ? "rgba(255,255,255,0.08)" : "#ffffff",
        text: isDarkMode ? "#ffffff" : "#0f172a",
        subText: isDarkMode ? "#94a3b8" : "#64748b",
        border: isDarkMode ? "rgba(255,255,255,0.05)" : "#e2e8f0",
        shadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.05)",
        isDarkMode
    };

    return ( <
        ThemeContext.Provider value = {
            { theme: themeColors, toggleTheme } } > { children } <
        /ThemeContext.Provider>
    );
};