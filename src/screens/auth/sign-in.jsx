import React, { useState, useContext } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { AlertCircle, X } from 'lucide-react-native'; // ✅ lucide-react-native icons
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const loginToAccount = async ({ username, password }) => {
    setLoading(true);
    try {
      const url = 'https://api.freeapi.app/api/v1/users/login';
      const bodyData = JSON.stringify({ username, password });

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: bodyData,
      };

      const response = await fetch(url, options);
      const data = await response.json();
      setLoading(false);

      console.log('API Response:', data);

      if (data.success && data?.data?.accessToken) {
        return data;
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const onSignInPress = async () => {
    setError('');

    if (!username || !password) {
      setError('Please enter username and password.');
      return;
    }

    try {
      const result = await loginToAccount({ username, password });

      await login(
        result.data.user,
        result.data.accessToken,
        result.data.refreshToken
      );

      console.log('User logged in successfully via context');

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      );
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <AlertCircle size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <X size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={username}
          placeholder="Username"
          placeholderTextColor="#9A8478"
          onChangeText={setUsername}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Password"
          placeholderTextColor="#9A8478"
          secureTextEntry
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onSignInPress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.linkText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginVertical: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 16,
    color: COLORS.text,
  },
  errorInput: {
    borderColor: COLORS.expense,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: COLORS.text,
    fontSize: 16,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.expense,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});
