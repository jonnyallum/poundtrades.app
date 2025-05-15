import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, ChevronRight, ChevronLeft, Heart } from 'lucide-react-native';
import StatusBadge from './StatusBadge';
import { useTheme } from '@/hooks/useTheme';

type ListingCardProps = {
  listing: any;
  compact?: boolean;
  showStatus?: boolean;
};

export default function ListingCard({ listing, compact = false, showStatus = false }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { title, price, location, images, status, userType } = listing;
  const { theme } = useTheme();

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <Link href="/(tabs)/listings" asChild>
      <Pressable style={[
        styles.card, 
        compact && styles.compactCard,
        { backgroundColor: theme.card }
      ]}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[currentImageIndex] }} style={styles.image} />
          
          {images.length > 1 && (
            <>
              <Pressable 
                style={[styles.arrowButton, styles.leftArrow]} 
                onPress={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
              >
                <ChevronLeft size={16} color="#fff" />
              </Pressable>
              <Pressable 
                style={[styles.arrowButton, styles.rightArrow]} 
                onPress={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
              >
                <ChevronRight size={16} color="#fff" />
              </Pressable>
            </>
          )}
          
          <Pressable 
            style={styles.favoriteButton}
            onPress={(e) => {
              e.stopPropagation();
              // Toggle favorite logic would go here
            }}
          >
            <Heart size={20} color="#fff" />
          </Pressable>
          
          <View style={[styles.priceTag, { backgroundColor: theme.primary }]}>
            <Text style={styles.priceText}>£{price}</Text>
          </View>
          
          {showStatus && (
            <View style={styles.statusBadgeContainer}>
              <StatusBadge status={status} />
            </View>
          )}
          
          <View style={[styles.userTypeContainer, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
            <Text style={styles.userTypeText}>{userType}</Text>
          </View>
        </View>
        
        <View style={styles.contentContainer}>
          <Text 
            style={[
              styles.title, 
              compact && styles.compactTitle,
              { color: theme.text }
            ]} 
            numberOfLines={compact ? 1 : 2}
          >
            {title}
          </Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={theme.secondaryText} />
            <Text style={[styles.locationText, { color: theme.secondaryText }]} numberOfLines={1}>
              {location}
            </Text>
          </View>
          
          {!compact && status !== 'sold' && (
            <View style={[styles.connectContainer, { borderTopColor: theme.border }]}>
              <Text style={[styles.connectText, { color: theme.text }]}>Only £1 to connect</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactCard: {
    height: 160,
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  priceText: {
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  userTypeContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  userTypeText: {
    fontSize: 10,
    color: '#fff',
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 14,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginLeft: 4,
  },
  connectContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
  },
  connectText: {
    fontWeight: '600',
    fontSize: 13,
  },
});