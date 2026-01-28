import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, ChevronRight, ChevronLeft, Heart } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import StatusBadge from './StatusBadge';
import { useTheme } from '@/hooks/useTheme';

type ListingCardProps = {
  listing: any;
  compact?: boolean;
  showStatus?: boolean;
};

const { width } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ListingCard({ listing, compact = false, showStatus = false }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { title, price, location, images, status, userType } = listing;
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const isWeb = Platform.OS === 'web';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
    if (!isWeb) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    if (!isWeb) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressIn = () => {
    if (!isWeb) scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    if (!isWeb) scale.value = withSpring(1);
  };

  // Use regular Pressable on web to avoid reanimated CSS issues
  const CardWrapper = isWeb ? Pressable : AnimatedPressable;
  const cardStyles = isWeb
    ? [styles.card, compact && styles.compactCard, { backgroundColor: theme.colors.card, shadowColor: '#000' }]
    : [styles.card, compact && styles.compactCard, { backgroundColor: theme.colors.card, shadowColor: '#000' }, animatedStyle];

  return (
    <Link
      href={{
        pathname: "/listing/[id]" as any,
        params: { id: listing.id.toString() }
      }}
      asChild
    >
      <CardWrapper
        style={cardStyles as any}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={[styles.imageContainer, compact && styles.compactImageContainer]}>
          <Image source={{ uri: images[currentImageIndex] }} style={styles.image} />

          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
            style={StyleSheet.absoluteFill}
          />

          {images.length > 1 && !compact && (
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
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
          >
            <Heart size={20} color="#fff" />
          </Pressable>

          <View style={[styles.priceTag, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.priceText}>£{price}</Text>
          </View>

          {showStatus && (
            <View style={styles.statusBadgeContainer}>
              <StatusBadge status={status} />
            </View>
          )}

          <View style={styles.userTypeContainer}>
            <Text style={styles.userTypeText}>{userType}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text
            style={[
              styles.title,
              compact && styles.compactTitle,
              { color: theme.colors.text }
            ]}
            numberOfLines={compact ? 1 : 2}
          >
            {title}
          </Text>

          <View style={styles.locationContainer}>
            <MapPin size={14} color={theme.colors.textMuted} />
            <Text style={[styles.locationText, { color: theme.colors.textMuted }]} numberOfLines={1}>
              {location}
            </Text>
          </View>

          {!compact && status !== 'sold' && (
            <View style={[styles.connectContainer, { borderTopColor: theme.colors.border }]}>
              <Text style={[styles.connectText, { color: theme.colors.primaryDark }]}>Only £1 to connect</Text>
            </View>
          )}
        </View>
      </CardWrapper>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginVertical: 10,
  },
  compactCard: {
    height: 120,
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  compactImageContainer: {
    height: '100%',
    width: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrowButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -15,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  priceText: {
    fontWeight: '800',
    color: '#000',
    fontSize: 14,
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  userTypeContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  userTypeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  compactTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    marginLeft: 4,
  },
  connectContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
  },
  connectText: {
    fontWeight: '700',
    fontSize: 14,
  },
});