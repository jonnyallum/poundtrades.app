import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export default function MoreScreen() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.settingItem, { backgroundColor: theme.card }]}>
        <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: theme.primary }}
          thumbColor={isDark ? theme.primary : '#f4f3f4'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10
  },
  settingText: {
    fontSize: 16
  }
});