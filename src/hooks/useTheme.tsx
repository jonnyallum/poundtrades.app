import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme, StatusBar } from 'react-native';

/**
 * PoundTrades Premium Theme System
 * 
 * A multimillion-pound marketplace deserves a multimillion-pound look.
 * Black + Gold = Premium luxury meets industrial strength.
 */

// ============================================================================
// BRAND COLOR TOKENS
// ============================================================================

const brandColors = {
  // True blacks for deep, premium feel
  black: '#000000',
  richBlack: '#040404',
  charcoal: '#0A0A0A',
  graphite: '#141414',
  slate: '#1A1A1A',

  // Gold system - the signature accent
  gold: '#FFD700',
  goldLight: '#FFDF33',
  goldDim: '#B8860B',
  amber: '#FFA500',
  bronze: '#CD7F32',

  // Pure white for contrast
  white: '#FFFFFF',

  // Semantic colors
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

// ============================================================================
// RESPONSIVE UTILITIES (Lena's Performance & Scale)
// ============================================================================

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard mobile device (iPhone 13 size)
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

/**
 * Scaled size based on screen width.
 */
export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Vertical scaled size based on screen height.
 */
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Moderate scaling to avoid over-scaling on tablets.
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isTablet = SCREEN_WIDTH > 600;

/**
 * Standard touch target size (Lena's recommendation for accessibility)
 */
export const touchTarget = 44;


// ============================================================================
// THEME DEFINITIONS
// ============================================================================

/**
 * Dark Theme (Default) - Premium Black + Gold
 * This is the primary brand experience
 */
const darkTheme = {
  // Backgrounds (layered for depth)
  background: brandColors.black,
  backgroundElevated: brandColors.richBlack,
  card: brandColors.charcoal,
  cardElevated: brandColors.graphite,
  surface: brandColors.slate,

  // Text hierarchy
  text: brandColors.white,
  textSecondary: '#A3A3A3',
  textMuted: '#666666',
  textGold: brandColors.gold,

  // Accent and actions
  primary: brandColors.gold,
  primaryLight: brandColors.goldLight,
  primaryDim: brandColors.goldDim,
  secondary: brandColors.amber,
  accent: brandColors.bronze,

  // Raw Brand Colors
  black: brandColors.black,
  white: brandColors.white,
  gold: brandColors.gold,

  // Interactive states
  border: 'rgba(255, 215, 0, 0.15)',
  borderActive: brandColors.gold,
  inputBackground: brandColors.graphite,
  inputBorder: brandColors.slate,

  // Navigation
  tabBar: brandColors.black,
  tabBarBorder: 'rgba(255, 215, 0, 0.1)',
  tabActive: brandColors.gold,
  tabInactive: '#666666',

  // Semantic
  success: brandColors.success,
  error: brandColors.error,
  warning: brandColors.warning,
  info: brandColors.info,

  // Special effects
  overlay: 'rgba(0, 0, 0, 0.8)',
  goldGlow: 'rgba(255, 215, 0, 0.3)',
  goldGlowStrong: 'rgba(255, 215, 0, 0.5)',

  // Shadows
  shadowColor: '#FFD700',
  shadowColorSubtle: 'rgba(255, 215, 0, 0.1)',
};

/**
 * Light Theme - For accessibility (rarely used)
 * Maintains gold accents but with light backgrounds
 */
const lightTheme = {
  // Backgrounds
  background: '#FAFAFA',
  backgroundElevated: '#FFFFFF',
  card: '#FFFFFF',
  cardElevated: '#F5F5F5',
  surface: '#EEEEEE',

  // Text hierarchy
  text: '#0A0A0A',
  textSecondary: '#525252',
  textMuted: '#8A8A8A',
  textGold: brandColors.goldDim,

  // Accent and actions
  primary: brandColors.goldDim,
  primaryLight: brandColors.gold,
  primaryDim: brandColors.bronze,
  secondary: brandColors.amber,
  accent: brandColors.bronze,

  // Raw Brand Colors
  black: brandColors.black,
  white: brandColors.white,
  gold: brandColors.gold,

  // Interactive states
  border: 'rgba(0, 0, 0, 0.1)',
  borderActive: brandColors.goldDim,
  inputBackground: '#F5F5F5',
  inputBorder: '#E0E0E0',

  // Navigation
  tabBar: '#FFFFFF',
  tabBarBorder: 'rgba(0, 0, 0, 0.1)',
  tabActive: brandColors.goldDim,
  tabInactive: '#8A8A8A',

  // Semantic
  success: brandColors.success,
  error: brandColors.error,
  warning: brandColors.warning,
  info: brandColors.info,

  // Special effects
  overlay: 'rgba(0, 0, 0, 0.5)',
  goldGlow: 'rgba(255, 215, 0, 0.2)',
  goldGlowStrong: 'rgba(255, 215, 0, 0.3)',

  // Shadows
  shadowColor: '#000000',
  shadowColorSubtle: 'rgba(0, 0, 0, 0.1)',
};

// ============================================================================
// TYPOGRAPHY SCALE
// ============================================================================

export const typography = {
  // Display (Hero)
  display: {
    fontSize: 48,
    fontWeight: '900' as const,
    letterSpacing: -1,
    lineHeight: 52,
  },
  // Headings
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  // Small
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0,
    lineHeight: 16,
  },
  // Special
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
    textTransform: 'uppercase' as const,
  },
  price: {
    fontSize: 24,
    fontWeight: '900' as const,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
};

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const radius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// ============================================================================
// SHADOWS (with gold glow for dark theme)
// ============================================================================

export const shadows = {
  sm: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
};

// ============================================================================
// CONTEXT & HOOKS
// ============================================================================

export type ThemeType = 'light' | 'dark' | 'system';
export type ThemeColors = typeof darkTheme;

interface ThemeContextType {
  theme: ThemeColors;
  colors: ThemeColors; // Alias for convenience
  themeType: ThemeType;
  isDark: boolean;
  setThemeType: (type: ThemeType) => void;
  toggleTheme: () => void;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  shadows: typeof shadows;
  layout: {
    width: number;
    height: number;
    isSmallDevice: boolean;
    isTablet: boolean;
    scale: (size: number) => number;
    moderateScale: (size: number, factor?: number) => number;
    touchTarget: number;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('dark'); // Default to dark (premium)

  // Determine if dark mode based on preference
  const isDark = themeType === 'system'
    ? systemColorScheme === 'dark'
    : themeType === 'dark';

  // Select theme colors
  const theme = isDark ? darkTheme : lightTheme;

  // Update status bar
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
  }, [isDark]);

  const toggleTheme = () => {
    setThemeType((prevType: ThemeType) => (prevType === 'dark' ? 'light' : 'dark'));
  };

  const value: ThemeContextType = {
    theme,
    colors: theme, // Alias
    themeType,
    isDark,
    setThemeType,
    toggleTheme,
    typography,
    spacing,
    radius,
    shadows,
    layout: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      isSmallDevice,
      isTablet,
      scale,
      moderateScale,
      touchTarget,
    },
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default useTheme;