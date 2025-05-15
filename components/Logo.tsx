import { View, Text, StyleSheet } from 'react-native';

export default function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const fontSize = {
    small: 18,
    medium: 24,
    large: 32,
  }[size];

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize }]}>
        <Text style={styles.pound}>£</Text>
        <Text style={styles.trades}>Trades</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  pound: {
    color: '#FFD700',
  },
  trades: {
    color: '#000',
  },
});