import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLORS } from "../../constants/colors";

export default function SignUpScreen({ onLogin }) {
  const [emailAddress, setEmailAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Email and password validation
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const createAccount = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const url = "https://api.freeapi.app/api/v1/users/register";
      const bodyData = JSON.stringify({ email, password, role: "USER", username });
      const options = {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: bodyData,
      };

      const response = await fetch(url, options);
      const data = await response.json();
      setLoading(false);

      if (response.ok && data?.success) {
        return data;
      } else {
        throw new Error(data.message || "Failed to create account");
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const onSignUpPress = async () => {
    setError("");

    if (!validateEmail(emailAddress)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await createAccount({ username, email: emailAddress, password });

      // Save user info and tokens to AsyncStorage
      if (response?.data) {
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
        await AsyncStorage.setItem("refreshToken", response.data.refreshToken);

        // Update root state to switch stack
        if (onLogin) onLogin(response.data.user);
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={60}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Text style={{ color: COLORS.textLight, marginLeft: 8 }}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={setEmailAddress}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={username}
          placeholder="Username"
          placeholderTextColor="#9A8478"
          onChangeText={setUsername}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password (min. 8 characters)"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={onSignUpPress}
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color={COLORS.white} /> : <Text style={styles.buttonText}>Create Account</Text>}
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: COLORS.text, marginVertical: 15, textAlign: "center" },
  input: { backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, fontSize: 16, color: COLORS.text },
  errorInput: { borderColor: COLORS.expense },
  button: { backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: "center", marginTop: 10, marginBottom: 20 },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: "600" },
  footerContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  footerText: { color: COLORS.text, fontSize: 16 },
  linkText: { color: COLORS.primary, fontSize: 16, fontWeight: "600" },
  errorBox: { backgroundColor: "#FFE5E5", padding: 12, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.expense, marginBottom: 16, flexDirection: "row", alignItems: "center", width: "100%" },
  errorText: { color: COLORS.text, marginLeft: 8, flex: 1, fontSize: 14 },
});
