import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import Logo from './Logo';

export default function Hero() {
  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Logo size="large" />
          <Text style={styles.tagline}>
            Turn your surplus into cash
          </Text>
          <Text style={styles.subtitle}>
            List, connect, and sell your leftover building materials quickly and easily.
          </Text>
          <Link href="/listings" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Browse Listings</Text>
              <ArrowRight size={18} color="#000" />
            </Pressable>
          </Link>
          <Text style={styles.costText}>Only £1 to connect</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 380,
    width: '100%',
  },
  backgroundImage: {
    opacity: 0.85,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  costText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});