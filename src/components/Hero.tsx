import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable, Dimensions, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
  FadeIn
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Logo from './Logo';

const { width } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Hero() {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isWeb) scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    if (!isWeb) {
      scale.value = withSpring(1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Web-safe wrappers
  const ViewWrapper = isWeb ? View : Animated.View;
  const TextWrapper = isWeb ? Text : Animated.Text;
  const ButtonWrapper = isWeb ? Pressable : AnimatedPressable;
  const buttonStyles = isWeb
    ? styles.button
    : [styles.button, pressStyle];

  return (
    <ImageBackground
      source={{ uri: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg' }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']}
        style={styles.overlay}
      >
        <View style={styles.contentContainer}>
          <ViewWrapper {...(!isWeb && { entering: FadeInDown.duration(800).delay(200) })}>
            <Logo size="large" />
          </ViewWrapper>

          <TextWrapper
            {...(!isWeb && { entering: FadeInDown.duration(800).delay(400) })}
            style={styles.tagline}
          >
            Turn your surplus into cash
          </TextWrapper>

          <TextWrapper
            {...(!isWeb && { entering: FadeInDown.duration(800).delay(600) })}
            style={styles.subtitle}
          >
            List, connect, and sell your leftover building materials quickly and easily.
          </TextWrapper>

          <Link href={"/(tabs)/listings" as any} asChild>
            <ButtonWrapper
              {...(!isWeb && { entering: FadeInDown.duration(800).delay(800) })}
              style={buttonStyles as any}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Browse Listings</Text>
              <ArrowRight size={18} color="#000" />
            </ButtonWrapper>
          </Link>

          <TextWrapper
            {...(!isWeb && { entering: FadeIn.duration(1000).delay(1200) })}
            style={styles.costText}
          >
            Only £1 to connect
          </TextWrapper>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 480,
    width: '100%',
  },
  backgroundImage: {
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '900',
    color: '#fff',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 32,
    lineHeight: 26,
    textAlign: 'center',
    maxWidth: '90%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 20,
    width: width - 48,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  costText: {
    color: '#FFD700',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});