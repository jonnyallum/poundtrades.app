import { createContext, useContext, ReactNode } from 'react';

const ThemeContext = createContext({
    colors: {
        background: '#000000',
        card: '#121212',
        text: '#FFFFFF',
        primary: '#FFD700', // Gold/Yellow
        secondary: '#333333',
        accent: '#FFD700',
        status: {
            active: '#4CAF50', // Green
            pending: '#FFC107', // Amber
            sold: '#F44336', // Red
        }
    }
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    return (
        <ThemeContext.Provider value={{
            colors: {
                background: '#000000',
                card: '#121212',
                text: '#FFFFFF',
                primary: '#FFD700',
                secondary: '#333333',
                accent: '#FFD700',
                status: {
                    active: '#4CAF50',
                    pending: '#FFC107',
                    sold: '#F44336',
                }
            }
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
