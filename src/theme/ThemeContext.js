// src/theme/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkColors, LightColors } from './theme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // ✅ ALWAYS START LIGHT
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    const saved = await AsyncStorage.getItem('APP_THEME');
    if (saved === 'dark') {
      setIsDarkMode(true);
    }
  };

  const toggleTheme = async () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    await AsyncStorage.setItem('APP_THEME', next ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        colors: isDarkMode ? DarkColors : LightColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);