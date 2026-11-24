import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '@config/colors.config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/types';
import { useAppDispatch } from '@redux/hooks';
import { setUser } from '@redux/slices/auth/auth.slice';

const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Dispatch to Redux - Redux Persist will handle saving to MMKV automatically
    // The AppNavigator will automatically switch to 'Main' because isLoggedIn becomes true
    dispatch(setUser({
        id: '1',
        email: email,
        name: 'John Doe',
    }));
    Keyboard.dismiss()
  };

  const testCrash = () => {
    Alert.alert(
        "Test Crash",
        "The app will now crash to test Firebase Crashlytics integration.",
        [
            { text: "Cancel", style: "cancel" },
            { text: "Crash", onPress: () => crashlytics().crash() }
        ]
    );
  };

  return (
    <View style={[styles.mainContainer, { 
      paddingTop: insets.top, 
      paddingBottom: insets.bottom,
    }]}>
      <StatusBar
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor={COLORS.text.secondary}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                     placeholderTextColor={COLORS.text.secondary}
                />
            </View>

            <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.crashButton}
                onPress={testCrash}
            >
                <Text style={styles.crashButtonText}>Test Crash</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },
  input: {
    height: 56,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
  },
  loginButton: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  crashButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  crashButtonText: {
    color: COLORS.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
