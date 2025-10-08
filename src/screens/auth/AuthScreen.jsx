import React, { useEffect, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AuthScreen = () => {
  const { loading, user } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    if (loading) return;
    let isNavigated = false;

    if (!isNavigated) {
      if (user) navigation.replace('MainTabs');
      else navigation.replace('SignIn');
      isNavigated = true;
    }
  }, [loading, user, navigation]);

  // Show loader while checking
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        {/* <Text style={{ color: theme.text, marginTop: 12 }}>Checking user...</Text> */}
      </View>
    );
  }

  // Temporary fallback UI (usually never shown)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Redirecting...</Text>
    </View>
  );
};

export default AuthScreen;
