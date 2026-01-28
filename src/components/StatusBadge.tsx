import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

type StatusBadgeProps = {
  status: 'available' | 'unlocked' | 'sold';
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();

  // Determine color based on status
  let color = theme.colors.status.active;
  let label = 'Available';

  if (status === 'unlocked') {
    color = theme.colors.status.pending;
    label = 'Unlocked';
  } else if (status === 'sold') {
    color = theme.colors.status.sold;
    label = 'Sold';
  }

  return (
    <View style={[styles.container, { backgroundColor: `${color}15`, borderColor: `${color}30` }]}>
      <Circle size={8} color={color} fill={color} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});