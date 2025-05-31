import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuthStore } from '@/lib/auth';
import { useTheme } from '@/hooks/useTheme';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    const result = await login(email, password);
    
    if (result.success) {
      router.replace('/(tabs)');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.text} />
          </Pressable>
        </View>

        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.text }]}>PoundTrades</Text>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Log In</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Welcome back! Please enter your details
        </Text>

        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondaryText }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={theme.secondaryText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.secondaryText }]}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.passwordInput,
                  { 
                    backgroundColor: theme.card,
                    color: theme.text,
                    borderColor: theme.border
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={theme.secondaryText}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable 
                style={styles.eyeIcon} 
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.secondaryText} />
                ) : (
                  <Eye size={20} color={theme.secondaryText} />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable
            style={[
              styles.loginButton,
              { backgroundColor: theme.primary }
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.loginButtonText}>Log In</Text>
            )}
          </Pressable>

          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.secondaryText }]}>
              Don't have an account?
            </Text>
            {/* Temporarily commenting out the register link since it's not implemented yet */}
            {/* <Link href="/register" asChild>
              <Pressable>
                <Text style={[styles.registerLink, { color: theme.primary }]}>
                  Sign up
                </Text>
              </Pressable>
            </Link> */}
            <Pressable>
              <Text style={[styles.registerLink, { color: theme.primary }]}>
                Sign up
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.helpSection}>
          <Text style={[styles.helpText, { color: theme.secondaryText }]}>
            For testing, use these credentials:
          </Text>
          <Text style={[styles.credentials, { color: theme.text }]}>
            Email: admin@poundtrades.co.uk
          </Text>
          <Text style={[styles.credentials, { color: theme.text }]}>
            Password: admin123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 60,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  errorContainer: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  loginButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  helpSection: {
    marginTop: 40,
    padding: 15,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    marginBottom: 10,
  },
  credentials: {
    fontSize: 14,
    fontWeight: '500',
  },
});