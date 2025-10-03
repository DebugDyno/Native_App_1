import * as React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Home from '../screens/Home';
import Details from '../screens/Details';
import SignIn from '../screens/auth/sign-in';
import SignUp from '../screens/auth/sign-up';
import uploadImageToImgBB from '../screens/UploadImage';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  // Check login status from AsyncStorage
  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('accessToken');
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error checking login:', error);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerStyle: { backgroundColor: COLORS.background },
            headerTintColor: COLORS.text,
            headerTitleStyle: { fontWeight: 'bold' },
            headerTitleAlign: 'center',
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Details" component={Details} />
          <Stack.Screen name="UploadImage" component={uploadImageToImgBB} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn">
            {props => <SignIn {...props} onLogin={setUser} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp" component={SignUp} />
          {props => <SignUp {...props} onLogin={setUser} />}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
