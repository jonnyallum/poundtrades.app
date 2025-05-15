import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput } from 'react-native';
import { Search, Filter, MapPin, SlidersHorizontal } from 'lucide-react-native';
import ListingCard from '@/components/ListingCard';
import { mockListings } from '@/data/mockData';
import { useTheme } from '@/hooks/useTheme';

const categories = ['All', 'Timber', 'Bricks', 'Tiles', 'Concrete', 'Tools', 'Paint'];

export default function ListingsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { theme } = useTheme();
  
  // Filter listings based on selected category
  const filteredListings = selectedCategory === 'All' 
    ? mockListings 
    : mockListings.filter(listing => listing.category === selectedCategory);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Browse Listings</Text>
        <Pressable style={[styles.mapButton, { backgroundColor: theme.tabBar }]}>
          <MapPin size={20} color={theme.primary} />
          <Text style={[styles.mapButtonText, { color: theme.text }]}>Map View</Text>
        </Pressable>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Search size={20} color={theme.secondaryText} />
          <TextInput 
            placeholder="Search listings..." 
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.secondaryText}
          />
        </View>
        <Pressable style={[styles.filterButton, { backgroundColor: theme.tabBar }]}>
          <SlidersHorizontal size={20} color={theme.text} />
        </Pressable>
      </View>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              style={[
                styles.categoryButton, 
                { backgroundColor: theme.card },
                item === selectedCategory && [styles.categoryButtonActive, { backgroundColor: theme.primary }]
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text 
                style={[
                  styles.categoryButtonText, 
                  { color: theme.secondaryText },
                  item === selectedCategory && styles.categoryButtonTextActive
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
          keyExtractor={item => item}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <FlatList
        data={filteredListings}
        renderItem={({ item }) => (
          <View style={styles.listingCardContainer}>
            <ListingCard listing={item} />
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listingsContent}
        showsVerticalScrollIndicator={false}
      />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mapButtonText: {
    marginLeft: 5,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filterButton: {
    borderRadius: 8,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginBottom: 15,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#FFD700',
  },
  categoryButtonText: {
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  listingsContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  listingCardContainer: {
    marginBottom: 15,
  },
});