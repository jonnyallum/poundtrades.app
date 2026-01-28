import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type Theme = {
    colors: {
        background: string;
        surface: string;
        card: string;
        text: string;
        textMuted: string;
        border: string;
        primary: string;
        primaryDark: string;
        accent: string;
        status: {
            active: string;
            pending: string;
            sold: string;
        };
        gradients: {
            gold: string[];
            surface: string[];
            glass: string[];
        };
    };
    statusBar: 'light' | 'dark' | 'auto';
};

export const lightTheme: Theme = {
    colors: {
        background: '#FFFFFF',
        surface: '#F5F5F7',
        card: '#FFFFFF',
        text: '#1D1D1F',
        textMuted: '#86868B',
        border: '#D2D2D7',
        primary: '#FFD700',
        primaryDark: '#B8860B',
        accent: '#0071E3',
        status: {
            active: '#34C759',
            pending: '#FF9500',
            sold: '#FF3B30',
        },
        gradients: {
            gold: ['#FFD700', '#B8860B'],
            surface: ['#FFFFFF', '#F5F5F7'],
            glass: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.4)'],
        }
    },
    statusBar: 'dark',
};

export const darkTheme: Theme = {
    colors: {
        background: '#000000',
        surface: '#1C1C1E',
        card: '#1C1C1E',
        text: '#F5F5F7',
        textMuted: '#86868B',
        border: '#38383A',
        primary: '#FFD700',
        primaryDark: '#B8860B',
        accent: '#0A84FF',
        status: {
            active: '#32D74B',
            pending: '#FF9F0A',
            sold: '#FF453A',
        },
        gradients: {
            gold: ['#FFD700', '#D4AF37'],
            surface: ['#1C1C1E', '#000000'],
            glass: ['rgba(28,28,30,0.8)', 'rgba(28,28,30,0.4)'],
        }
    },
    statusBar: 'light',
};

type ThemeType = 'light' | 'dark' | 'system';
type ThemeContextType = {
    theme: Theme;
    themeType: ThemeType;
    isDark: boolean;
    setThemeType: (type: ThemeType) => void;
    toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [themeType, setThemeType] = useState<ThemeType>('system');

    const isDark =
        themeType === 'dark' ||
        (themeType === 'system' && systemColorScheme === 'dark');

    const theme = isDark ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setThemeType(prevType => {
            if (prevType === 'system') return 'light';
            if (prevType === 'light') return 'dark';
            return 'system';
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, themeType, isDark, setThemeType, toggleTheme }}>
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
