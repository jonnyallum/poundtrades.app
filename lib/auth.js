import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// Mock admin users for testing
const ADMIN_USERS = [
  { email: 'admin@poundtrades.co.uk', password: 'admin123', name: 'Admin User', userType: 'Admin' },
  { email: 'test@poundtrades.co.uk', password: 'test123', name: 'Test User', userType: 'User' },
];

// Auth store with Zustand
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  // Initialize auth state from storage
  initialize: async () => {
    set({ isLoading: true });
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = ADMIN_USERS.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      
      if (user) {
        // Create user object without password
        const userData = {
          email: user.email,
          name: user.name,
          userType: user.userType,
          image: 'https://randomuser.me/api/portraits/men/32.jpg', // Default avatar
          joinDate: new Date().toISOString(),
        };
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        
        // Update state
        set({ 
          user: userData, 
          isAuthenticated: true, 
          isLoading: false 
        });
        
        return { success: true };
      } else {
        set({ isLoading: false });
        return { 
          success: false, 
          error: 'Invalid email or password' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An error occurred during login' 
      };
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await AsyncStorage.removeItem('user');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An error occurred during logout' 
      };
    }
  },

  // Register function (for future implementation)
  register: async (userData) => {
    set({ isLoading: true });
    
    try {
      // This would be replaced with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, just show an alert that registration is not implemented
      Alert.alert(
        "Registration",
        "Registration functionality will be implemented in a future update.",
        [{ text: "OK" }]
      );
      
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'Registration not implemented yet' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An error occurred during registration' 
      };
    }
  }
}));

// Initialize auth state when the module is imported
useAuthStore.getState().initialize();

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return useAuthStore.getState().isAuthenticated;
};

// Helper function to get current user
export const getCurrentUser = () => {
  return useAuthStore.getState().user;
};