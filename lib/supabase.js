import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

// Initialize the Supabase client with environment variables
export const supabase = createClient(
  SUPABASE_URL || 'https://otwslrepaneebmlttkwu.supabase.co',
  SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5OTM0OTgsImV4cCI6MjA2MjU2OTQ5OH0.kANMGs3PXdDxO7SgJUjrQfKXLB6PE2-6WtXknjHW9UE',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

/**
 * Authenticate user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Authentication result
 */
export const signInWithEmail = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing in:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user data
 * @returns {Promise} - Registration result
 */
export const signUpWithEmail = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (error) {
    console.error('Error signing up:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Sign out the current user
 * @returns {Promise} - Sign out result
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get the current user session
 * @returns {Promise} - Current session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return { success: true, session: data.session };
  } catch (error) {
    console.error('Error getting session:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Get the current user
 * @returns {Promise} - Current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Error getting user:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Promise} - Password reset result
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'poundtrades://reset-password',
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Update user password
 * @param {string} password - New password
 * @returns {Promise} - Password update result
 */
export const updatePassword = async (password) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

/**
 * Update user profile
 * @param {Object} updates - Profile updates
 * @returns {Promise} - Profile update result
 */
export const updateProfile = async (updates) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: updates,
    });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Export the Supabase client and auth functions
export default {
  supabase,
  signInWithEmail,
  signUpWithEmail,
  signOut,
  getCurrentSession,
  getCurrentUser,
  resetPassword,
  updatePassword,
  updateProfile,
};