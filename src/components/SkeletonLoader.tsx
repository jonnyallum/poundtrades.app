import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SkeletonLoaderProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: object;
}

/**
 * A premium skeleton loading component with a shimmering animation.
 * Used to indicate loading states across the app.
 */
export function SkeletonLoader({
    width = '100%',
    height = 20,
    borderRadius = 8,
    style,
}: SkeletonLoaderProps) {
    const { colors, isDark, layout } = useTheme();
    const shimmerValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmerAnimation = Animated.loop(
            Animated.timing(shimmerValue, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            })
        );
        shimmerAnimation.start();

        return () => shimmerAnimation.stop();
    }, [shimmerValue]);

    const translateX = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-layout.width, layout.width],
    });

    const baseColor = isDark ? '#0A0A0A' : '#e0e0e0';
    const highlightColor = isDark ? '#1C1C1C' : '#f5f5f5';

    return (
        <View
            style={[
                styles.container,
                {
                    width,
                    height,
                    borderRadius,
                    backgroundColor: baseColor,
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.shimmer,
                    {
                        transform: [{ translateX }],
                        backgroundColor: highlightColor,
                    },
                ]}
            />
        </View>
    );
}

/**
 * A pre-built skeleton for listing cards with image, title, price, and location.
 */
export function ListingCardSkeleton() {
    const { colors, layout, radius } = useTheme();

    return (
        <View style={[styles.cardContainer, { backgroundColor: colors.card, marginBottom: layout.scale(20), borderRadius: radius.xl }]}>
            {/* Image skeleton */}
            <SkeletonLoader width="100%" height={layout.scale(220)} borderRadius={radius.lg} />

            {/* Content */}
            <View style={[styles.cardContent, { padding: layout.scale(16) }]}>
                {/* Title */}
                <SkeletonLoader width="80%" height={layout.moderateScale(18)} borderRadius={4} />

                {/* Price */}
                <SkeletonLoader width="40%" height={layout.moderateScale(24)} borderRadius={4} style={{ marginTop: layout.scale(12) }} />

                {/* Location */}
                <View style={[styles.locationRow, { marginTop: layout.scale(12) }]}>
                    <SkeletonLoader width={layout.scale(16)} height={layout.scale(16)} borderRadius={radius.sm} />
                    <SkeletonLoader width="60%" height={layout.moderateScale(14)} borderRadius={4} style={{ marginLeft: 6 }} />
                </View>
            </View>
        </View>
    );
}

/**
 * A grid of listing card skeletons for loading states.
 */
export function ListingsGridSkeleton({ count = 4 }: { count?: number }) {
    const { layout } = useTheme();
    return (
        <View style={[styles.gridContainer, { paddingHorizontal: layout.scale(10) }]}>
            {Array.from({ length: count }).map((_, index) => (
                <View key={index} style={[styles.gridItem, { padding: layout.scale(10) }]}>
                    <ListingCardSkeleton />
                </View>
            ))}
        </View>
    );
}

/**
 * Horizontal scrolling skeleton for featured listings.
 */
export function FeaturedListingsSkeleton() {
    const { layout } = useTheme();
    const CARD_WIDTH = layout.width * 0.82;

    return (
        <View style={[styles.horizontalContainer, { paddingHorizontal: layout.scale(20) }]}>
            {[1, 2].map((index) => (
                <View key={index} style={[styles.featuredCard, { width: CARD_WIDTH, marginRight: layout.scale(16) }]}>
                    <ListingCardSkeleton />
                </View>
            ))}
        </View>
    );
}

/**
 * Category grid skeleton loader.
 */
export function CategoryGridSkeleton() {
    const { layout, radius } = useTheme();
    return (
        <View style={[styles.horizontalContainer, { paddingHorizontal: layout.scale(20) }]}>
            {[1, 2, 3, 4].map((index) => (
                <View key={index} style={[styles.categoryCard, { marginRight: layout.scale(12) }]}>
                    <SkeletonLoader width={layout.scale(94)} height={layout.scale(104)} borderRadius={radius.lg} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        position: 'relative',
    },
    shimmer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.5,
    },
    cardContainer: {
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    cardContent: {
        // padding dynamic
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    gridItem: {
        width: '100%',
    },
    horizontalContainer: {
        flexDirection: 'row',
    },
    featuredCard: {
        // width and marginRight dynamic
    },
    featuredContent: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    categoryCard: {
        alignItems: 'center',
    },
});

export default SkeletonLoader;
