import React, { useContext, useState } from 'react';
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
import { AlertCircle, X } from 'lucide-react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTheme } from '../../context/ThemeContext';

// ✅ Validation Schema
const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ React Hook Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Login API
  const loginToAccount = async ({ username, password }) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.freeapi.app/api/v1/users/login', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success && data?.data?.accessToken) {
        return data;
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // ✅ Handle form submission
  const onSubmit = async (formData) => {
    setError('');
    try {
      const result = await loginToAccount(formData);
      await login(
        result.data.user,
        result.data.accessToken,
        result.data.refreshToken
      );

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
            <AlertCircle size={20} color={theme.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <X size={20} color={theme.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* ✅ Username Field */}
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                (errors.username || error) && styles.errorInput,
              ]}
              autoCapitalize="none"
              value={value}
              placeholder="Username"
              placeholderTextColor={theme.textLight}
              onChangeText={onChange}
            />
          )}
        />
        {errors.username && (
          <Text style={styles.fieldError}>{errors.username.message}</Text>
        )}

        {/* ✅ Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={[
                styles.input,
                (errors.password || error) && styles.errorInput,
              ]}
              value={value}
              placeholder="Password"
              placeholderTextColor={theme.textLight}
              secureTextEntry
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.fieldError}>{errors.password.message}</Text>
        )}

        {/* ✅ Submit Button */}
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.white} />
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

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: 20,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.text,
      marginVertical: 15,
      textAlign: 'center',
    },
    input: {
      backgroundColor: theme.white,
      borderRadius: 12,
      padding: 15,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
      fontSize: 16,
      color: theme.text,
    },
    errorInput: {
      borderColor: theme.expense,
    },
    fieldError: {
      color: theme.expense,
      fontSize: 13,
      marginBottom: 8,
      marginLeft: 4,
    },
    button: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    buttonText: {
      color: theme.white,
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
      color: theme.text,
      fontSize: 16,
    },
    linkText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    errorBox: {
      backgroundColor: '#FFE5E5',
      padding: 12,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.expense,
      marginBottom: 16,
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    errorText: {
      color: theme.white,
      marginLeft: 8,
      flex: 1,
      fontSize: 14,
    },
  });
