import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, Search, ArrowRight } from 'lucide-react-native';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import HowItWorks from '@/components/HowItWorks';
import { useTheme } from '@/hooks/useTheme';

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.contentContainer}>
      <Hero />
      
      <View style={styles.searchSection}>
        <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
          <Search size={20} color={theme.secondaryText} />
          <Text style={[styles.searchPlaceholder, { color: theme.secondaryText }]}>
            Search for materials...
          </Text>
        </View>
        <Pressable style={[styles.locationButton, { backgroundColor: theme.primary }]}>
          <MapPin size={20} color="#000" />
          <Text style={styles.locationText}>Near me</Text>
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
          <Link href="/(tabs)/listings" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View all</Text>
              <ArrowRight size={16} color={theme.primary} />
            </Pressable>
          </Link>
        </View>
        <CategoryGrid />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Listings</Text>
          <Link href="/(tabs)/listings" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View all</Text>
              <ArrowRight size={16} color={theme.primary} />
            </Pressable>
          </Link>
        </View>
        <FeaturedListings />
      </View>
      
      <HowItWorks />
      
      <Link href="/(tabs)/map" asChild>
        <Pressable style={[styles.exploreButton, { backgroundColor: theme.primary }]}>
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
    fontSize: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  locationText: {
    color: '#000',
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
    marginRight: 5,
    fontWeight: '600',
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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