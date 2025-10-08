import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext } from 'react';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext'; // auth context
import { useTheme } from '../context/ThemeContext'; // theme context
import Animated, { SlideInRight, SlideOutLeft } from 'react-native-reanimated';


const Details = () => {
  const navigation = useNavigation();
  const { user, logout: handleLogout } = useContext(AuthContext);
  const { theme } = useTheme(); // ✅ get theme inside component

  const handleLogoutPress = async () => {
    try {
      await handleLogout();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        }),
      );
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const styles = getStyles(theme); 

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {!user ? (
        <Text style={styles.detail}>User is not logged in</Text>
      ) : (
        <>
          <Text style={styles.detail}>Username: {user.username}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Details;

// ✅ Dynamic styles generator
const getStyles = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 16,
    },
    detail: {
      fontSize: 16,
      marginBottom: 12,
      color: theme.text,
    },
    logoutButton: {
      marginTop: 30,
      backgroundColor: '#FF4D4D',
      paddingVertical: 12,
      paddingHorizontal: 25,
      borderRadius: 12,
    },
    logoutText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  });
