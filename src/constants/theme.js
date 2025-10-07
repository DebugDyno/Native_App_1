import { Appearance } from 'react-native';

// Define themes
const coffeeTheme = {
  primary: '#8B593E',
  background: '#FFF8F3',
  text: '#4A3428',
  border: '#E5D3B7',
  white: '#FFFFFF',
  textLight: '#9A8478',
  expense: '#E74C3C',
  income: '#2ECC71',
  card: '#FFFFFF',
  shadow: '#000000',
};

export const lightTheme = {
  primary: '#1E88E5',
  background: '#FFFFFF',
  text: '#212121',
  border: '#E0E0E0',
  white: '#FFFFFF',
  textLight: '#757575',
  expense: '#E53935',
  income: '#43A047',
  card: '#F5F5F5',
  shadow: 'rgba(0,0,0,0.1)',
};

export const darkTheme = {
  primary: '#F0F0F0',
  background: '#121212',
  text: '#E0E0E0',
  border: '#333333',
  white: '#1E1E1E',
  textLight: '#B0B0B0',
  expense: '#EF9A9A',
  income: '#A5D6A7',
  card: '#1F1F1F',
  shadow: 'rgba(0,0,0,0.5)',
};

export const THEMES = {
  coffee: coffeeTheme,
  light: lightTheme,
  dark: darkTheme,
};

// ✅ Hook to get current system theme dynamically
export const useTheme = () => {
  const mode = Appearance.getColorScheme();
  if (mode === 'light') return THEMES.light;
  if (mode === 'dark') return THEMES.dark;
  return THEMES.dark;
};

// ✅ Function to get a theme by name
export const useColors = themeName => {
  return THEMES[themeName] || THEMES.light;
};
