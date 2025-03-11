// AnnounceWinnersScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function AnnounceWinnersScreen({ route, navigation }) {
  const { challengeId, userScore } = route.params;

  // Could fetch the real winner from server, or display "You scored X"
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Challenge #{challengeId} Completed!</Text>
      <Text style={styles.score}>Your Score: {userScore}</Text>

      {/* If there's a global winner: */}
      <Text style={styles.winnerText}>Winner: John Doe (Class VI)</Text>

      <TouchableOpacity
        style={styles.leaderboardButton}
        onPress={() => navigation.navigate("LeaderBoard")}
      >
        <Text style={styles.leaderboardText}>View Leaderboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  score: { fontSize: 18, marginBottom: 10 },
  winnerText: { fontSize: 16, marginBottom: 20, fontStyle: "italic" },
  leaderboardButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 5,
  },
  leaderboardText: { color: "#fff", fontWeight: "bold" },
});
