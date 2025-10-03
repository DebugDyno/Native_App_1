import React from "react";
import { StatusBar, StyleSheet, View, ActivityIndicator, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigation from "./src/navigation/AppNavigation";
import { AuthProvider, AuthContext } from "./src/context/AuthContext"; // Make sure you create this file
import { COLORS } from "./src/constants/colors";

export default function App() {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <AuthProvider>
        <RootNavigatorWrapper />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// Wrapper to decide which stack to show based on auth
function RootNavigatorWrapper() {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) {
    // Show loading while checking AsyncStorage
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return <AppNavigation />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
