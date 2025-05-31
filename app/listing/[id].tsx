import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, ActivityIndicator, Alert, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Heart, Share2, ChevronLeft, MapPin, Phone, MessageSquare } from 'lucide-react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { mockListings } from '@/data/mockData';
import MapView from '@/components/MapView';

export default function ListingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Fetch listing data
  const fetchListing = useCallback(async () => {
    try {
      setLoading(true);
      
      // For now, we'll use mock data
      // In a real app, you'd fetch from Supabase
      const foundListing = mockListings.find(item => item.id.toString() === id);
      
      if (foundListing) {
        setListing(foundListing);
        
        // Check if this listing is already unlocked by this user
        if (user) {
          try {
            const { data: unlockData } = await supabase
              .from('unlocks')
              .select('*')
              .eq('user_id', user.id)
              .eq('listing_id', id)
              .single();
              
            setUnlocked(!!unlockData);
            
            // Check if listing is favorited
            const { data: favData } = await supabase
              .from('favorites')
              .select('*')
              .eq('user_id', user.id)
              .eq('listing_id', id)
              .single();
              
            setFavorited(!!favData);
          } catch (error) {
            // If no data is found, these queries will throw errors
            // which is expected behavior for new users
            console.log('User data check error:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching listing:', error);
      Alert.alert('Error', 'Failed to load listing details');
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  // Fetch data when screen mounts
  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  // Handle payment for unlocking contact info
  const handleUnlock = async () => {
    if (!isAuthenticated) {
      return Alert.alert(
        'Login Required',
        'Please login to unlock seller contact information',
        [
          { text: 'Cancel' },
          { text: 'Login', onPress: () => router.push('../login') }
        ]
      );
    }

    try {
      setPaymentLoading(true);
      
      // Fetch payment intent from Supabase Edge Function
      const response = await fetch(
        'https://otwslrepaneebmlttkwu.supabase.co/functions/v1/create-payment-intent',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount: 100, // £1 in pence
            currency: 'gbp',
            description: `Unlock listing ${id}`,
            customer_email: user.email,
          }),
        }
      );
      
      const { paymentIntent, ephemeralKey, customer, publishableKey } = await response.json();
      
      if (!paymentIntent) {
        throw new Error('Failed to create payment intent');
      }
      
      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'PoundTrades',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: user.full_name,
          email: user.email,
        },
      });
      
      if (initError) {
        throw new Error(initError.message);
      }
      
      // Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();
      
      if (paymentError) {
        if (paymentError.code === 'Canceled') {
          setPaymentLoading(false);
          return; // User canceled, just return without error
        }
        throw new Error(paymentError.message);
      }
      
      // Payment successful, record the unlock in Supabase
      try {
        const { error: unlockError } = await supabase
          .from('unlocks')
          .insert([{
            user_id: user.id,
            listing_id: id,
            amount: 100, // £1 in pence
            payment_intent: paymentIntent.split('_secret_')[0], // Extract the payment intent ID
            created_at: new Date().toISOString()
          }]);
          
        if (unlockError) throw new Error(unlockError.message);
      } catch (dbError) {
        console.log('Database error:', dbError);
        // Continue anyway since payment was successful
      }
      
      setUnlocked(true);
      setPaymentLoading(false);
      
      Alert.alert('Success', 'Seller contact information unlocked!');
    } catch (error) {
      setPaymentLoading(false);
      Alert.alert('Payment Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    }
  };

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      return Alert.alert(
        'Login Required',
        'Please login to save favorites',
        [
          { text: 'Cancel' },
          { text: 'Login', onPress: () => router.push('../login') }
        ]
      );
    }

    try {
      if (favorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('listing_id', id);
      } else {
        await supabase
          .from('favorites')
          .insert([{
            user_id: user.id,
            listing_id: id,
            created_at: new Date().toISOString()
          }]);
      }
      setFavorited(!favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  // Share listing
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this listing on PoundTrades: ${listing.title} for £${listing.price}`,
        // In a real app, you'd include a deep link URL here
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Listing not found or has been removed.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.button, { backgroundColor: theme.primary, marginTop: 24 }]}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header with back button and actions */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={theme.primary} />
          </Pressable>
          
          <View style={styles.headerActions}>
            <Pressable onPress={toggleFavorite} style={styles.actionButton}>
              <Heart 
                size={24} 
                color={favorited ? '#f43f5e' : theme.primary}
                fill={favorited ? '#f43f5e' : 'transparent'}
              />
            </Pressable>
            
            <Pressable onPress={handleShare} style={styles.actionButton}>
              <Share2 size={24} color={theme.primary} />
            </Pressable>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Image
            source={{ uri: listing.image }}
            style={[styles.image, styles.imageShadow]}
            resizeMode="cover"
          />

          <View style={styles.detailsContainer}>
            <Text style={[styles.title, { color: theme.text }]}>{listing.title}</Text>
            <Text style={[styles.price, { color: theme.primary }]}>£{listing.price}</Text>

            <View style={[styles.sellerType, { backgroundColor: listing.userType === 'Business' ? '#10b981' : '#3b82f6' }]}>
              <Text style={styles.sellerTypeText}>{listing.userType}</Text>
            </View>

            <Text style={[styles.description, { color: theme.text }]}>{listing.description}</Text>

            {/* Location info */}
            <View style={styles.locationContainer}>
              <MapPin size={18} color={theme.primary} />
              <Text style={[styles.locationText, { color: theme.secondaryText }]}>
                {listing.location}
              </Text>
            </View>

            {/* Map View */}
            {listing.latitude && listing.longitude ? (
              <MapView
                latitude={listing.latitude}
                longitude={listing.longitude}
                title={listing.title}
                height={180}
                zoomLevel={15}
              />
            ) : (
              <MapView
                // Default to London if no coordinates
                latitude={51.5074}
                longitude={-0.1278}
                title="Approximate Location"
                height={180}
                zoomLevel={10}
              />
            )}

            {/* Contact info section */}
            {!unlocked ? (
              <Pressable
                onPress={handleUnlock}
                disabled={paymentLoading}
                style={[styles.unlockButton, { backgroundColor: theme.primary }]}
              >
                {paymentLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.unlockButtonText}>
                    Unlock Seller Info – £1
                  </Text>
                )}
              </Pressable>
            ) : (
              <View style={[styles.contactContainer, { backgroundColor: '#10b981' }]}>
                <Text style={styles.contactTitle}>Seller Contact Info:</Text>
                <Text style={styles.contactInfo}>{listing.contactInfo || '07123 456789'}</Text>
                
                {/* Call/message buttons */}
                <View style={styles.contactActions}>
                  <Pressable style={[styles.contactButton, { backgroundColor: '#3b82f6' }]}>
                    <Phone size={16} color="#fff" />
                    <Text style={styles.contactButtonText}>Call</Text>
                  </Pressable>
                  <Pressable style={[styles.contactButton, { backgroundColor: '#10b981' }]}>
                    <MessageSquare size={16} color="#fff" />
                    <Text style={styles.contactButtonText}>Message</Text>
                  </Pressable>
                </View>
              </View>
            )}
            
            {/* Posted date */}
            <Text style={[styles.postedDate, { color: theme.secondaryText }]}>
              Posted {new Date(listing.date || Date.now()).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        {/* Bottom padding */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 16,
  },
  content: {
    paddingHorizontal: 20,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  imageShadow: {
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  detailsContainer: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sellerType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  sellerTypeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
  },
  unlockButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  unlockButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  contactContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  postedDate: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});