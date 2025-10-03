import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useContext } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext"; // ✅ import context

const Details = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext); // ✅ get user + logout from context

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout(); 
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "SignIn" }],
              })
            );

          } catch (error) {
            console.log("Error during logout:", error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {!user ? (
        <Text style={styles.detail}>User is not logged in</Text>
      ) : (
        <>
          <Text style={styles.detail}>Username: {user.username}</Text>
          <Text style={styles.detail}>Email: {user.email}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
