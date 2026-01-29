import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, Package, MapPin, PlusSquare, User } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/auth';
import { router } from 'expo-router';

export default function TabLayout() {
  const { colors, typography, shadows } = useTheme();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Check authentication status for protected routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('../login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.black,
          borderTopColor: 'rgba(255, 215, 0, 0.1)',
          height: 65,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          ...shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.5,
          marginTop: -4,
        },
        headerStyle: {
          backgroundColor: colors.black,
          borderBottomColor: 'rgba(255, 215, 0, 0.1)',
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 18,
          letterSpacing: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Home size={24} color={color} strokeWidth={2.5} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'MARKET',
          tabBarIcon: ({ color }) => <Package size={24} color={color} strokeWidth={2.5} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="wanted"
        options={{
          title: 'WANTED',
          tabBarIcon: ({ color }) => <PlusSquare size={24} color={color} strokeWidth={2.5} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'NEARBY',
          tabBarIcon: ({ color }) => <MapPin size={24} color={color} strokeWidth={2.5} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={2.5} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}