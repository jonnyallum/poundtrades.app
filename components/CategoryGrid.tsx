import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { Link } from 'expo-router';

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
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <Pressable 
          key={category.id} 
          style={styles.categoryCard}
          onPress={() => {}}
        >
          <Image source={{ uri: category.image }} style={styles.categoryImage} />
          <View style={styles.categoryNameContainer}>
            <Text style={styles.categoryName}>{category.name}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 110,
    height: 130,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryImage: {
    width: '100%',
    height: 90,
  },
  categoryNameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
});