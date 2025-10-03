import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@react-native-vector-icons/ionicons';

import Home from '../screens/Home';
import Details from '../screens/Details';
import SignIn from '../screens/auth/sign-in';
import SignUp from '../screens/auth/sign-up';
import uploadImageToImgBB from '../screens/UploadImage';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//
// Bottom Tabs with Home + Details
//
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: COLORS.background },
        headerTintColor: COLORS.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        tabBarIcon={({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        )}
      />
      <Tab.Screen
        name="Details"
        component={Details}
        tabBarIcon={({ color, size }) => (
          <Ionicons name="list-outline" size={14} color={COLORS.primary} />
        )}
      />
    </Tab.Navigator>
  );
}

//
// Main App Navigation
//
export default function AppNavigation() {
  const { loading, user } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? 'MainTabs' : 'SignIn'}
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: COLORS.background },
          headerTintColor: COLORS.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />

        {/* Tabs after login */}
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        {/* Other Screens */}
        <Stack.Screen name="UploadImage" component={uploadImageToImgBB} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
