import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { ChevronRight, ShieldCheck, Briefcase, User, Box, Eye, EyeOff, Sparkles } from 'lucide-react-native';
import { createWebIcon } from '@/components/Icon';
import { useAuthStore } from '@/lib/auth';

const { width } = Dimensions.get('window');

// Web-wrapped icons to fix styling bugs
const WebUser = createWebIcon(User);
const WebBriefcase = createWebIcon(Briefcase);
const WebBox = createWebIcon(Box);
const WebShield = createWebIcon(ShieldCheck);
const WebEye = createWebIcon(Eye);
const WebEyeOff = createWebIcon(EyeOff);
const WebChevronRight = createWebIcon(ChevronRight);
const WebSparkles = createWebIcon(Sparkles);

export default function LoginScreen() {
    const { colors, typography, spacing, radius, shadows } = useTheme();
    const router = useRouter();
    const [role, setRole] = useState<'private' | 'business' | 'direct' | 'admin'>('private');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const roles = [
        { id: 'private', label: 'PRIVATE SELLER', icon: WebUser },
        { id: 'business', label: 'BUSINESS PRO', icon: WebBriefcase },
        { id: 'direct', label: 'POUNDTRADES DIRECT', icon: WebBox },
        { id: 'admin', label: 'ADMINISTRATOR', icon: WebShield },
    ];

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { role }
                    }
                });
                if (error) throw error;
                Alert.alert('SUCCESS', 'Verification email sent. Check your inbox.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.replace('/');
            }
        } catch (error: any) {
            Alert.alert('AUTH ERROR', error.message.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Top gold glow effect */}
            <View style={[styles.glowTop, { backgroundColor: colors.primary }]} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: colors.text, ...typography.h1 }]}>
                        {isSignUp ? 'SIGN UP TO THE' : 'BACK TO THE'}{'\n'}
                        <Text style={{ color: colors.primary, ...typography.display }}>NETWORK</Text>
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {isSignUp
                            ? 'Select your elite credentials to gain access.'
                            : 'Enter your credentials to enter the marketplace.'}
                    </Text>
                </View>

                {isSignUp && (
                    <View style={styles.roleGrid}>
                        {roles.map((r) => {
                            const IconComp = r.icon;
                            const active = role === r.id;
                            return (
                                <TouchableOpacity
                                    key={r.id}
                                    onPress={() => setRole(r.id as any)}
                                    style={[
                                        styles.roleCard,
                                        {
                                            backgroundColor: active ? colors.primary : colors.card,
                                            borderColor: active ? colors.primary : colors.border,
                                            ...shadows.sm,
                                        }
                                    ]}
                                >
                                    <View style={styles.roleHeader}>
                                        <IconComp size={22} color={active ? '#000' : colors.primary} />
                                        {active && <WebSparkles size={14} color="#000" />}
                                    </View>
                                    <Text style={[styles.roleLabel, { color: active ? '#000' : colors.text }]}>
                                        {r.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                <View style={styles.inputSection}>
                    <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <TextInput
                            placeholder="Ex: roger@poundtrades.com"
                            placeholderTextColor={colors.textMuted}
                            style={[styles.input, { color: colors.text }]}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <Text style={styles.inputLabel}>SECURITY PASS</Text>
                    <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border, flexDirection: 'row', alignItems: 'center' }]}>
                        <TextInput
                            placeholder="••••••••••••"
                            placeholderTextColor={colors.textMuted}
                            secureTextEntry={!showPassword}
                            style={[styles.input, { flex: 1, color: colors.text }]}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                            {showPassword ? (
                                <WebEyeOff size={20} color={colors.primary} />
                            ) : (
                                <WebEye size={20} color={colors.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    activeOpacity={0.8}
                    disabled={loading}
                    style={[
                        styles.ctaButton,
                        { backgroundColor: colors.primary },
                        shadows.glow
                    ]}
                    onPress={handleAuth}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <>
                            <Text style={styles.ctaText}>
                                {isSignUp ? 'CREATE ELITE ACCOUNT' : 'SECURE SIGN IN'}
                            </Text>
                            <WebChevronRight size={22} color="#000" strokeWidth={3} />
                        </>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.switchMode}
                    onPress={() => setIsSignUp(!isSignUp)}
                >
                    <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                        {isSignUp ? 'Already part of the network?' : 'Not registered yet?'}
                        <Text style={{ color: colors.primary, fontWeight: '800' }}> {isSignUp ? 'SIGN IN' : 'JOIN NOW'}</Text>
                    </Text>
                </TouchableOpacity>

                {__DEV__ && (
                    <TouchableOpacity
                        style={[styles.bypassButton, { borderColor: colors.primary, marginTop: 40 }]}
                        onPress={async () => {
                            // @ts-ignore - bypassLogin exists on the store now
                            const result = await useAuthStore.getState().bypassLogin();
                            if (result.success) router.replace('/');
                        }}
                    >
                        <Text style={[styles.bypassText, { color: colors.primary }]}>[ DEV BYPASS LOGIN ]</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    glowTop: {
        position: 'absolute',
        top: -200,
        left: -100,
        width: 600,
        height: 400,
        borderRadius: 300,
        opacity: 0.15,
        ...Platform.select({ web: { filter: 'blur(120px)' } }),
    },
    content: { flex: 1, padding: 24, justifyContent: 'center' },
    header: { marginBottom: 40 },
    title: {
        fontWeight: '900',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        marginTop: 12,
        fontWeight: '500',
        lineHeight: 22,
    },
    roleGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32
    },
    roleCard: {
        width: (width - 48 - 12) / 2,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1.5,
        gap: 12
    },
    roleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roleLabel: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    inputSection: { gap: 8, marginBottom: 32 },
    inputLabel: {
        fontSize: 11,
        fontWeight: '900',
        color: '#A3A3A3',
        letterSpacing: 1,
        marginBottom: 4,
        marginLeft: 4,
    },
    inputWrapper: {
        height: 60,
        borderRadius: 12,
        borderWidth: 1,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
    input: { fontSize: 16, fontWeight: '600' } as any,
    ctaButton: {
        height: 64,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12
    },
    ctaText: {
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 1.5,
        color: '#000',
    },
    switchMode: { marginTop: 32, alignItems: 'center' },
    switchText: { fontSize: 13, letterSpacing: 0.5 },
    bypassButton: {
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bypassText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
