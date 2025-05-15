import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, TextInput, ScrollView } from 'react-native';
import { Search, Filter, Plus, Tag } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

// Define the WantedItem type
type WantedItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  postedBy: string;
  postedDate: string;
  urgency: 'High' | 'Medium' | 'Low';
};

// Mock wanted items data
const mockWantedItems: WantedItem[] = [
  {
    id: 1,
    title: 'Looking for reclaimed bricks',
    description: 'Need around 500 reclaimed red bricks for garden project. Must be in good condition.',
    category: 'Bricks',
    location: 'London SE1',
    budget: '£200',
    postedBy: 'David Smith',
    postedDate: '2025-05-10',
    urgency: 'Medium',
  },
  {
    id: 2,
    title: 'Wanted: Scaffold boards',
    description: 'Looking for 10-15 used scaffold boards for shelving project. Can collect.',
    category: 'Timber',
    location: 'Manchester M1',
    budget: '£100',
    postedBy: 'Sarah Johnson',
    postedDate: '2025-05-12',
    urgency: 'Low',
  },
  {
    id: 3,
    title: 'ISO Victorian floor tiles',
    description: 'Searching for Victorian-style floor tiles, approx 5m². Preferably geometric pattern.',
    category: 'Tiles',
    location: 'Birmingham B1',
    budget: '£300',
    postedBy: 'Mike Williams',
    postedDate: '2025-05-14',
    urgency: 'High',
  },
  {
    id: 4,
    title: 'Need cement mixer',
    description: 'Looking for a second-hand cement mixer for home renovation. Must be working.',
    category: 'Tools',
    location: 'Bristol BS1',
    budget: '£150',
    postedBy: 'Emma Brown',
    postedDate: '2025-05-13',
    urgency: 'Medium',
  },
  {
    id: 5,
    title: 'Wanted: Roof slates',
    description: 'Need approx 50 reclaimed roof slates for small outbuilding. Welsh slate preferred.',
    category: 'Roofing',
    location: 'Cardiff CF10',
    budget: '£250',
    postedBy: 'James Taylor',
    postedDate: '2025-05-11',
    urgency: 'High',
  },
];

// Filter categories
const categories = ['All', 'Timber', 'Bricks', 'Tiles', 'Tools', 'Roofing', 'Other'];

export default function WantedScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { theme } = useTheme();
  
  // Filter wanted items based on selected category
  const filteredItems = selectedCategory === 'All' 
    ? mockWantedItems 
    : mockWantedItems.filter(item => item.category === selectedCategory);

  // Render a wanted item card
  const renderWantedItem = ({ item }: { item: WantedItem }) => {
    const urgencyColor = 
      item.urgency === 'High' ? '#FF3B30' : 
      item.urgency === 'Medium' ? '#FF9500' : 
      '#34C759';
    
    return (
      <Pressable style={[styles.itemCard, { backgroundColor: theme.card }]}>
        <View style={styles.itemHeader}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
            <Text style={styles.urgencyText}>{item.urgency}</Text>
          </View>
        </View>
        
        <Text style={[styles.itemDescription, { color: theme.secondaryText }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.itemDetails}>
          <View style={styles.detailRow}>
            <Tag size={14} color={theme.secondaryText} />
            <Text style={[styles.detailText, { color: theme.secondaryText }]}>{item.category}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.budgetText, { color: theme.primary }]}>Budget: {item.budget}</Text>
          </View>
        </View>
        
        <View style={[styles.itemFooter, { borderTopColor: theme.border }]}>
          <Text style={[styles.locationText, { color: theme.secondaryText }]}>{item.location}</Text>
          <Text style={[styles.dateText, { color: theme.secondaryText }]}>
            Posted: {new Date(item.postedDate).toLocaleDateString()}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Wanted Items</Text>
        <Pressable style={[styles.postButton, { backgroundColor: theme.primary }]}>
          <Plus size={20} color="#000" />
          <Text style={styles.postButtonText}>Post Request</Text>
        </Pressable>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Search size={20} color={theme.secondaryText} />
          <TextInput 
            placeholder="Search wanted items..." 
            style={[styles.searchInput, { color: theme.text }]}
            placeholderTextColor={theme.secondaryText}
          />
        </View>
        <Pressable style={[styles.filterButton, { backgroundColor: theme.tabBar }]}>
          <Filter size={20} color={theme.text} />
        </Pressable>
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((category) => (
            <Pressable 
              key={category}
              style={[
                styles.categoryButton, 
                { backgroundColor: theme.card },
                category === selectedCategory && [styles.categoryButtonActive, { backgroundColor: theme.primary }]
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryButtonText, 
                  { color: theme.secondaryText },
                  category === selectedCategory && styles.categoryButtonTextActive
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredItems}
        renderItem={renderWantedItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#000',
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  itemCard: {
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  urgencyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 13,
    marginLeft: 5,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  locationText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
  },
});