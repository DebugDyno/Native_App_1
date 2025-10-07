import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const lightTheme = {
  primary: '#191919',
  background: '#F0F0F0',
  text: '#333333',
  border: '#E0E0E0',
  white: '#FFFFFF',
  textLight: '#757575',
  expense: '#E53935',
  income: '#43A047',
  card: '#F5F5F5',
  shadow: 'rgba(0,0,0,0.1)',
};

const darkTheme = {
  primary: '#F0F0F0',
  background: '#191919',
  text: '#E0E0E0',
  border: '#333333',
  white: '#1E1E1E',
  textLight: '#B0B0B0',
  expense: '#EF9A9A',
  income: '#A5D6A7',
  card: '#252525',
  shadow: 'rgba(0,0,0,0.5)',
};

const STORAGE_KEY = '@app_theme';
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeColors, setThemeColors] = useState(lightTheme);
  const [mode, setMode] = useState('light'); // 'light', 'dark', or 'system'

  useEffect(() => {
    const initTheme = async () => {
      const storedMode = await AsyncStorage.getItem(STORAGE_KEY);
      const systemScheme = Appearance.getColorScheme();

      if (storedMode === 'dark') {
        setMode('dark');
        setThemeColors(darkTheme);
      } else if (storedMode === 'light') {
        setMode('light');
        setThemeColors(lightTheme);
      } else {
        // 'system' or first launch
        setMode('system');
        setThemeColors(systemScheme === 'dark' ? darkTheme : lightTheme);
      }
    };

    initTheme();
  }, []);

  // Update automatically when system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (mode === 'system') {
        setThemeColors(colorScheme === 'dark' ? darkTheme : lightTheme);
      }
    });
    return () => subscription.remove();
  }, [mode]);

  const setAppTheme = async newMode => {
    setMode(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);

    if (newMode === 'system') {
      const systemScheme = Appearance.getColorScheme();
      setThemeColors(systemScheme === 'dark' ? darkTheme : lightTheme);
    } else {
      setThemeColors(newMode === 'dark' ? darkTheme : lightTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: themeColors,
        mode,
        setAppTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
