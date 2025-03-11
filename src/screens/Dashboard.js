// Dashboard.js
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../App";

export default function Dashboard({ navigation }) {
  const { loggedInUser } = useContext(AuthContext);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    console.log("LoggedInUser in Dashboard:", loggedInUser); // Debugging: Log the loggedInUser object

    // If user is a teacher, we redirect to TeacherDashboard once after the first render
    if (loggedInUser?.role === "Teacher" && !redirected) {
      setRedirected(true);
      navigation.navigate("TeacherDashboard");
      return; // Exit early to avoid further navigation
    }

    // Handle other roles
    if (loggedInUser) {
      const { role } = loggedInUser;
      console.log("User Role:", role); // Debugging: Log the role

      switch (role) {
        case "Admin":
          navigation.navigate("AdminDashboard");
          break;
        case "Student":
          navigation.navigate("StudentDashboard");
          break;
        case "Principal":
          navigation.navigate("SchoolDashboard");
          break;
        default:
          console.log("Unknown role:", role); // Debugging: Log unknown roles
          break;
      }
    }
  }, [loggedInUser, redirected, navigation]);

  // If not logged in at all
  if (!loggedInUser) {
    return <Text style={{ margin: 20 }}>You must login to see your dashboard.</Text>;
  }

  // Welcome screen for users before they are redirected
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome, {loggedInUser.role}!</Text>
      <Text style={styles.messageText}>
        Please click the button below to access your dashboard.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const { role } = loggedInUser;
          switch (role) {
            case "Admin":
              navigation.navigate("AdminDashboard");
              break;
            case "Student":
              navigation.navigate("StudentDashboard");
              break;
            case "Principal":
              navigation.navigate("SchoolDashboard");
              break;
            case "Teacher":
              navigation.navigate("TeacherDashboard");
              break;
            default:
              console.log("Unknown role:", role);
              break;
          }
        }}
      >
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#555",
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});