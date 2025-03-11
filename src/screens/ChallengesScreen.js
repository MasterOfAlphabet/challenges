import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

// This is a simple mapping for color styles
const challengeTypeColors = {
  Daily: { background: "#007bff", text: "#fff" },
  Weekly: { background: "#28a745", text: "#fff" },
  Monthly: { background: "#dc3545", text: "#fff" },
  Special: { background: "#ffc107", text: "#333" },
};

// Helper to pick color style based on challenge.type
function getColorStyle(type) {
  return challengeTypeColors[type] || { background: "#999", text: "#fff" };
}

export default function ChallengesScreen({ navigation, route }) {
  // Keep a local list of challenges
  const [challenges, setChallenges] = useState([]);

  // Get the user role from route.params
  const userRole = route.params?.userRole || "Student"; // Default to "Student" for testing

  console.log("User Role in ChallengesScreen:", userRole); // Log the user role

  useEffect(() => {
    // If we came from ChallengeCreationScreen with a newChallenge, store it
    if (route.params?.newChallenge) {
      const newOne = route.params.newChallenge;
      setChallenges((prev) => [...prev, newOne]);
    }
  }, [route.params?.newChallenge]);

  const renderItem = ({ item }) => {
    const colorStyle = getColorStyle(item.type);

    return (
      <TouchableOpacity
        style={[
          styles.challengeCard,
          { backgroundColor: colorStyle.background },
        ]}
        onPress={() => {
          // Navigate with the entire item and user role
          navigation.navigate("ChallengeSubmission", {
            challenge: item,
            userRole, // Pass the user's role to the submission screen
          });
        }}
      >
        <Text
          style={[
            styles.challengeName,
            { color: colorStyle.text },
          ]}
        >
          {item.name}
        </Text>

        <Text
          style={[
            styles.challengeType,
            { color: colorStyle.text },
          ]}
        >
          Type: {item.type}
        </Text>

        <Text style={{ color: colorStyle.text }}>
          Start: {new Date(item.startDate).toLocaleDateString()} |{" "}
          End: {new Date(item.endDate).toLocaleDateString()}
        </Text>

        <Text style={[styles.questionCount, { color: colorStyle.text }]}>
          Questions: {item.questions?.length ?? 0}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Challenges</Text>

      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  challengeCard: {
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  challengeName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  challengeType: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  questionCount: {
    marginTop: 4,
  },
});