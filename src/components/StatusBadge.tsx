import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';

type StatusBadgeProps = {
  status: 'available' | 'unlocked' | 'sold';
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Determine color based on status (traffic light system)
  let color = '#34A853'; // Green for available
  let label = 'Available';
  
  if (status === 'unlocked') {
    color = '#FBBC05'; // Amber for unlocked
    label = 'Unlocked';
  } else if (status === 'sold') {
    color = '#EA4335'; // Red for sold
    label = 'Sold';
  }

  return (
    <View style={[styles.container, { backgroundColor: `${color}20` }]}>
      <Circle size={8} color={color} fill={color} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
});