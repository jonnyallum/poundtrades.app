import React, { useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Animated,
    Easing,
    ActivityIndicator,
} from 'react-native';
import { Lock, Unlock, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

interface UnlockButtonProps {
    onPress: () => void;
    loading?: boolean;
    price?: string;
    unlocked?: boolean;
    disabled?: boolean;
}

/**
 * A premium animated unlock button with pulse effect and state transitions.
 * Used on listing detail pages to unlock seller contact information.
 */
export default function UnlockButton({
    onPress,
    loading = false,
    price = '£1',
    unlocked = false,
    disabled = false,
}: UnlockButtonProps) {
    const { colors, isDark } = useTheme();

    // Animation values
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const [showSparkle, setShowSparkle] = useState(false);

    // Continuous pulse animation for attention
    useEffect(() => {
        if (!unlocked && !loading) {
            const pulseAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.03,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            pulseAnimation.start();
            return () => pulseAnimation.stop();
        }
    }, [unlocked, loading, pulseAnim]);

    // Glow animation for premium feel
    useEffect(() => {
        if (!unlocked && !loading) {
            const glowAnimation = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.inOut(Easing.ease),
                        useNativeDriver: true,
                    }),
                ])
            );
            glowAnimation.start();
            return () => glowAnimation.stop();
        }
    }, [unlocked, loading, glowAnim]);

    // Handle press with micro-interaction
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePress = () => {
        if (loading || disabled || unlocked) return;

        // Trigger sparkle effect
        setShowSparkle(true);
        setTimeout(() => setShowSparkle(false), 600);

        // Haptic-like shake animation
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 5,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -5,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 3,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();

        onPress();
    };

    // Interpolate glow opacity
    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.6],
    });

    if (unlocked) {
        return (
            <View style={[styles.unlockedContainer, { backgroundColor: '#10b981' }]}>
                <Unlock size={22} color="#fff" />
                <Text style={styles.unlockedText}>Seller Info Unlocked!</Text>
            </View>
        );
    }

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [
                        { scale: Animated.multiply(pulseAnim, scaleAnim) },
                        { translateX: shakeAnim },
                    ],
                },
            ]}
        >
            {/* Glow effect layer */}
            <Animated.View
                style={[
                    styles.glowLayer,
                    {
                        opacity: glowOpacity,
                        backgroundColor: colors.primary,
                    },
                ]}
            />

            <Pressable
                onPress={handlePress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={loading || disabled}
                style={[
                    styles.button,
                    { backgroundColor: colors.primary },
                    disabled && styles.buttonDisabled,
                ]}
            >
                {loading ? (
                    <ActivityIndicator color="#000" size="small" />
                ) : (
                    <>
                        <View style={styles.iconContainer}>
                            <Lock size={20} color="#000" />
                            {showSparkle && (
                                <View style={styles.sparkleContainer}>
                                    <Sparkles size={16} color={colors.primary} />
                                </View>
                            )}
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.mainText}>Unlock Seller Info</Text>
                            <Text style={styles.priceText}>Only {price}</Text>
                        </View>
                    </>
                )}
            </Pressable>

            {/* Price badge */}
            <View style={[styles.priceBadge, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                <Text style={[styles.priceBadgeText, { color: colors.primary }]}>
                    {price}
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        marginVertical: 16,
        borderRadius: 16,
        overflow: 'visible',
    },
    glowLayer: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: 20,
        zIndex: -1,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    iconContainer: {
        marginRight: 12,
        position: 'relative',
    },
    sparkleContainer: {
        position: 'absolute',
        top: -8,
        right: -8,
    },
    textContainer: {
        alignItems: 'flex-start',
    },
    mainText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#000',
        letterSpacing: -0.3,
    },
    priceText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    priceBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    priceBadgeText: {
        fontSize: 14,
        fontWeight: '900',
    },
    unlockedContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
        borderRadius: 16,
        marginVertical: 16,
    },
    unlockedText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#fff',
        marginLeft: 12,
        letterSpacing: -0.3,
    },
});
