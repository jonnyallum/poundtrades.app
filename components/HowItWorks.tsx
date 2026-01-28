import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Search, Coins, MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export default function HowItWorks() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>How It Works</Text>

      <View style={styles.stepsContainer}>
        <View style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Search size={22} color="#000" />
          </View>
          <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Find Materials</Text>
          <Text style={[styles.stepDescription, { color: theme.colors.textMuted }]}>
            Browse surplus building materials near you
          </Text>
        </View>

        <View style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <Coins size={22} color="#000" />
          </View>
          <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Pay £1</Text>
          <Text style={[styles.stepDescription, { color: theme.colors.textMuted }]}>
            Unlock contact for a tiny connection fee
          </Text>
        </View>

        <View style={[styles.step, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MessageSquare size={22} color="#000" />
          </View>
          <Text style={[styles.stepTitle, { color: theme.colors.text }]}>Connect</Text>
          <Text style={[styles.stepDescription, { color: theme.colors.textMuted }]}>
            Message the seller and arrange collection
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  stepsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  stepDescription: {
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
});