import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';
import Logo from './Logo';
import { ArrowRight, Sparkles } from 'lucide-react-native';

/**
 * Premium Hero Component
 * 
 * Bold, elite, multimillion-pound feel.
 * Black background with gold accents and powerful typography.
 */
export default function Hero() {
  const { colors, typography: typo, shadows, layout, radius } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background with dark overlay */}
      <View style={[styles.backgroundContainer, { height: layout.height * 0.65 }]}>
        <Image
          source="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200"
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          priority="high"
        />
        {/* Dark gradient overlay */}
        <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.75)' }]} />

        {/* Content */}
        <View style={[styles.content, { paddingTop: layout.moderateScale(64) }]}>
          {/* Logo */}
          <View style={[styles.logoContainer, { marginBottom: layout.scale(24) }]}>
            <Logo size={layout.isSmallDevice ? 'medium' : 'large'} textColor={colors.primary} />
          </View>

          {/* Headline */}
          <View style={styles.headlineContainer}>
            <Text style={[styles.headline, { color: colors.text, fontSize: layout.moderateScale(32) }]}>
              THE UK'S PREMIUM
            </Text>
            <Text style={[styles.headlineGold, { color: colors.primary, fontSize: layout.moderateScale(32) }]}>
              BUILDING MATERIALS
            </Text>
            <Text style={[styles.headline, { color: colors.text, fontSize: layout.moderateScale(32) }]}>
              MARKETPLACE
            </Text>
          </View>

          {/* Subheadline */}
          <Text style={[styles.subheadline, { color: colors.textSecondary, fontSize: layout.moderateScale(15) }]}>
            Quality surplus materials at smart prices.{'\n'}
            Secure elite deals with instant access.
          </Text>

          {/* CTA Button */}
          <Link href="/(tabs)/listings" asChild>
            <Pressable
              style={({ pressed }) => [
                styles.ctaButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  minHeight: layout.touchTarget + 12,
                  paddingVertical: layout.scale(16),
                  borderRadius: radius.xl,
                },
                shadows.glow,
              ]}
            >
              <Sparkles size={layout.moderateScale(20)} color="#000" />
              <Text style={[styles.ctaText, { fontSize: layout.moderateScale(15) }]}>EXPLORE MARKETPLACE</Text>
              <ArrowRight size={layout.moderateScale(20)} color="#000" />
            </Pressable>
          </Link>

          {/* Stats */}
          {!layout.isSmallDevice && (
            <View style={[styles.statsRow, { marginTop: layout.scale(48) }]}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary, fontSize: layout.moderateScale(24) }]}>10K+</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: layout.moderateScale(10) }]}>ASSETS</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary, fontSize: layout.moderateScale(24) }]}>5K+</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: layout.moderateScale(10) }]}>SELLERS</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary, fontSize: layout.moderateScale(24) }]}>£1M+</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted, fontSize: layout.moderateScale(10) }]}>TRADED</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  backgroundContainer: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    // marginBottom dynamic
  },
  headlineContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headline: {
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 40,
  },
  headlineGold: {
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    lineHeight: 40,
  },
  subheadline: {
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    lineHeight: 22,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
    minWidth: 280,
  },
  ctaText: {
    fontWeight: '800',
    color: '#000',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
});
