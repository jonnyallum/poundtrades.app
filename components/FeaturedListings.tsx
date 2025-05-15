import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import ListingCard from './ListingCard';
import { mockListings } from '@/data/mockData';

// Get first 4 listings for featured section
const featuredListings = mockListings.slice(0, 4);

export default function FeaturedListings() {
  return (
    <View style={styles.container}>
      <FlatList
        data={featuredListings}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <ListingCard listing={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  listContainer: {
    paddingRight: 20,
  },
  cardContainer: {
    width: 280,
    marginRight: 15,
  },
});