// DailyChallenges.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

export default function DailyChallenges({ navigation, route }) {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Load daily challenges from your DB or local mock
    // e.g. setChallenges(dailyChallengesFromServer)
    const mockDaily = [
      {
        id: "daily1",
        name: "Daily Spelling Challenge",
        modules: ["Spelling", "Grammar"], // example
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600 * 1000), // 1hr from now
        questionCount: 3,
      },
      // etc.
    ];
    setChallenges(mockDaily);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.challengeCard}
      onPress={() => {
        // Navigate to a screen that shows the challenge details
        navigation.navigate("ChallengeSubmissionScreen", {
          challengeData: item,
          challengeType: "daily",
        });
      }}
    >
      <Text style={styles.challengeName}>{item.name}</Text>
      <Text>Modules: {item.modules.join(", ")}</Text>
      <Text>Questions: {item.questionCount}</Text>
      <Text>Ends: {item.endTime.toLocaleTimeString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Challenges</Text>
      <FlatList
        data={challenges}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  challengeCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  challengeName: { fontSize: 18, fontWeight: "bold" },
});
