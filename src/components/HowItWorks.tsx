import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Search, KeyRound as Pound, MessageSquare } from 'lucide-react-native';

export default function HowItWorks() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>How It Works</Text>
      
      <View style={styles.stepsContainer}>
        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <Search size={24} color="#000" />
          </View>
          <Text style={styles.stepTitle}>Find Materials</Text>
          <Text style={styles.stepDescription}>
            Browse local surplus building materials near you
          </Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <Pound size={24} color="#000" />
          </View>
          <Text style={styles.stepTitle}>Pay £1 to Connect</Text>
          <Text style={styles.stepDescription}>
            Unlock contact details with a small connection fee
          </Text>
        </View>
        
        <View style={styles.step}>
          <View style={styles.iconContainer}>
            <MessageSquare size={24} color="#000" />
          </View>
          <Text style={styles.stepTitle}>Connect & Buy</Text>
          <Text style={styles.stepDescription}>
            Message the seller and arrange collection or delivery
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});