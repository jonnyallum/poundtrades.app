import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { X, Camera, MapPin, Check, Loader2 } from 'lucide-react-native';

export default function CreateListing() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Bricks',
        location: '',
    });

    const categories = ['Bricks', 'Timber', 'Roofing', 'Tools', 'Screws', 'Paint'];

    const handleCreate = async () => {
        if (!form.title || !form.price) {
            Alert.alert('Error', 'Please fill in required fields');
            return;
        }

        setLoading(true);
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData?.user) throw new Error('User not found');

            const { error } = await supabase
                .from('listings')
                .insert([{
                    title: form.title,
                    description: form.description,
                    price_pounds: parseFloat(form.price),
                    category: form.category,
                    seller_id: userData.user.id,
                    status: 'active'
                }]);

            if (error) throw error;

            Alert.alert('Success', 'Listing created successfully');
            router.back();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <X size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Listing</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Photo Upload Placeholder */}
                <TouchableOpacity style={[styles.photoBox, { borderColor: colors.border }]}>
                    <Camera size={40} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontWeight: 'bold', marginTop: 10 }}>ADD PHOTOS</Text>
                </TouchableOpacity>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        placeholder="e.g. 500x Facing Bricks"
                        placeholderTextColor="#444"
                        style={[styles.input, { borderColor: colors.border }]}
                        value={form.title}
                        onChangeText={(t) => setForm({ ...form, title: t })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
                        {categories.map((c) => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setForm({ ...form, category: c })}
                                style={[
                                    styles.catChip,
                                    {
                                        backgroundColor: form.category === c ? colors.primary : 'rgba(255,255,255,0.05)',
                                        borderColor: form.category === c ? colors.primary : colors.border
                                    }
                                ]}
                            >
                                <Text style={{ color: form.category === c ? '#000' : '#FFF', fontWeight: 'bold' }}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Price (£) *</Text>
                    <TextInput
                        placeholder="0.00"
                        placeholderTextColor="#444"
                        keyboardType="decimal-pad"
                        style={[styles.input, { borderColor: colors.border }]}
                        value={form.price}
                        onChangeText={(t) => setForm({ ...form, price: t })}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        placeholder="Tell buyers about your materials..."
                        placeholderTextColor="#444"
                        multiline
                        numberOfLines={4}
                        style={[styles.input, styles.textArea, { borderColor: colors.border }]}
                        value={form.description}
                        onChangeText={(t) => setForm({ ...form, description: t })}
                    />
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={loading}
                    style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                    onPress={handleCreate}
                >
                    {loading ? (
                        <Loader2 size={24} color="#000" />
                    ) : (
                        <>
                            <Check size={24} color="#000" />
                            <Text style={styles.submitText}>PUBLISH LISTING</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
    headerTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    closeBtn: { padding: 10, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12 },
    content: { padding: 24, gap: 24 },
    photoBox: { height: 200, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
    inputGroup: { gap: 8 },
    label: { color: '#888', fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
    input: { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderRadius: 16, padding: 16, color: '#FFF', fontSize: 16 },
    textArea: { height: 120, textAlignVertical: 'top' },
    catScroll: { marginHorizontal: -24, paddingHorizontal: 24 },
    catChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, marginRight: 10 },
    submitBtn: { height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 20 },
    submitText: { fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});
