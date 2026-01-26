import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Search, MapPin, Filter } from 'lucide-react-native';

export default function Marketplace() {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            {/* Header */}
            <View style={{ padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: colors.primary, fontSize: 32, fontWeight: '900' }}>
                    POUND<Text style={{ color: '#fff' }}>TRADES</Text>
                </Text>
                <TouchableOpacity style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}>
                    <Search size={24} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Ad Space */}
                <View style={{ backgroundColor: '#1A1A1A', borderRadius: 16, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: '#333' }}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold', marginBottom: 5 }}>SPONSORED</Text>
                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Travis Perkins</Text>
                    <Text style={{ color: '#888', marginTop: 5 }}>Bulk 15% discount on all bricks this week.</Text>
                </View>

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 30 }}>
                    {['Bricks', 'Timber', 'Roofing', 'Tools', 'Plumbing'].map((cat) => (
                        <TouchableOpacity key={cat} style={{ backgroundColor: '#121212', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#222' }}>
                            <Text style={{ color: '#fff', fontWeight: '600' }}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>Recent Listings</Text>

                {/* Mock Listings */}
                <View style={{ gap: 20 }}>
                    {[1, 2, 3].map((i) => (
                        <TouchableOpacity key={i} style={{ backgroundColor: '#121212', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#222' }}>
                            <View style={{ height: 200, backgroundColor: '#222' }}>
                                {/* Status Indicator */}
                                <View style={{ position: 'absolute', top: 15, right: 15, width: 12, height: 12, borderRadius: 6, backgroundColor: colors.status.active, shadowColor: colors.status.active, shadowRadius: 10, shadowOpacity: 0.8 }} />
                            </View>
                            <View style={{ padding: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>Premium Facing Bricks</Text>
                                    <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '900' }}>£1</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <MapPin size={14} color="#888" />
                                    <Text style={{ color: '#888', marginLeft: 4 }}>Manchester, 2.4 miles</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
