import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';

interface ListingCardProps {
    title: string;
    price: string;
    location: string;
    status: 'active' | 'pending' | 'sold';
    onPress: () => void;
}

export function ListingCard({ title, price, location, status, onPress }: ListingCardProps) {
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
        <TouchableOpacity onPress={onPress} style={styles.card}>
            <View style={styles.imagePlaceholder}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={[styles.price, { color: colors.primary }]}>{price}</Text>
                </View>
                <Text style={styles.location}>{location}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#121212',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#222',
        overflow: 'hidden',
        marginBottom: 16,
    },
    imagePlaceholder: {
        height: 180,
        backgroundColor: '#1A1A1A',
    },
    statusDot: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 12,
        height: 12,
        borderRadius: 6,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    content: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
    price: {
        fontSize: 20,
        fontWeight: '900',
    },
    location: {
        color: '#888',
        fontSize: 14,
    }
});
