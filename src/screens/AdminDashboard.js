import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Card, Button, Text, ProgressBar, useTheme } from "react-native-paper";

const AdminDashboard = ({ navigation }) => {
  const { colors } = useTheme();

  // Mock data for metrics
  const metrics = {
    totalParticipants: 150,
    activeChallenges: 5,
    totalSubmissions: 1200,
    averageScore: "85/100",
  };

  // Mock data for challenges
  const challenges = [
    { id: 1, title: "Daily Challenge: Module 3", submissions: 120, progress: 0.8 },
    { id: 2, title: "Weekly Challenge: Module 4", submissions: 90, progress: 0.6 },
    { id: 3, title: "Monthly Challenge: Module 5", submissions: 50, progress: 0.4 },
  ];

  // Mock data for participants
  const participants = [
    { id: 1, name: "John Doe", progress: 0.9, score: "90/100" },
    { id: 2, name: "Jane Smith", progress: 0.8, score: "85/100" },
    { id: 3, name: "Alice Johnson", progress: 0.7, score: "80/100" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Admin Dashboard</Text>

      {/* Overview Metrics */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Overview Metrics</Text>
          <View style={styles.metricContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.totalParticipants}</Text>
              <Text style={styles.metricLabel}>Participants</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.activeChallenges}</Text>
              <Text style={styles.metricLabel}>Active Challenges</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.totalSubmissions}</Text>
              <Text style={styles.metricLabel}>Submissions</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{metrics.averageScore}</Text>
              <Text style={styles.metricLabel}>Avg. Score</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Challenge Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Challenges</Text>
          {challenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeItem}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDetails}>
                Submissions: {challenge.submissions} | Progress: {Math.round(challenge.progress * 100)}%
              </Text>
              <ProgressBar
                progress={challenge.progress}
                color={colors.primary}
                style={styles.progressBar}
              />
              <Button
                mode="outlined"
                onPress={() => navigation.navigate("ChallengeDetails", { challenge })}
                style={styles.actionButton}
              >
                Manage Challenge
              </Button>
            </View>
          ))}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("CreateChallenge")}
            style={styles.actionButton}
          >
            Create New Challenge
          </Button>
        </Card.Content>
      </Card>

      {/* Participant Management */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Participants</Text>
          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <Text style={styles.participantName}>{participant.name}</Text>
              <Text style={styles.participantDetails}>
                Progress: {Math.round(participant.progress * 100)}% | Score: {participant.score}
              </Text>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate("ParticipantDetails", { participant })}
                style={styles.actionButton}
              >
                View Details
              </Button>
            </View>
          ))}
          <Button
            mode="contained"
            onPress={() => navigation.navigate("ManageParticipants")}
            style={styles.actionButton}
          >
            Manage Participants
          </Button>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("SendAnnouncement")}
          style={styles.quickActionButton}
        >
          Send Announcement
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate("ViewReports")}
          style={styles.quickActionButton}
        >
          View Reports
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
  metricContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  metricItem: {
    width: "48%",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
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
  participantItem: {
    marginBottom: 12,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  participantDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
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

export default AdminDashboard;