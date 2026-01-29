import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload an image to Supabase Storage
 * @param {string} uri - Local image URI
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder path within bucket
 * @returns {Promise} - Upload result
 */
export const uploadImage = async (uri, bucket = 'listings', folder = '') => {
  try {
    // Generate a unique file name
    const fileExt = uri.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Read the file as base64
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    // Resize image to reduce file size
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1200 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Convert to base64
    const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete an image from Supabase Storage
 * @param {string} path - File path in storage
 * @param {string} bucket - Storage bucket name
 * @returns {Promise} - Delete result
 */
export const deleteImage = async (path, bucket = 'listings') => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting image:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Pick an image from the device's library
 * @returns {Promise} - Image picker result
 */
export const pickImage = async () => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return { success: false, canceled: true };
    }
    
    return { 
      success: true, 
      uri: result.assets[0].uri 
    };
  } catch (error) {
    console.error('Error picking image:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Take a photo with the device's camera
 * @returns {Promise} - Camera result
 */
export const takePhoto = async () => {
  try {
    // Request permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied');
    }
    
    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return { success: false, canceled: true };
    }
    
    return { 
      success: true, 
      uri: result.assets[0].uri 
    };
  } catch (error) {
    console.error('Error taking photo:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get a signed URL for a file (for temporary access)
 * @param {string} path - File path in storage
 * @param {string} bucket - Storage bucket name
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {Promise} - Signed URL result
 */
export const getSignedUrl = async (path, bucket = 'listings', expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    
    return { 
      success: true, 
      signedUrl: data.signedUrl 
    };
  } catch (error) {
    console.error('Error getting signed URL:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export all storage functions
export default {
  uploadImage,
  deleteImage,
  pickImage,
  takePhoto,
  getSignedUrl,
};