import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MapPin, Search, ArrowRight, Sparkles, TrendingUp } from 'lucide-react-native';
import Hero from '@/components/Hero';
import CategoryGrid from '@/components/CategoryGrid';
import FeaturedListings from '@/components/FeaturedListings';
import { useTheme } from '@/hooks/useTheme';
import { createWebIcon } from '@/components/Icon';

// Web-wrapped icons for premium styling
const WebSearch = createWebIcon(Search);
const WebMapPin = createWebIcon(MapPin);
const WebArrowRight = createWebIcon(ArrowRight);
const WebSparkles = createWebIcon(Sparkles);
const WebTrending = createWebIcon(TrendingUp);

export default function HomeScreen() {
  const { colors, spacing, typography, shadows, radius, layout } = useTheme();
  const router = useRouter();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.contentContainer, { paddingBottom: layout.scale(80) }]}
      showsVerticalScrollIndicator={false}
    >
      <Hero />

      {/* Search Bar - Overlapping the Hero */}
      <View style={[styles.searchSection, { marginTop: layout.scale(-35), marginHorizontal: layout.scale(20) }]}>
        <View style={[
          styles.searchContainer,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            height: layout.touchTarget + 12,
            borderRadius: radius.lg,
            paddingHorizontal: layout.scale(20),
          },
          shadows.md
        ]}>
          <WebSearch size={layout.moderateScale(22)} color={colors.primary} strokeWidth={2.5} />
          <Text style={[styles.searchPlaceholder, { color: colors.textSecondary, fontSize: layout.moderateScale(16), marginLeft: layout.scale(14) }]}>
            Search premium assets...
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/map')}
          style={[styles.locationButton, {
            backgroundColor: colors.primary,
            width: layout.touchTarget + 12,
            height: layout.touchTarget + 12,
            borderRadius: radius.lg,
          }, shadows.glow]}
        >
          <WebMapPin size={layout.moderateScale(24)} color="#000" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Market Pulse Banner */}
      <View style={[styles.marketPulse, {
        backgroundColor: colors.card,
        borderColor: colors.primary,
        marginTop: layout.scale(24),
        marginHorizontal: layout.scale(20),
        paddingVertical: layout.scale(10),
        borderRadius: radius.md,
      }]}>
        <View style={styles.pulseHeader}>
          <WebTrending size={layout.moderateScale(16)} color={colors.primary} />
          <Text style={[styles.pulseText, { color: colors.primary, fontSize: layout.moderateScale(11) }]}>MARKET PULSE: 1,240 ASSETS ADDED TODAY</Text>
        </View>
      </View>

      {/* Categories Section */}
      <View style={[styles.section, { marginTop: layout.scale(48) }]}>
        <View style={[styles.sectionHeader, { paddingHorizontal: layout.scale(20), marginBottom: layout.scale(20) }]}>
          <View style={styles.titleContainer}>
            <WebSparkles size={layout.moderateScale(18)} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: layout.moderateScale(14) }]}>ELITE CATEGORIES</Text>
          </View>
        </View>
        <CategoryGrid />
      </View>

      {/* Featured Listings Section */}
      <View style={[styles.section, { marginTop: layout.scale(48) }]}>
        <View style={[styles.sectionHeader, { paddingHorizontal: layout.scale(20), marginBottom: layout.scale(20) }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: layout.moderateScale(14) }]}>FEATURED DEALS</Text>
          <Link href="/(tabs)/listings" asChild>
            <Pressable style={styles.viewAllButton}>
              <Text style={[styles.viewAllText, { color: colors.primary, fontSize: layout.moderateScale(12) }]}>VIEW MARKET</Text>
              <WebArrowRight size={layout.moderateScale(18)} color={colors.primary} strokeWidth={3} />
            </Pressable>
          </Link>
        </View>
        <FeaturedListings />
      </View>

      {/* Big Action Footer */}
      <View style={[styles.footerAction, {
        marginTop: layout.scale(64),
        marginHorizontal: layout.scale(20),
        padding: layout.scale(32),
        borderRadius: radius.xl,
      }]}>
        <Text style={[styles.footerSubtitle, { color: colors.textSecondary, fontSize: layout.moderateScale(12) }]}>READY TO SELL?</Text>
        <Text style={[styles.footerTitle, { color: colors.text, fontSize: layout.moderateScale(32), lineHeight: layout.moderateScale(38) }]}>
          TURN SURPLUS INTO {'\n'}<Text style={{ color: colors.primary }}>GROWTH</Text>
        </Text>

        <Link href="/(tabs)/wanted" asChild>
          <Pressable style={[styles.listButton, {
            backgroundColor: colors.primary,
            paddingVertical: layout.scale(20),
            paddingHorizontal: layout.scale(40),
            borderRadius: radius.lg,
          }, shadows.glow]}>
            <Text style={[styles.listButtonText, { fontSize: layout.moderateScale(16) }]}>LIST ASSETS NOW</Text>
          </Pressable>
        </Link>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    // paddingBottom dynamic
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  searchPlaceholder: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  locationButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketPulse: {
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    opacity: 0.9,
  },
  pulseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseText: {
    fontWeight: '900',
    letterSpacing: 1,
  },
  section: {
    // marginTop dynamic
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewAllText: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerAction: {
    alignItems: 'center',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  footerSubtitle: {
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 12,
  },
  footerTitle: {
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 32,
  },
  listButton: {
  },
  listButtonText: {
    color: '#000',
    fontWeight: '900',
    letterSpacing: 1,
  },
});
