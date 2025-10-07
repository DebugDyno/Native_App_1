import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Details from '../screens/Details';
import SignIn from '../screens/auth/sign-in';
import SignUp from '../screens/auth/sign-up';
import Player from '../screens/Player';
import uploadImageToImgBB from '../screens/UploadImage';
import { COLORS } from '../constants/colors';
import { AuthContext } from '../context/AuthContext';
import { BookUser, House, TvMinimal } from 'lucide-react-native';

import { Lucide } from '@react-native-vector-icons/lucide';
import { AntDesign } from '@react-native-vector-icons/ant-design';
import { Ionicons } from '@react-native-vector-icons/ionicons';

// import {Father} from

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
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            // return <House size={size} color={color} />;
            return <Lucide name="house" size={size} color={color} />;
            // return <AntDesign name="arrow-right" size={size} color={color} />
            // return <Ionicons name="home" size={size} color={color} />
          } else if (route.name === 'Profile') {
            // return <BookUser size={size} color={color} />;
            // return <Lucide name="person" size={size} color={color} />
            return <Ionicons name="person" size={size} color={color} />;
          } else if (route.name === 'Player') {
            // return <TvMinimal  size={size} color={color} />;
            return <Lucide name="tv" size={size} color={color} />;
            // return <Ionicons name="tv" size={size} color={color} />
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Player"
        component={Player}
        options={{ headerShown: true }}
      />
      <Tab.Screen
        name="Profile"
        component={Details}
        options={{ headerShown: true }}
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
