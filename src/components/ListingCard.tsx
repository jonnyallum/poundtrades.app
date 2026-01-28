import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, ArrowUpRight } from 'lucide-react-native';

interface ListingCardProps {
    title: string;
    price: string;
    location: string;
    status: 'active' | 'pending' | 'sold';
    category: string;
    onPress: () => void;
}

export function ListingCard({ title, price, location, status, category, onPress }: ListingCardProps) {
    const { colors } = useTheme();

    const getStatusColor = () => {
        switch (status) {
            case 'active': return colors.status.active;
            case 'pending': return colors.status.pending;
            case 'sold': return colors.status.sold;
            default: return colors.primary;
        }
    };

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                {/* Image / Background Header */}
                <View style={styles.imageSection}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.imageContent}
                    >
                        <View style={styles.topBadgeRow}>
                            <View style={[styles.statusBadge, { backgroundColor: 'rgba(0,0,0,0.6)', borderColor: getStatusColor() }]}>
                                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                                <Text style={[styles.statusText, { color: getStatusColor() }]}>{status.toUpperCase()}</Text>
                            </View>
                            <View style={[styles.categoryBadge, { backgroundColor: colors.primary }]}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Info Section */}
                <View style={styles.content}>
                    <View style={styles.mainInfo}>
                        <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.locationContainer}>
                            <MapPin size={12} color={colors.textMuted} />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                        <TouchableOpacity style={styles.actionCircle}>
                            <ArrowUpRight size={16} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    card: {
        borderRadius: 28,
        borderWidth: 1,
        overflow: 'hidden',
    },
    imageSection: {
        height: 200,
        backgroundColor: '#111',
    },
    imageContent: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 16,
    },
    topBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99,
        borderWidth: 1,
        gap: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    categoryBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    categoryText: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        gap: 15,
    },
    mainInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '800',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 22,
        fontWeight: '900',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 15,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    locationText: {
        color: '#888',
        fontSize: 13,
    },
    actionCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,215,0,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    }
});
