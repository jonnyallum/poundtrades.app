import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ShieldCheck, Briefcase, User, Box, Loader2, Eye, EyeOff } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const router = useRouter();
    const [role, setRole] = useState<'private' | 'business' | 'direct' | 'admin'>('private');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const roles = [
        { id: 'private', label: 'Private Seller', icon: User },
        { id: 'business', label: 'Business', icon: Briefcase },
        { id: 'direct', label: 'Poundtrades Direct', icon: Box },
        { id: 'admin', label: 'Admin', icon: ShieldCheck },
    ];

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { role }
                    }
                });
                if (error) throw error;
                Alert.alert('Success', 'Check your email for confirmation');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.replace('/');
            }
        } catch (error: any) {
            Alert.alert('Auth Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.blurTop, { backgroundColor: colors.primary, opacity: 0.2 }]} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.primary }]}>
                        {isSignUp ? 'JOIN THE' : 'BACK TO'} <Text style={{ color: '#FFF' }}>NETWORK</Text>
                    </Text>
                    <Text style={styles.subtitle}>
                        {isSignUp ? 'Select your account type to continue' : 'Enter your credentials to enter the marketplace'}
                    </Text>
                </View>

                {isSignUp && (
                    <View style={styles.roleGrid}>
                        {roles.map((r: any) => {
                            const Icon = r.icon;
                            const active = role === r.id;
                            return (
                                <TouchableOpacity
                                    key={r.id}
                                    onPress={() => setRole(r.id)}
                                    style={[
                                        styles.roleCard,
                                        {
                                            backgroundColor: active ? colors.primary : 'rgba(255,255,255,0.03)',
                                            borderColor: active ? colors.primary : colors.border
                                        }
                                    ]}
                                >
                                    <Icon size={24} color={active ? '#000' : colors.textMuted} />
                                    <Text style={[styles.roleLabel, { color: active ? '#000' : '#FFF' }]}>{r.label}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={styles.inputSection}>
                    <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                        <TextInput
                            placeholder="Email address"
                            placeholderTextColor="#666"
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={[styles.inputWrapper, { borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor="#666"
                            secureTextEntry={!showPassword}
                            style={[styles.input, { flex: 1 }]}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                            {showPassword ? (
                                <EyeOff size={20} color={colors.textMuted} />
                            ) : (
                                <Eye size={20} color={colors.textMuted} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={loading}
                    style={[styles.loginButton, { backgroundColor: colors.primary }]}
                    onPress={handleAuth}
                >
                    {loading ? (
                        <Loader2 size={20} color="#000" style={styles.spinner} />
                    ) : (
                        <>
                            <Text style={styles.loginText}>{isSignUp ? 'CREATE ACCOUNT' : 'ENTER MARKETPLACE'}</Text>
                            <ChevronRight size={20} color="#000" />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.forgotPass}
                    onPress={() => setIsSignUp(!isSignUp)}
                >
                    <Text style={[styles.forgotText, { color: colors.textMuted }]}>
                        {isSignUp ? 'Already have an account?' : 'New here?'} <Text style={{ color: colors.primary }}>{isSignUp ? 'Sign in' : 'Create account'}</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    blurTop: {
        position: 'absolute',
        top: -150,
        left: -50,
        width: 400,
        height: 400,
        borderRadius: 200,
        ...Platform.select({ web: { filter: 'blur(100px)' } }),
    },
    content: { flex: 1, padding: 24, justifyContent: 'center', zIndex: 10 },
    header: { marginBottom: 40 },
    title: { fontSize: 42, fontWeight: '900', letterSpacing: -2, lineHeight: 48 },
    subtitle: { color: '#888', fontSize: 16, marginTop: 10 },
    roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 40 },
    roleCard: { width: (width - 48 - 12) / 2, padding: 20, borderRadius: 24, borderWidth: 1, gap: 12 },
    roleLabel: { fontSize: 14, fontWeight: 'bold' },
    inputSection: { gap: 12, marginBottom: 24 },
    inputWrapper: { height: 64, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, borderWidth: 1, paddingHorizontal: 20, justifyContent: 'center' },
    input: { color: '#FFF', fontSize: 16 } as any,
    loginButton: { height: 64, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
    loginText: { fontWeight: '900', fontSize: 16, letterSpacing: 1 },
    forgotPass: { marginTop: 24, alignItems: 'center' },
    forgotText: { fontSize: 14 },
    spinner: { transform: [{ rotate: '0deg' }] } // Add animation keyframes in CSS if needed, but react-native handling for now
});
