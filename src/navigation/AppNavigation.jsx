import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';

// # Icons
import { BookUser, House, TvMinimal } from 'lucide-react-native';
import { Lucide } from '@react-native-vector-icons/lucide';
import { Ionicons } from '@react-native-vector-icons/ionicons';

// # Constants
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

// # Screens
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import SignIn from '../screens/auth/sign-in';
import SignUp from '../screens/auth/sign-up';
import Player from '../screens/Player';
import UploadImage from '../screens/UploadImage';
import Animations from '../screens/Animations';
import Settings from '../screens/Settings';
import SpleshScreen from '../screens/SplashScreen';
import AuthScreen from '../screens/auth/AuthScreen';
import UploadFiles from '../screens/uploadFiles';

// # Navigation Setup
enableScreens();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//# Bottom Tabs
function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.background },
        // style: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerTitleStyle: { fontWeight: 'bold' },
        headerTitleAlign: 'center',

        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: theme.background },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home')
            return <Lucide name="house" size={size} color={color} />;
          if (route.name === 'Profile')
            return <Ionicons name="person" size={size} color={color} />;
          if (route.name === 'Player')
            return <Lucide name="tv" size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: true }}
      />
    </Tab.Navigator>
  );
}

//# Main App Navigation
export default function AppNavigation() {
  const { theme } = useTheme();

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#191919',
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        // initialRouteName={user ? 'MainTabs' : 'SignIn'}
        initialRouteName="SpleshScreen"
        screenOptions={{
          // gestureEnabled: true,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: theme.background },
          style: { backgroundColor: theme.background },

          headerTintColor: theme.text,
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          animation: 'ios_from_right',
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen
          name="AuthScreen"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
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
        <Stack.Screen
          name="SpleshScreen"
          component={SpleshScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="UploadImage" component={UploadImage} />
        <Stack.Screen name="Player" component={Player} />
        <Stack.Screen name="Animations" component={Animations} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile}  />
        <Stack.Screen
          name="UploadFiles"
          component={UploadFiles}
          options={{
            title: 'Upload Files',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
