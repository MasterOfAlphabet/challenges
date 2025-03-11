import React, { useState, useContext } from "react";
import { View, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase"; // adjust path
import { AuthContext } from "../../App";

export default function LoginScreen({ navigation }) {
  const { setLoggedInUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    try {
      // 1) Firebase Auth sign in
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCred.user;

      // 2) Load doc from Firestore => get role
      const docRef = doc(db, "users", uid);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        Alert.alert("Error", "No Firestore user doc found!");
        return;
      }
      const userData = snap.data();
      const userRole = userData.role; // e.g. "Teacher", "Student", etc.

      // 3) Store in context
      setLoggedInUser({
        uid,
        email: userCred.user.email,
        role: userRole,
      });

      // 4) Navigate away (maybe Home or Dashboard)
      navigation.navigate("Home");

    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Login Failed", err.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>Login</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={{ marginBottom: 15 }}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={{ marginBottom: 15 }}
      />

      <Button mode="contained" onPress={handleLogin}>
        Log In
      </Button>
    </View>
  );
}
