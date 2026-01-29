import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/hooks/useTheme';

/**
 * Premium Category Grid
 * 
 * Bold, dark cards with gold hover effects for the building materials marketplace.
 */

const CATEGORIES = [
  { id: '1', name: 'Timber & Wood', icon: '🪵', color: '#8B4513' },
  { id: '2', name: 'Bricks & Blocks', icon: '🧱', color: '#B22222' },
  { id: '3', name: 'Roofing', icon: '🏠', color: '#4A4A4A' },
  { id: '4', name: 'Plumbing', icon: '🔧', color: '#4169E1' },
  { id: '5', name: 'Electrical', icon: '⚡', color: '#FFD700' },
  { id: '6', name: 'Insulation', icon: '🧊', color: '#FF69B4' },
  { id: '7', name: 'Windows & Doors', icon: '🚪', color: '#228B22' },
  { id: '8', name: 'Flooring', icon: '🪨', color: '#8B7355' },
  { id: '9', name: 'Paint & Finishes', icon: '🎨', color: '#9932CC' },
  { id: '10', name: 'View All', icon: '➡️', color: '#FFD700' },
];

export default function CategoryGrid() {
  const { colors, shadows, layout, radius } = useTheme();
  const router = useRouter();

  const handleCategoryPress = (category: typeof CATEGORIES[0]) => {
    if (category.name === 'View All') {
      router.push('/(tabs)/listings');
    } else {
      router.push({
        pathname: '/(tabs)/listings',
        params: { category: category.name },
      });
    }
  };

  return (
    <View style={[styles.container, { paddingVertical: layout.scale(24) }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text, fontSize: layout.moderateScale(12) }]}>CATEGORIES</Text>
        <Pressable
          onPress={() => router.push('/(tabs)/listings')}
          hitSlop={12}
        >
          <Text style={[styles.seeAll, { color: colors.primary, fontSize: layout.moderateScale(11) }]}>VIEW ALL</Text>
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: layout.scale(20), gap: layout.scale(12) }]}
      >
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => handleCategoryPress(category)}
            style={({ pressed }) => [
              styles.categoryCard,
              {
                backgroundColor: colors.card,
                borderColor: pressed ? colors.primary : colors.border,
                transform: [{ scale: pressed ? 0.95 : 1 }],
                width: layout.scale(94),
                height: layout.scale(104),
                borderRadius: radius.lg,
              },
              shadows.sm,
            ]}
          >
            {/* Icon circle with category color */}
            <View style={[styles.iconCircle, { backgroundColor: `${category.color}15`, width: layout.scale(44), height: layout.scale(44), borderRadius: layout.scale(22) }]}>
              <Text style={[styles.icon, { fontSize: layout.moderateScale(20) }]}>{category.icon}</Text>
            </View>

            {/* Category name */}
            <Text
              style={[styles.categoryName, { color: colors.text, fontSize: layout.moderateScale(10) }]}
              numberOfLines={2}
            >
              {category.name.toUpperCase()}
            </Text>

            {/* Gold accent bar */}
            {category.name === 'View All' && (
              <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingVertical dynamic
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontWeight: '900',
    letterSpacing: 2,
  },
  seeAll: {
    fontWeight: '800',
    letterSpacing: 1,
  },
  scrollContent: {
    // padding and gap dynamic
  },
  categoryCard: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
    overflow: 'hidden',
  },
  iconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    // fontSize dynamic
  },
  categoryName: {
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 14,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
});
