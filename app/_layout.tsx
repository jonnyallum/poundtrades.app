import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/hooks/useTheme';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
    useFrameworkReady();

    return (
        <ThemeProvider>
            <View style={{ flex: 1, backgroundColor: '#000000' }}>
                <Stack
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#000000',
                        },
                        headerTintColor: '#FFD700',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        contentStyle: {
                            backgroundColor: '#000000',
                        },
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
                    <Stack.Screen name="login" options={{ headerShown: false, presentation: 'modal' }} />
                </Stack>
                <StatusBar style="light" />
            </View>
        </ThemeProvider>
    );
}
