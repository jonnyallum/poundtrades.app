import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform, RefreshControl } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, MapPin, Filter, Bell, Menu, Crown, Plus, LogOut } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ListingCard from '@/components/ListingCard';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Marketplace() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const router = useRouter();
    const [listings, setListings] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchListings = async () => {
        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchListings();
        setRefreshing(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.blurTop, { backgroundColor: colors.primary, opacity: 0.15 }]} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.iconButton} onPress={handleSignOut}>
                    <LogOut size={22} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Text style={[styles.logoText, { color: colors.primary }]}>
                        POUND<Text style={{ color: '#FFF' }}>TRADES</Text>
                    </Text>
                    <View style={[styles.logoUnderline, { backgroundColor: colors.primary }]} />
                </View>

                <TouchableOpacity style={styles.iconButton}>
                    <Bell size={24} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >

                {/* Search & Filter Bar */}
                <View style={styles.headerControls}>
                    <View style={[styles.searchBar, { borderColor: colors.border }]}>
                        <Search size={20} color={colors.textMuted} />
                        <Text style={styles.searchPlaceholder}>Search for materials...</Text>
                    </View>
                    <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary }]}>
                        <Filter size={20} color="#000" />
                    </TouchableOpacity>
                </View>

                {/* Featured Section */}
                <View style={styles.sectionHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={styles.sectionTitle}>Featured Offers</Text>
                        <Crown size={18} color={colors.primary} />
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredList}>
                    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={[styles.featuredCard, { borderColor: colors.border }]}>
                        <Text style={styles.adTitle}>Travis Perkins</Text>
                        <Text style={styles.adSubtitle}>15% Off Structural Timber</Text>
                        <TouchableOpacity style={[styles.adCta, { backgroundColor: 'rgba(255,215,0,0.1)' }]}>
                            <Text style={[styles.adCtaText, { color: colors.primary }]}>Claim Now</Text>
                        </TouchableOpacity>
                    </LinearGradient>

                    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={[styles.featuredCard, { borderColor: colors.border }]}>
                        <Text style={styles.adTitle}>Selco Direct</Text>
                        <Text style={styles.adSubtitle}>Free Delivery over £250</Text>
                        <TouchableOpacity style={styles.adCta}>
                            <Text style={styles.adCtaText}>Details</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </ScrollView>

                {/* Marketplace Feed */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Live Marketplace</Text>
                    <View style={styles.sortByRow}>
                        <Text style={styles.sortLabel}>{listings.length} Available</Text>
                    </View>
                </View>

                <View style={styles.listingGrid}>
                    {listings.length > 0 ? (
                        listings.map((l) => (
                            <ListingCard
                                key={l.id}
                                listing={{
                                    id: l.id,
                                    title: l.title,
                                    price: l.price_pounds,
                                    location: l.location || 'Manchester, UK',
                                    images: l.images || [l.image_url || 'https://via.placeholder.com/300'],
                                    status: l.status,
                                    userType: l.user_type || 'trader'
                                }}
                            />
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={{ color: '#888', textAlign: 'center' }}>No active listings found.</Text>
                            <Text style={{ color: colors.primary, textAlign: 'center', marginTop: 10 }}>Pull to refresh</Text>
                        </View>
                    )}
                </View>

            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.fab, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/create-listing')}
            >
                <Plus size={32} color="#000" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    blurTop: { position: 'absolute', top: -100, right: -50, width: 300, height: 300, borderRadius: 150, ...Platform.select({ web: { filter: 'blur(80px)' } }) },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20, zIndex: 10 },
    logoContainer: { alignItems: 'center' },
    logoText: { fontSize: 24, fontWeight: '900', letterSpacing: -1 },
    logoUnderline: { width: 20, height: 3, borderRadius: 2, marginTop: -2 },
    iconButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 14 },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 100 },
    headerControls: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 30 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, gap: 12 },
    searchPlaceholder: { color: '#888', fontSize: 16 },
    filterButton: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    sectionTitle: { color: '#FFF', fontSize: 22, fontWeight: '800' },
    featuredList: { marginBottom: 30, marginHorizontal: -24, paddingHorizontal: 24 },
    featuredCard: { width: width * 0.7, height: 160, borderRadius: 28, marginRight: 16, padding: 24, borderWidth: 1, justifyContent: 'space-between' },
    adTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' },
    adSubtitle: { color: '#AAA', fontSize: 14 },
    adCta: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)' },
    adCtaText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    listingGrid: { gap: 10 },
    sortByRow: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    sortLabel: { color: '#AAA', fontSize: 12, fontWeight: 'bold' },
    fab: { position: 'absolute', bottom: 30, right: 30, width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', shadowColor: '#FFD700', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10 },
    emptyState: { padding: 60, alignItems: 'center' }
});
