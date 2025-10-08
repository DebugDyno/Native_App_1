import React from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  ActivityIndicator,
  useColorScheme,
  Appearance,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/navigation/AppNavigation';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <AuthProvider>
            <StatusBarWrapper />
          </AuthProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

// Separate component so hooks can access ThemeContext
function StatusBarWrapper() {
  const { theme, mode } = useTheme();
  const systemScheme = Appearance.getColorScheme();

  // Determine actual theme being applied
  const currentScheme = mode === 'system' ? systemScheme : mode;

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={currentScheme === 'light' ? 'dark-content' : 'light-content'}
      />
      <RootNavigatorWrapper />
    </>
  );
}

// Wrapper to decide which stack to show based on auth
function RootNavigatorWrapper() {
  // const { user, loading } = React.useContext(AuthContext);
  const { theme } = useTheme(); // ✅ inside ThemeProvider

  // if (loading) {
  //   return (
  //     <View
  //       style={[styles.loadingContainer, { backgroundColor: theme.background }]}
  //     >
  //       <ActivityIndicator size="large" color={theme.primary} />
  //     </View>
  //   );
  // }

  return <AppNavigation />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
