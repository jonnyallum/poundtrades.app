import { createContext, useContext, ReactNode } from 'react';

const ThemeContext = createContext({
    colors: {
        background: '#040404', // Richer off-black
        surface: '#0D0D0D', // Slightly lighter surface
        surfaceLighter: '#1A1A1A',
        text: '#FFFFFF',
        textMuted: '#A0A0A0',
        primary: '#FFD700', // Metallic Gold
        primaryDark: '#B8860B',
        accent: '#FFD700',
        border: 'rgba(255, 215, 0, 0.1)', // Gold border with low opacity
        status: {
            active: '#00FF9D', // Neon Green
            pending: '#FFA500', // Bright Amber
            sold: '#FF3B30', // Vibrant Red
        },
        gradients: {
            gold: ['#FFD700', '#B8860B'],
            black: ['#1A1A1A', '#000000'],
            glass: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)'],
        }
    }
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContext.Provider value={{
            colors: {
                background: '#040404',
                surface: '#0D0D0D',
                surfaceLighter: '#1A1A1A',
                text: '#FFFFFF',
                textMuted: '#A0A0A0',
                primary: '#FFD700',
                primaryDark: '#B8860B',
                accent: '#FFD700',
                border: 'rgba(255, 215, 0, 0.1)',
                status: {
                    active: '#00FF9D',
                    pending: '#FFA500',
                    sold: '#FF3B30',
                },
                gradients: {
                    gold: ['#FFD700', '#B8860B'],
                    black: ['#1A1A1A', '#000000'],
                    glass: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.01)'],
                }
            }
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
