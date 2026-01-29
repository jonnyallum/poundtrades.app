import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, RefreshControl, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Search, MapPin, SlidersHorizontal, Package, Sparkles } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import { useTheme } from '@/hooks/useTheme';
import { listingsService, isSupabaseConfigured } from '@/lib/supabase';
import { Listing } from '@/types/listing';
import { ListingsGridSkeleton } from '@/components/SkeletonLoader';
import { createWebIcon } from '@/components/Icon';

// Premium Web Icons
const WebSearch = createWebIcon(Search);
const WebMapPin = createWebIcon(MapPin);
const WebFilter = createWebIcon(SlidersHorizontal);
const WebPackage = createWebIcon(Package);
const WebSparkles = createWebIcon(Sparkles);

const categories = ['ALL', 'TIMBER', 'BRICKS', 'TILES', 'CONCRETE', 'TOOLS', 'PAINT', 'ELECTRICAL'];

export default function ListingsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors, typography, shadows, spacing, radius, layout } = useTheme();

  const fetchListings = useCallback(async () => {
    setError(null);

    if (!isSupabaseConfigured) {
      setError('System connection pending...');
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const { data, error: fetchError } = await listingsService.getListings({
        category: selectedCategory === 'ALL' ? undefined : selectedCategory.toLowerCase(),
        search: searchQuery || undefined,
      });

      if (fetchError) {
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
      setListings([]);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 600);
    }
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchListings();
  }, [fetchListings]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setLoading(true);
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <View style={[styles.listingCardContainer, { marginBottom: layout.scale(20) }]}>
      <ListingCard listing={item} />
    </View>
  );

  const renderCategoryItem = ({ item }: { item: string }) => (
    <Pressable
      style={[
        styles.categoryButton,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          height: layout.moderateScale(40),
          paddingHorizontal: layout.scale(20),
          borderRadius: radius.md,
        },
        item === selectedCategory && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          ...shadows.glow,
        },
      ]}
      onPress={() => handleCategorySelect(item)}
    >
      <Text
        style={[
          styles.categoryButtonText,
          { color: colors.textSecondary, fontSize: layout.moderateScale(11) },
          item === selectedCategory && { color: '#000', fontWeight: '900' },
        ]}
      >
        {item}
      </Text>
    </Pressable>
  );

  const ListEmptyComponent = () => (
    <View style={[styles.emptyContainer, { paddingVertical: layout.scale(80) }]}>
      <WebPackage size={layout.scale(48)} color={colors.border} />
      <Text style={[styles.emptyText, { color: colors.text, fontSize: layout.moderateScale(16) }]}>NO ASSETS FOUND</Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary, fontSize: layout.moderateScale(13) }]}>
        Try adjusting your elite market filters.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Premium Header */}
      <View style={[styles.header, {
        paddingTop: Platform.OS === 'ios' ? layout.scale(64) : layout.scale(48),
        paddingBottom: layout.scale(24),
        paddingHorizontal: layout.scale(20),
      }]}>
        <View>
          <Text style={[styles.headerSubtitle, { color: colors.primary, fontSize: layout.moderateScale(10) }]}>POUNDTRADES MARKET</Text>
          <Text style={[styles.headerTitle, { color: colors.text, fontSize: layout.moderateScale(28) }]}>LIVE INVENTORY</Text>
        </View>
        <Link href="/(tabs)/map" asChild>
          <Pressable
            style={[
              styles.mapButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingHorizontal: layout.scale(16),
                height: layout.touchTarget + 4,
                borderRadius: radius.md,
              },
              shadows.sm
            ]}
          >
            <WebMapPin size={layout.moderateScale(20)} color={colors.primary} strokeWidth={2.5} />
            <Text style={[styles.mapButtonText, { color: colors.text, fontSize: layout.moderateScale(12) }]}>MAP</Text>
          </Pressable>
        </Link>
      </View>

      {/* Modern Search & Filter */}
      <View style={[styles.searchContainer, { paddingHorizontal: layout.scale(20), marginBottom: layout.scale(24) }]}>
        <View style={[styles.searchBar, {
          backgroundColor: colors.card,
          borderColor: colors.border,
          height: layout.touchTarget + 12,
          paddingHorizontal: layout.scale(16),
          borderRadius: radius.lg,
        }]}>
          <WebSearch size={layout.moderateScale(20)} color={colors.primary} strokeWidth={2.5} />
          <TextInput
            placeholder="Search elite inventory..."
            style={[styles.searchInput, { color: colors.text, fontSize: layout.moderateScale(15) }]}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => setLoading(true)}
            returnKeyType="search"
          />
        </View>
        <Pressable style={[
          styles.filterButton,
          {
            backgroundColor: colors.primary,
            width: layout.touchTarget + 12,
            height: layout.touchTarget + 12,
            borderRadius: radius.lg,
          },
          shadows.glow
        ]}>
          <WebFilter size={layout.moderateScale(20)} color="#000" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Category Ribbon */}
      <View style={[styles.categoriesContainer, { marginBottom: layout.scale(24) }]}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item}
          contentContainerStyle={[styles.categoriesList, { paddingHorizontal: layout.scale(20) }]}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </View>

      {loading && !refreshing ? (
        <ListingsGridSkeleton />
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[styles.listingsContent, { paddingHorizontal: layout.scale(20), paddingBottom: layout.scale(100) }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        />
      )}
    </View>
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
    borderBottomWidth: 0,
  },
  headerSubtitle: {
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 4,
  },
  headerTitle: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
  },
  mapButtonText: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontWeight: '700',
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    // marginBottom dynamic
  },
  categoriesList: {
    // paddingHorizontal dynamic
  },
  categoryButton: {
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
  },
  categoryButtonText: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  listingsContent: {
    // padding dynamic
  },
  listingCardContainer: {
    // marginBottom dynamic
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtext: {
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 60,
  },
});
