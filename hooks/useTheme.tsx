import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define theme colors
export const lightTheme = {
  background: '#f8f8f8',
  card: '#ffffff',
  text: '#000000',
  secondaryText: '#666666',
  border: '#e0e0e0',
  primary: '#FFD700',
  tabBar: '#ffffff',
  tabBarInactive: '#666666',
  statusBar: 'dark',
};

export const darkTheme = {
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#333333',
  primary: '#FFD700',
  tabBar: '#000000',
  tabBarInactive: '#666666',
  statusBar: 'light',
};

type ThemeType = 'light' | 'dark' | 'system';
type ThemeContextType = {
  theme: typeof lightTheme;
  themeType: ThemeType;
  isDark: boolean;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  
  // Determine if dark mode is active based on theme type and system preference
  const isDark = 
    themeType === 'dark' || 
    (themeType === 'system' && systemColorScheme === 'dark');
  
  // Get the actual theme colors based on dark mode status
  const theme = isDark ? darkTheme : lightTheme;
  
  // Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeType(prevType => {
      if (prevType === 'system') return 'light';
      if (prevType === 'light') return 'dark';
      return 'system';
    });
  };
  
  return (
    <ThemeContext.Provider value={{ theme, themeType, isDark, setThemeType, toggleTheme }}>
      <StatusBar style={theme.statusBar as 'light' | 'dark' | 'auto'} />
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};