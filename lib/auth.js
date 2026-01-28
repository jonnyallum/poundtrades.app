import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { supabase, isSupabaseConfigured } from './supabase';

const canUseAsyncStorage = typeof window !== 'undefined';

const safeGetItem = async (key) => {
  if (!canUseAsyncStorage) return null;
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read ${key} from storage:`, error);
    return null;
  }
};

const safeSetItem = async (key, value) => {
  if (!canUseAsyncStorage) return;
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to write ${key} to storage:`, error);
  }
};

const safeRemoveItem = async (key) => {
  if (!canUseAsyncStorage) return;
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from storage:`, error);
  }
};

// Auth store with Zustand
export const useAuthStore = create((set, get) => ({
  user: null,
  userProfile: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,

  // Fetch user profile from database
  fetchUserProfile: async (userId) => {
    if (!userId || !isSupabaseConfigured) return null;
    
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
      if (!isSupabaseConfigured) {
        set({
          user,
          userProfile: null,
          isAuthenticated: true,
          isAdmin: false
        });

        await safeSetItem('user', JSON.stringify(user));
        return;
      }

      const profile = await get().fetchUserProfile(user.id);
      set({ 
        user, 
        userProfile: profile,
        isAuthenticated: true,
        isAdmin: profile?.user_type === 'admin'
      });
      
      // Save to AsyncStorage
      await safeSetItem('user', JSON.stringify(user));
      if (profile) {
        await safeSetItem('userProfile', JSON.stringify(profile));
      }
    } else {
      set({
        user: null,
        userProfile: null,
        isAuthenticated: false,
        isAdmin: false
      });

      // Clear AsyncStorage
      await safeRemoveItem('user');
      await safeRemoveItem('userProfile');
    }
  },

  // Initialize auth state from storage and Supabase
  initialize: async () => {
    set({ isLoading: true });
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase is not configured. Auth state will fall back to AsyncStorage only.');
        const userJson = await safeGetItem('user');
        const profileJson = await safeGetItem('userProfile');

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
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await get().updateUserState(session.user);
      } else {
        const userJson = await safeGetItem('user');
        const profileJson = await safeGetItem('userProfile');

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
      if (!isSupabaseConfigured) {
        set({ isLoading: false });
        return {
          success: false,
          error: 'Supabase is not configured. Login is unavailable.'
        };
      }

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
      if (!isSupabaseConfigured) {
        set({ isLoading: false });
        return {
          success: false,
          error: 'Supabase is not configured. Logout is unavailable.'
        };
      }

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
      if (!isSupabaseConfigured) {
        set({ isLoading: false });
        return {
          success: false,
          error: 'Supabase is not configured. Registration is unavailable.'
        };
      }

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
    if (user && isSupabaseConfigured) {
      const profile = await get().fetchUserProfile(user.id);
      set({ 
        userProfile: profile,
        isAdmin: profile?.user_type === 'admin'
      });
      
      if (profile) {
        await safeSetItem('userProfile', JSON.stringify(profile));
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