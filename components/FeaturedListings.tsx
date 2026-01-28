import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ListingCard from './ListingCard';
import { mockListings } from '../data/mockData';

// Get first 4 listings for featured section
const featuredListings = mockListings.slice(0, 4);

export default function FeaturedListings() {
  return (
    <View style={styles.container}>
      <FlatList
        data={featuredListings}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(400 + index * 150).duration(800)}
            style={styles.cardContainer}
          >
            <ListingCard listing={item} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        snapToInterval={280 + 20}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  listContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  cardContainer: {
    width: 280,
    marginRight: 20,
  },
});