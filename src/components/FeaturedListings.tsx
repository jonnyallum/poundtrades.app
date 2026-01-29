import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';
import ListingCard from './ListingCard';
import { listingsService, isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { Listing } from '@/types/listing';
import { FeaturedListingsSkeleton } from './SkeletonLoader';

/**
 * Premium Featured Listings
 * 
 * Displays the top-tier deals in a horizontal scroll.
 * Uses SkeletonLoader for a buttery-smooth loading experience.
 */
export default function FeaturedListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors, layout } = useTheme();

  const CARD_WIDTH = layout.width * 0.82;
  const CARD_SPACING = layout.scale(16);

  useEffect(() => {
    async function fetchFeatured() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await listingsService.getListings({
          limit: 6
        });

        if (error) {
          console.error('Error fetching featured listings:', error);
          setListings([]);
        } else if (data && data.length > 0) {
          const transformedListings: Listing[] = (data as any[]).map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description || '',
            price: item.price,
            location: item.location || 'Location not specified',
            category: item.categories?.name || 'Uncategorized',
            images: item.images || [],
            status: item.status || 'active',
            userType: item.user_type || 'private',
            createdAt: item.created_at || new Date().toISOString(),
            userId: item.seller_id || item.user_id || '',
            latitude: item.latitude,
            longitude: item.longitude,
          }));
          setListings(transformedListings);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error('Error in fetchFeatured:', err);
        setListings([]);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return <FeaturedListingsSkeleton />;
  }

  if (listings.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border, height: layout.scale(120) }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: layout.moderateScale(10) }]}>
          NO FEATURED OPPORTUNITIES AT THE MOMENT.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={({ item }: { item: Listing }) => (
          <View style={[styles.cardContainer, { width: CARD_WIDTH, marginRight: CARD_SPACING }]}>
            <ListingCard listing={item} />
          </View>
        )}
        keyExtractor={(item: Listing) => item.id.toString()}
        horizontal
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.listContainer, { paddingHorizontal: layout.scale(20) }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  listContainer: {
    paddingRight: 40,
  },
  cardContainer: {
    // width and marginRight dynamic
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  emptyText: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1.5,
    lineHeight: 18,
  },
});
