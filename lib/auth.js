import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { supabase } from './supabase';

// Auth store with Zustand
export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,

  // Fetch user profile from database
  fetchUserProfile: async (userId) => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  },

  // Update user state with profile
  updateUserState: async (user) => {
    if (user) {
      const profile = await get().fetchUserProfile(user.id);
      set({ 
        user, 
        userProfile: profile,
        isAuthenticated: true,
        isAdmin: profile?.user_type === 'admin'
      });
      
      // Save to AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(user));
      if (profile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } else {
      set({ 
        user: null, 
        userProfile: null,
        isAuthenticated: false,
        isAdmin: false
      });
      
      // Clear AsyncStorage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('userProfile');
    }
  },

  // Initialize auth state from storage and Supabase
  initialize: async () => {
    set({ isLoading: true });
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await get().updateUserState(session.user);
      } else {
        // Try to restore from AsyncStorage as fallback
        const userJson = await AsyncStorage.getItem('user');
        const profileJson = await AsyncStorage.getItem('userProfile');
        
        if (userJson) {
          const user = JSON.parse(userJson);
          const profile = profileJson ? JSON.parse(profileJson) : null;
          
          set({ 
            user, 
            userProfile: profile,
            isAuthenticated: true,
            isAdmin: profile?.user_type === 'admin'
          });
        }
      }

      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        await get().updateUserState(session?.user ?? null);
      });

    } catch (error) {
      console.error('Failed to initialize auth state:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Login function with Supabase
  login: async (email, password) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        set({ isLoading: false });
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      if (data.user) {
        await get().updateUserState(data.user);
        set({ isLoading: false });
        return { success: true };
      }
      
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'Login failed' 
      };
      
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An error occurred during login' 
      };
    }
  },

  // Logout function with Supabase
  logout: async () => {
    set({ isLoading: true });
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      await get().updateUserState(null);
      set({ isLoading: false });
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

  // Register function with Supabase
  register: async (email, password, userData = {}) => {
    set({ isLoading: true });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) {
        set({ isLoading: false });
        return { 
          success: false, 
          error: error.message 
        };
      }
      
      if (data.user) {
        // User will be automatically logged in after email confirmation
        set({ isLoading: false });
        return { 
          success: true,
          message: 'Please check your email to confirm your account'
        };
      }
      
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'Registration failed' 
      };
      
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      return { 
        success: false, 
        error: 'An error occurred during registration' 
      };
    }
  },

  // Refresh user profile
  refreshUserProfile: async () => {
    const { user } = get();
    if (user) {
      const profile = await get().fetchUserProfile(user.id);
      set({ 
        userProfile: profile,
        isAdmin: profile?.user_type === 'admin'
      });
      
      if (profile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      }
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

// Helper function to check if user is admin
export const isAdmin = () => {
  return useAuthStore.getState().isAdmin;
};

// Helper function to get user profile
export const getUserProfile = () => {
  return useAuthStore.getState().userProfile;
};