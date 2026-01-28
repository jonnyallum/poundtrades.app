import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { MapPin, Search, ArrowRight } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Hero from '../../components/Hero';
import MapView from '../../components/MapView';
import CategoryGrid from '../../components/CategoryGrid';
import FeaturedListings from '../../components/FeaturedListings';
import HowItWorks from '../../components/HowItWorks';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <Hero />

      <Animated.View
        entering={FadeInDown.delay(600).duration(1000)}
        style={styles.mapCard}
      >
        <MapView
          height={280}
          earthZoom
          cinematic
          listings={[]}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.mapOverlay}
        >
          <Text style={styles.mapTitle}>Live Surplus Radar</Text>
          <Text style={styles.mapSubtitle}>Scanning materials in your neighborhood...</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(900).duration(800)}
        style={styles.searchSection}
      >
        <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Search size={20} color={theme.colors.textMuted} />
          <Text style={[styles.searchPlaceholder, { color: theme.colors.textMuted }]}>
            Search for materials...
          </Text>
        </View>
        <Pressable style={[styles.locationButton, { backgroundColor: theme.colors.primary }]}>
          <MapPin size={20} color="#000" />
          <Text style={styles.locationText}>Near me</Text>
        </Pressable>
      </Animated.View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
          <Link href={"/(tabs)/listings" as any} asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: theme.colors.accent }]}>View all</Text>
              <ArrowRight size={16} color={theme.colors.accent} />
            </Pressable>
          </Link>
        </View>
        <CategoryGrid />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Featured Listings</Text>
          <Link href={"/(tabs)/listings" as any} asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: theme.colors.accent }]}>View all</Text>
              <ArrowRight size={16} color={theme.colors.accent} />
            </Pressable>
          </Link>
        </View>
        <FeaturedListings />
      </View>

      <Animated.View entering={FadeIn.delay(1200).duration(1000)}>
        <HowItWorks />
      </Animated.View>

      <Link href={"/(tabs)/map" as any} asChild>
        <Pressable style={[styles.exploreButton, { backgroundColor: theme.colors.primary }]}>
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
    paddingBottom: 60,
  },
  searchSection: {
    marginHorizontal: 20,
    marginTop: -30,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 10,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  locationText: {
    color: '#000',
    marginLeft: 6,
    fontWeight: '700',
  },
  mapCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40,
  },
  mapTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  mapSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginTop: 40,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    marginRight: 4,
    fontWeight: '700',
    fontSize: 14,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginTop: 40,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  exploreButtonText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 18,
    marginRight: 10,
  },
});