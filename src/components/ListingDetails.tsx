import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Lock, Phone, User, Calendar } from 'lucide-react-native';
import { useState } from 'react';

export function ListingDetails({ listing }: any) {
    const { theme } = useTheme();
    const colors = theme.colors;
    const [isUnlocked, setIsUnlocked] = useState(false);

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.imageHeader} />

            <View style={styles.content}>
                <Text style={styles.category}>TIMBER / SOFTWOOD</Text>
                <Text style={styles.title}>C24 Grade Structural Timber</Text>
                <Text style={[styles.price, { color: colors.primary }]}>£120.00</Text>

                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Calendar size={16} color="#888" />
                        <Text style={styles.statText}>Listed 2h ago</Text>
                    </View>
                    <View style={styles.statItem}>
                        <User size={16} color="#888" />
                        <Text style={styles.statText}>Private Seller</Text>
                    </View>
                </View>

                <Text style={styles.description}>
                    Surplus from a recent decking project. 15 lengths of 4.8m C24 treated timber.
                    Stored under cover, perfectly straight and ready for collection.
                </Text>

                {!isUnlocked ? (
                    <TouchableOpacity
                        style={[styles.unlockButton, { backgroundColor: colors.primary }]}
                        onPress={() => setIsUnlocked(true)}
                    >
                        <Lock size={20} color="#000" />
                        <Text style={styles.unlockText}>UNLOCK SELLER DETAILS (£1)</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.sellerDetails}>
                        <Text style={[styles.revealHeader, { color: colors.primary }]}>DETAILS UNLOCKED</Text>
                        <View style={styles.detailRow}>
                            <User size={20} color="#fff" />
                            <Text style={styles.detailValue}>John Allum</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Phone size={20} color="#fff" />
                            <Text style={styles.detailValue}>+44 7700 900000</Text>
                        </View>
                        <Text style={styles.expiryNote}>This contact info will be available for 3 days.</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    imageHeader: { height: 350, backgroundColor: '#111' },
    content: { padding: 24, borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -30, backgroundColor: '#000' },
    category: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    title: { color: '#FFF', fontSize: 26, fontWeight: '900', marginTop: 8 },
    price: { fontSize: 32, fontWeight: '900', marginTop: 10 },
    stats: { flexDirection: 'row', gap: 20, marginTop: 20 },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { color: '#888', fontSize: 14 },
    description: { color: '#AAA', fontSize: 16, lineHeight: 24, marginTop: 20 },
    unlockButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, padding: 22, borderRadius: 20, marginTop: 40 },
    unlockText: { fontWeight: '900', color: '#000', fontSize: 16 },
    sellerDetails: { backgroundColor: '#111', padding: 25, borderRadius: 24, marginTop: 40, borderWidth: 1, borderColor: '#333' },
    revealHeader: { fontSize: 14, fontWeight: 'bold', marginBottom: 15, letterSpacing: 2 },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    detailValue: { color: '#FFF', fontSize: 18, fontWeight: '600' },
    expiryNote: { color: '#666', fontSize: 12, marginTop: 10, fontStyle: 'italic' }
});
