import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Home, Package, MapPin, PlusSquare, User } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/auth';
import { router } from 'expo-router';

export default function TabLayout() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuthStore();

  // Check authentication status for protected routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace('../login');
    }
  }, [isAuthenticated, isLoading]);

  // Don't render tabs until authentication check is complete
  if (isLoading) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color }) => <Package size={22} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="wanted"
        options={{
          title: 'Wanted',
          tabBarIcon: ({ color }) => <PlusSquare size={22} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapPin size={22} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}