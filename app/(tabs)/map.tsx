import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Filter, MapPin } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import MapView from '@/components/MapView';
import { mockListings } from '@/data/mockData';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_SPACING = 15;

// Define the listing type based on the mockListings structure
type Listing = typeof mockListings[0];

export default function MapScreen() {
  const router = useRouter();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={[styles.backButton, { backgroundColor: theme.background }]}>
          <ChevronLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Nearby Listings</Text>
        <Pressable style={[styles.filterButton, { backgroundColor: theme.primary }]}>
          <Filter size={20} color="#000" />
        </Pressable>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          listings={mockListings}
          selectedListing={selectedListing}
          onMarkerPress={(marker) => {
            const listing = mockListings.find((item) => item.id === marker.id);
            setSelectedListing(listing ?? null);
          }}
        />
      </View>

      <View style={styles.listingsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          contentContainerStyle={styles.scrollContent}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / (CARD_WIDTH + CARD_SPACING));
            setSelectedListing(mockListings[index]);
          }}
        >
          {mockListings.map((listing) => (
            <View key={listing.id} style={styles.cardWrapper}>
              <ListingCard listing={listing} compact />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.legendContainer, { backgroundColor: `${theme.card}E6` }]}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4285F4' }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>Public</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#EA4335' }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>Tradesperson</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#34A853' }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>Local Business</Text>
        </View>
      </View>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  listingsContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    height: 190,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});