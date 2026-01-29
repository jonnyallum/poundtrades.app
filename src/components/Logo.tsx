import { View, Image, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

/**
 * Logo component for displaying the PoundTrades logo
 *
 * @param {Object} props
 * @param {boolean} props.showText - Whether to show the text next to the logo
 * @param {string} props.size - Size of the logo (small, medium, large)
 * @param {string} props.textColor - Color of the text (default: primary theme color)
 * @returns {JSX.Element}
 */
export default function Logo({
  showText = true,
  size = 'medium',
  textColor
}: {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}) {
  const { theme } = useTheme();

  // Map sizes to dimensions
  const sizes = {
    small: { imageSize: 24, fontSize: 18, marginLeft: 4 },
    medium: { imageSize: 32, fontSize: 24, marginLeft: 8 },
    large: { imageSize: 96, fontSize: 32, marginLeft: 12 },
  };

  const { imageSize, fontSize, marginLeft } = sizes[size];

  // Use provided textColor or default to theme primary color
  const color = textColor || theme.primary;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/icon.png')}
        style={[
          styles.image,
          { width: imageSize, height: imageSize },
          styles.logoShadow
        ]}
        resizeMode="contain"
      />
      {showText && (
        <Text style={[
          styles.text,
          { fontSize, marginLeft, color }
        ]}>
          PoundTrades
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 32,
    height: 32,
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  logoShadow: {
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  }
});