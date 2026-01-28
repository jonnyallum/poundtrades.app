import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/hooks/useTheme';
import { View } from 'react-native';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function RootLayout() {
    useFrameworkReady();
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState(false);
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setInitialized(true);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    useEffect(() => {
        if (!initialized) return;

        const inAuthGroup = segments[0] === 'login';

        if (!session && !inAuthGroup) {
            // Redirect to the login page if the user is not authenticated
            router.replace('/login');
        } else if (session && inAuthGroup) {
            // Redirect to the home page if the user is authenticated and on the login page
            router.replace('/');
        }
    }, [session, segments, initialized]);

    return (
        <ThemeProvider>
            <View style={{ flex: 1, backgroundColor: '#040404' }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: '#040404',
                        },
                        animation: 'fade_from_bottom',
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="map" options={{ presentation: 'fullScreenModal' }} />
                    <Stack.Screen name="login" options={{ presentation: 'modal' }} />
                    <Stack.Screen name="create-listing" options={{ presentation: 'modal' }} />
                </Stack>
                <StatusBar style="light" translucent backgroundColor="transparent" />
            </View>
        </ThemeProvider>
    );
}
