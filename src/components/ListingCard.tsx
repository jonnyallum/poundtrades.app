import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { MapPin, Lock, Star, Clock } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  compact?: boolean;
  showStatus?: boolean;
}

export default function ListingCard({ listing, compact = false, showStatus = false }: ListingCardProps) {
  const { colors, shadows, radius, layout } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const images = listing.images?.length > 0
    ? listing.images
    : ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600'];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const cardWidth = layout.width - layout.scale(40);
    const newIndex = Math.round(contentOffsetX / cardWidth);
    if (newIndex !== currentImageIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentImageIndex(newIndex);
    }
  };

  const cardImageHeight = compact ? layout.scale(150) : layout.scale(220);

  return (
    <Link href={`/listing/${listing.id}`} asChild>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            opacity: pressed ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.99 : 1 }],
          },
          shadows.md,
        ]}
      >
        {/* Image Carousel */}
        <View style={[styles.imageContainer, { height: cardImageHeight, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg }]}>
          <FlatList
            ref={flatListRef}
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => `${listing.id}-img-${index}`}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                placeholder={{ blurhash: 'L6PZf9D%00~q_0_0_0_0_0_0_0_0' }}
                style={[styles.image, { height: cardImageHeight, width: layout.width - layout.scale(40) }]}
                contentFit="cover"
                transition={200}
              />
            )}
          />

          {/* Image pagination dots */}
          {images.length > 1 && (
            <View style={[styles.pagination, { bottom: layout.scale(12) }]}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {
                      backgroundColor: index === currentImageIndex
                        ? colors.primary
                        : 'rgba(255,255,255,0.4)',
                      width: index === currentImageIndex ? 12 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Status badge */}
          {showStatus && listing.status && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(listing.status), borderRadius: radius.sm }]}>
              <Text style={styles.statusText}>{listing.status.toUpperCase()}</Text>
            </View>
          )}

          {/* User type badge */}
          {listing.userType === 'business' && (
            <View style={[styles.businessBadge, { backgroundColor: colors.primary, borderRadius: radius.sm }]}>
              <Star size={10} color="#000" />
              <Text style={styles.businessText}>PRO</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={[styles.content, { padding: layout.scale(16) }]}>
          {/* Title */}
          <Text
            style={[styles.title, { color: colors.text, fontSize: layout.moderateScale(17) }]}
            numberOfLines={2}
          >
            {listing.title.toUpperCase()}
          </Text>

          {/* Price */}
          <View style={[styles.priceRow, { marginTop: layout.scale(8) }]}>
            <Text style={[styles.price, { color: colors.primary, fontSize: layout.moderateScale(22) }]}>
              £{listing.price.toLocaleString()}
            </Text>
            <Pressable
              style={[styles.unlockButton, { backgroundColor: colors.primary, height: layout.touchTarget + 4, borderRadius: radius.md }, shadows.glow]}
              onPress={() => {/* Handle Stripe/Stellar flow */ }}
            >
              <Text style={[styles.unlockText, { color: '#000', fontSize: layout.moderateScale(12) }]}>SECURE ACCESS</Text>
            </Pressable>
          </View>

          {/* Location & Time */}
          <View style={[styles.metaRow, { marginTop: layout.scale(12) }]}>
            <View style={styles.metaItem}>
              <MapPin size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: layout.moderateScale(12) }]} numberOfLines={1}>
                {listing.location.toUpperCase()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Clock size={12} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary, fontSize: layout.moderateScale(12) }]}>
                {formatDate(listing.createdAt).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Category */}
          <View style={[styles.categoryBadge, { backgroundColor: colors.surface, borderRadius: radius.sm, marginTop: layout.scale(12) }]}>
            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
              {listing.category.toUpperCase()}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#10B981';
    case 'sold': return '#EF4444';
    case 'pending': return '#F59E0B';
    default: return '#666666';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#050505',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  pagination: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  businessBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 4,
  },
  businessText: {
    color: '#000',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },
  content: {
    // padding dynamic
  },
  title: {
    fontWeight: '900',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    gap: 6,
  },
  unlockText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  metaText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
