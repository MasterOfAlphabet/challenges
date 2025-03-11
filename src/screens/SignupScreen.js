import React, { useState, useContext } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { AuthContext } from "../../App";

export default function SignupScreen({ navigation }) {
  const { setLoggedInUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("S"); // default to Student

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email and password are required");
      return;
    }
    try {
      // 1) Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCred.user;

      // 2) Create doc in Firestore: /users/{uid}
      await setDoc(doc(db, "users", uid), {
        email,
        role, // "S", "T", "P", "Admin"
      });

      // 3) Store in your local context
      setLoggedInUser({ uid, email, role });

      Alert.alert("Success", `Account created for ${email}!`);
      navigation.navigate("Home"); // or "Dashboard"
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Signup failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        mode="outlined"
        style={styles.input}
      />

      <Text style={styles.label}>Select User Type:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={role}
          onValueChange={(val) => setRole(val)}
          style={styles.picker}
        >
          <Picker.Item label="Student" value="Student" />
          <Picker.Item label="Teacher" value="Teacher" />
          <Picker.Item label="Principal" value="Principal" />
          <Picker.Item label="Admin" value="Admin" />
        </Picker>
      </View>

      <Button mode="contained" onPress={handleSignup} style={styles.button}>
        Create Account
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  button: {
    marginTop: 10,
  },
});
