import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { X, Camera, Upload } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { listingsService, categoriesService } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';

interface CreateListingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CategoryOption {
  id: number;
  name: string;
}

interface FormDataState {
  title: string;
  description: string;
  price: string;
  category_id: string;
  location: string;
  images: string[];
}

export default function CreateListingModal({ visible, onClose, onSuccess }: CreateListingModalProps) {
  const { theme } = useTheme();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    price: '',
    category_id: '',
    location: '',
    images: [],
  });

  // Load categories on mount
  useEffect(() => {
    if (visible) {
      loadCategories();
    }
  }, [visible]);

  const loadCategories = async () => {
    const { data, error } = await categoriesService.getCategories();
    if (!error && data) {
      setCategories(data as CategoryOption[]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 5) // Max 5 images
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (!formData.price.trim() || isNaN(parseFloat(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    if (!formData.category_id) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create a listing');
      return;
    }

    setIsLoading(true);

    try {
      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        location: formData.location.trim(),
        images: formData.images, // For now, store as array - in production you'd upload to storage
        user_id: user.id,
        status: 'active'
      };

      const { data, error } = await listingsService.createListing(listingData);

      if (error) {
        Alert.alert('Error', 'Failed to create listing. Please try again.');
        console.error('Create listing error:', error);
        return;
      }

      Alert.alert('Success', 'Your listing has been created successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        category_id: '',
        location: '',
        images: [],
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Create listing error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Create New Listing</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.text} />
          </Pressable>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Title *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="e.g., Reclaimed Oak Beams"
              placeholderTextColor={theme.secondaryText}
              value={formData.title}
              onChangeText={(value) => handleInputChange('title', value)}
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description *</Text>
            <TextInput
              style={[styles.textArea, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="Describe your materials in detail..."
              placeholderTextColor={theme.secondaryText}
              value={formData.description}
              onChangeText={(value) => handleInputChange('description', value)}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Price */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Price (£) *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="0.00"
              placeholderTextColor={theme.secondaryText}
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Category *</Text>
            <View style={[styles.pickerContainer, { 
              backgroundColor: theme.card,
              borderColor: theme.border 
            }]}>
              <Picker
                selectedValue={formData.category_id}
                onValueChange={(value) => handleInputChange('category_id', value)}
                style={{ color: theme.text }}
              >
                <Picker.Item label="Select a category..." value="" />
                {categories.map((category) => (
                  <Picker.Item 
                    key={category.id} 
                    label={category.name} 
                    value={category.id.toString()} 
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Location */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Location *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                color: theme.text,
                borderColor: theme.border 
              }]}
              placeholder="e.g., Manchester, UK"
              placeholderTextColor={theme.secondaryText}
              value={formData.location}
              onChangeText={(value) => handleInputChange('location', value)}
            />
          </View>

          {/* Photos */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Photos</Text>
            <Pressable 
              style={[styles.photoButton, { 
                backgroundColor: theme.card,
                borderColor: theme.border 
              }]}
              onPress={pickImage}
            >
              <Upload size={24} color={theme.primary} />
              <Text style={[styles.photoButtonText, { color: theme.text }]}>
                Add Photos ({formData.images.length}/5)
              </Text>
            </Pressable>

            {/* Image Preview */}
            {formData.images.length > 0 && (
              <ScrollView horizontal style={styles.imagePreview} showsHorizontalScrollIndicator={false}>
                {formData.images.map((uri, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image source={{ uri }} style={styles.previewImage} />
                    <Pressable 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <X size={16} color="#fff" />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Submit Button */}
          <Pressable 
            style={[styles.submitButton, { 
              backgroundColor: theme.primary,
              opacity: isLoading ? 0.7 : 1 
            }]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.submitButtonText}>Create Listing</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photoButton: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    marginTop: 8,
    fontSize: 16,
  },
  imagePreview: {
    marginTop: 15,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

