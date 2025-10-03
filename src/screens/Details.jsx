import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation,CommonActions } from "@react-navigation/native";


const Details = ({  }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        const user = await AsyncStorage.getItem("user");

        setToken(token);
        setUser(user ? JSON.parse(user) : null);
      } catch (error) {
        console.log("Error fetching from AsyncStorage:", error);
      }
    };

    getToken();
  }, []);

const logout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        try {
          await AsyncStorage.removeItem("user");
          await AsyncStorage.removeItem("accessToken");
          await AsyncStorage.removeItem("refreshToken");

          // Reset navigation stack and navigate to Login
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          );
        } catch (error) {
          console.log("Error clearing AsyncStorage:", error);
        }
      },
    },
  ]);
};
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {!user || !token ? (
        <Text style={styles.detail}>User is not logged in</Text>
      ) : (
        <>
          <Text style={styles.detail}>Username: {user.username}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>
          <Text style={styles.detail} numberOfLines={1}>
            Token: {token}
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  detail: {
    fontSize: 16,
    marginBottom: 12,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#FF4D4D",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
