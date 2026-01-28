import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');

const categories = [
  {
    id: 1,
    name: 'Timber',
    image: 'https://images.pexels.com/photos/6474545/pexels-photo-6474545.jpeg',
  },
  {
    id: 2,
    name: 'Bricks',
    image: 'https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg',
  },
  {
    id: 3,
    name: 'Tiles',
    image: 'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg',
  },
  {
    id: 4,
    name: 'Tools',
    image: 'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg',
  },
  {
    id: 5,
    name: 'Paint',
    image: 'https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg',
  },
  {
    id: 6,
    name: 'Concrete',
    image: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
  },
];

export default function CategoryGrid() {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category, index) => (
        <Animated.View
          key={category.id}
          entering={FadeInRight.delay(200 + index * 100).duration(600)}
        >
          <Link href={{ pathname: '/(tabs)/listings' as any, params: { category: category.name } }} asChild>
            <Pressable
              style={[styles.categoryCard, { backgroundColor: theme.colors.card, shadowColor: '#000' }]}
            >
              <Image source={{ uri: category.image }} style={styles.categoryImage} />
              <View style={styles.categoryNameContainer}>
                <Text style={[styles.categoryName, { color: theme.colors.text }]}>{category.name}</Text>
              </View>
            </Pressable>
          </Link>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingVertical: 10,
  },
  categoryCard: {
    width: 120,
    height: 140,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  categoryImage: {
    width: '100%',
    height: 95,
  },
  categoryNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});