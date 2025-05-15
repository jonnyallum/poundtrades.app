import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, Search, ArrowRight } from 'lucide-react-native';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorks from '@/components/HowItWorks';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Hero />
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Search for materials...</Text>
        </View>
        <Pressable style={styles.locationButton}>
          <MapPin size={20} color="#FFD700" />
          <Text style={styles.locationText}>Near me</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <Link href="/categories" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <ArrowRight size={16} color="#FFD700" />
            </Pressable>
          </Link>
        </View>
        <CategoryGrid />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Listings</Text>
          <Link href="/listings" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all</Text>
              <ArrowRight size={16} color="#FFD700" />
            </Pressable>
          </Link>
        </View>
        <FeaturedListings />
      </View>
      
      <HowItWorks />
      
      <Link href="/map" asChild>
        <Pressable style={styles.exploreButton}>
          <Text style={styles.exploreButtonText}>Explore Nearby Listings</Text>
          <MapPin size={20} color="#000" />
        </Pressable>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  searchSection: {
    marginHorizontal: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  searchPlaceholder: {
    marginLeft: 10,
    color: '#999',
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  locationText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FFD700',
    marginRight: 5,
    fontWeight: '600',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});