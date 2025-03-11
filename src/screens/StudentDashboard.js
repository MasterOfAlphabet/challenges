import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Button, Text, ProgressBar, useTheme } from "react-native-paper";

const StudentDashboard = ({ navigation }) => {
  const { colors } = useTheme();

  // Mock data for challenges
  const currentChallenge = {
    id: 1,
    title: "Daily Challenge: Module 3",
    dueDate: "2023-11-15",
    progress: 0.4, // 40% progress
  };

  const upcomingChallenges = [
    { id: 2, title: "Weekly Challenge: Module 4", dueDate: "2023-11-20", type: "Weekly" },
    { id: 3, title: "Monthly Challenge: Module 5", dueDate: "2023-11-30", type: "Monthly" },
  ];

  const completedChallenges = [
    { id: 4, title: "Daily Challenge: Module 2", score: "85/100", feedback: "Great job!" },
    { id: 5, title: "Weekly Challenge: Module 1", score: "90/100", feedback: "Well done!" },
  ];

  const leaderboardData = {
    rank: 5,
    totalParticipants: 100,
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome to Master of Alphabet!</Text>

      {/* Current Challenge */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Current Challenge</Text>
          <Text style={styles.challengeTitle}>{currentChallenge.title}</Text>
          <Text style={styles.challengeDetails}>Due: {currentChallenge.dueDate}</Text>
          <ProgressBar
            progress={currentChallenge.progress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {Math.round(currentChallenge.progress * 100)}% Completed
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("ChallengeDetails", { challenge: currentChallenge })}
            style={styles.actionButton}
          >
            Continue Challenge
          </Button>
        </Card.Content>
      </Card>

      {/* Upcoming Challenges */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Upcoming Challenges</Text>
          {upcomingChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeItem}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDetails}>
                Due: {challenge.dueDate} | Type: {challenge.type}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Completed Challenges */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Completed Challenges</Text>
          {completedChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeItem}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDetails}>
                Score: {challenge.score} | Feedback: {challenge.feedback}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Leaderboard */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Leaderboard</Text>
          <Text style={styles.leaderboardText}>
            Your Rank: {leaderboardData.rank} / {leaderboardData.totalParticipants}
          </Text>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Leaderboard")}
            style={styles.actionButton}
          >
            View Full Leaderboard
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("SubmitChallenge")}
          style={styles.quickActionButton}
        >
          Submit Challenge
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("ViewGrades")}
          style={styles.quickActionButton}
        >
          View Grades
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  challengeItem: {
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  challengeDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
  },
  leaderboardText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  actionButton: {
    marginTop: 8,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default StudentDashboard;