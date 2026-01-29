import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, MapPin, Navigation } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import MapView from '@/components/MapView';
import { listingsService, isSupabaseConfigured } from '@/lib/supabase';
import { useTheme } from '@/hooks/useTheme';
import { Listing } from '@/types/listing';
import { createWebIcon } from '@/components/Icon';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = 15;

// Premium Web Icons
const WebChevronLeft = createWebIcon(ChevronLeft);
const WebFilter = createWebIcon(Filter);
const WebMapPin = createWebIcon(MapPin);
const WebNavigation = createWebIcon(Navigation);

export default function MapScreen() {
  const router = useRouter();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors, typography, shadows, layout, radius } = useTheme();

  const CARD_WIDTH = layout.width * 0.85;
  const CARD_SPACING = layout.scale(16);

  useEffect(() => {
    async function fetchListings() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await listingsService.getListings({});

        if (!error && data) {
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
        }
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    }

    fetchListings();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary, fontSize: layout.moderateScale(12) }]}>SYNCING RADAR...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Radar Header */}
      <View style={[styles.header, {
        backgroundColor: colors.background,
        borderBottomColor: colors.border,
        paddingTop: Platform.OS === 'ios' ? layout.scale(64) : layout.scale(48),
        paddingBottom: layout.scale(20),
        paddingHorizontal: layout.scale(20),
      }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, {
            backgroundColor: colors.card,
            borderColor: colors.border,
            width: layout.touchTarget,
            height: layout.touchTarget,
            borderRadius: radius.md,
          }]}
        >
          <WebChevronLeft size={layout.moderateScale(24)} color={colors.primary} strokeWidth={2.5} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerSubtitle, { color: colors.primary, fontSize: layout.moderateScale(10) }]}>ELITE NETWORK</Text>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: layout.moderateScale(18) }]}>TRADE RADAR</Text>
        </View>
        <Pressable style={[
          styles.filterButton,
          {
            backgroundColor: colors.primary,
            width: layout.touchTarget,
            height: layout.touchTarget,
            borderRadius: radius.md,
          },
          shadows.glow
        ]}>
          <WebFilter size={layout.moderateScale(20)} color="#000" strokeWidth={2.5} />
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          listings={listings.filter(l => l.latitude !== undefined && l.longitude !== undefined) as any}
          selectedListing={selectedListing as any}
          onMarkerPress={(marker: { id: string | number }) => {
            const listing = listings.find((item) => item.id === marker.id);
            setSelectedListing(listing ?? null);
          }}
        />
      </View>

      {/* Modern Card Carousel Overlay */}
      {listings.length > 0 ? (
        <View style={[styles.listingsContainer, { bottom: layout.scale(100), height: layout.scale(160) }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + CARD_SPACING}
            decelerationRate="fast"
            contentContainerStyle={[styles.scrollContent, { paddingHorizontal: layout.scale(20) }]}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
              setSelectedListing(listings[index] || null);
            }}
          >
            {listings.map((listing) => (
              <View key={listing.id} style={[styles.cardWrapper, { width: CARD_WIDTH, marginRight: CARD_SPACING }]}>
                <View style={[styles.cardInner, { borderRadius: radius.lg }, shadows.lg]}>
                  <ListingCard listing={listing} compact />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={[styles.emptyContainer, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          bottom: layout.scale(100),
          marginHorizontal: layout.scale(20),
          borderRadius: radius.lg,
          padding: layout.scale(24),
        }]}>
          <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: layout.moderateScale(11) }]}>
            NO ACTIVE TRADES DETECTED IN THIS AREA
          </Text>
        </View>
      )}

      {/* Command Legend */}
      <View style={[styles.legendContainer, {
        backgroundColor: colors.card,
        borderColor: colors.border,
        bottom: layout.scale(24),
        marginHorizontal: layout.scale(20),
        borderRadius: radius.md,
        padding: layout.scale(12),
      }, shadows.md]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: layout.moderateScale(10) }]}>PRO</Text>
        </View>
        <View style={styles.legendDivider} />
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4285F4' }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: layout.moderateScale(10) }]}>PRIVATE</Text>
        </View>
        <View style={styles.legendDivider} />
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.legendText, { color: colors.text, fontSize: layout.moderateScale(10) }]}>DIRECT</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontWeight: '900', letterSpacing: 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1.5,
  },
  headerInfo: { alignItems: 'center' },
  headerSubtitle: { fontWeight: '900', letterSpacing: 2, marginBottom: 2 },
  headerTitle: { fontWeight: '900', letterSpacing: 1 },
  backButton: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  filterButton: { alignItems: 'center', justifyContent: 'center' },
  mapContainer: { flex: 1 },
  listingsContainer: { position: 'absolute', left: 0, right: 0 },
  scrollContent: {
    // paddingHorizontal dynamic
  },
  cardWrapper: {
    // width and marginRight dynamic
  },
  cardInner: { overflow: 'hidden' },
  emptyContainer: { position: 'absolute', left: 0, right: 0, borderWidth: 1.5, alignItems: 'center' },
  emptyText: { fontWeight: '900', letterSpacing: 1.5, textAlign: 'center' },
  legendContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1.5,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontWeight: '800', letterSpacing: 0.5 },
  legendDivider: { width: 1, height: 12, backgroundColor: 'rgba(255, 255, 255, 0.1)' },
});
