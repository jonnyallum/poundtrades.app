import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
    const { colors } = useTheme();
    const router = useRouter();
    const [role, setRole] = useState<'private' | 'business' | 'direct' | 'admin'>('private');

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.primary }]}>
                JOIN THE <Text style={{ color: '#FFF' }}>NETWORK</Text>
            </Text>

            <View style={styles.rolePicker}>
                {(['private', 'business', 'direct', 'admin'] as const).map((r) => (
                    <TouchableOpacity
                        key={r}
                        onPress={() => setRole(r)}
                        style={[
                            styles.roleButton,
                            { borderColor: role === r ? colors.primary : '#333' }
                        ]}
                    >
                        <Text style={{ color: role === r ? colors.primary : '#888', textTransform: 'capitalize' }}>{r}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity
                style={[styles.loginButton, { backgroundColor: colors.primary }]}
                onPress={() => router.replace('/')}
            >
                <Text style={styles.loginText}>CONTINUE AS {role.toUpperCase()}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        marginBottom: 40,
        textAlign: 'center',
    },
    rolePicker: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 30,
        justifyContent: 'center',
    },
    roleButton: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        minWidth: 100,
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#111',
        borderWidth: 1,
        borderColor: '#222',
        borderRadius: 16,
        padding: 20,
        color: '#FFF',
        marginBottom: 15,
    },
    loginButton: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    loginText: {
        fontWeight: '900',
        color: '#000',
    }
});
