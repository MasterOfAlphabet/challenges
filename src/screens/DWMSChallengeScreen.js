import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Linking } from "react-native";
import { Card, Title, Paragraph, Button, Text, Chip, Divider, useTheme, IconButton } from "react-native-paper";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Helper to format time left
function useCountdown(targetTime) {
  const getTime = () => {
    const now = new Date();
    const diff = Math.max(0, targetTime - now);
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { hours, minutes, seconds, isOver: diff === 0 };
  };
  const [time, setTime] = useState(getTime());
  useEffect(() => {
    if (time.isOver) return;
    const timer = setInterval(() => setTime(getTime()), 1000);
    return () => clearInterval(timer);
  }, [targetTime, time.isOver]);
  return time;
}

// Dummy Data (replace with props/api later)
const challenge = {
  type: "Weekly",
  miniCompetition: "Spelling",
  classGroup: "Class III to V",
  timeLeft: new Date(Date.now() + 23 * 60 * 60 * 1000 + 13 * 60 * 1000 + 7 * 1000), // 23h 13m 7s from now
  prize: "Top 3 get Amazon vouchers and a Certificate!",
  submissions: 128,
  winnersAnnounced: false,
};

export default function DWMSChallengeScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const time = useCountdown(challenge.timeLeft);

  // For better color chips/icons
  const typeColor = {
    Daily: "#4caf50",
    Weekly: "#2196f3",
    Monthly: "#ff9800",
    Special: "#e91e63",
  }[challenge.type] || "#607d8b";

  const groupIcon = {
    "Class I/II": "baby-face-outline",
    "Class III to V": "school-outline",
    "Class VI to X": "account-group-outline",
  }[challenge.classGroup] || "account-outline";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Challenge Card */}
      <Card style={styles.card} elevation={4}>
        <Card.Content>
          <View style={styles.row}>
            <Chip style={[styles.chip, { backgroundColor: typeColor }]} textStyle={styles.chipText}>
              <Ionicons name="trophy" size={16} color="white" /> {challenge.type}
            </Chip>
            <Chip style={styles.chipMini} textStyle={styles.chipMiniText}>
              <MaterialIcons name="category" size={16} color={theme.colors.primary} /> {challenge.miniCompetition}
            </Chip>
            <Chip style={styles.chipMini} textStyle={styles.chipMiniText}>
              <FontAwesome5 name="user-graduate" size={14} color={theme.colors.primary} /> {challenge.classGroup}
            </Chip>
          </View>
          <Divider style={{ marginVertical: 10 }} />
          
          <View style={[styles.row, { alignItems: "center", marginBottom: 10 }]}>
            <Ionicons name="time-outline" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.label}>Time Left:</Text>
            <Text style={styles.time}>
              {`${time.hours.toString().padStart(2, "0")}:${time.minutes
                .toString()
                .padStart(2, "0")}:${time.seconds.toString().padStart(2, "0")}`}
            </Text>
          </View>
          <View style={[styles.row, { alignItems: "center", marginBottom: 10 }]}>
            <Ionicons name="gift-outline" size={20} color="#ff9800" style={{ marginRight: 6 }} />
            <Text style={styles.label}>Prize:</Text>
            <Text style={styles.prize}>{challenge.prize}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons name="people" size={20} color={theme.colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.label}>Submissions:</Text>
            <Text style={styles.value}>{challenge.submissions}</Text>
          </View>
        </Card.Content>
      </Card>
      <Divider style={{ marginVertical: 20 }} />

      {/* Winners */}
      <Card style={styles.winnersCard} elevation={2}>
        <Card.Content style={styles.row}>
          <Ionicons name="medal-outline" size={22} color={theme.colors.primary} style={{ marginRight: 10 }} />
          <Text style={styles.winnersLabel}>
            Winners:
          </Text>
          {challenge.winnersAnnounced ? (
            <Button
              compact
              mode="outlined"
              onPress={() => navigation.navigate("Winners")}
              style={styles.winnersButton}
            >
              View Winners
            </Button>
          ) : (
            <Text style={styles.winnersPending}>Challenge is still in Progress... Not announced</Text>
          )}
        </Card.Content>
      </Card>
      <Divider style={{ marginVertical: 20 }} />

      {/* Answer Challenge Button */}
      <Button
        icon="pencil"
        mode="contained"
        style={styles.answerButton}
        labelStyle={{ fontWeight: "bold", fontSize: 18 }}
        contentStyle={{ paddingVertical: 8 }}
        onPress={() => navigation.navigate("ChallengeQuestion")}
      >
        Answer Challenge
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6fb",
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  winnersCard: {
    borderRadius: 12,
    backgroundColor: "#f8fafd",
  },
  chip: {
    marginRight: 8,
    backgroundColor: "#eee",
    height: 32,
  },
  chipText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  chipMini: {
    marginRight: 8,
    backgroundColor: "#e3eafc",
    height: 32,
  },
  chipMiniText: {
    color: "#1976d2",
    fontWeight: "600",
    fontSize: 13,
  },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  label: {
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 6,
    color: "#222",
  },
  time: {
    fontWeight: "bold",
    color: "#2196f3",
    fontSize: 16,
    marginLeft: 2,
  },
  prize: {
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 2,
  },
  value: {
    color: "#1976d2",
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 2,
  },
  winnersLabel: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
    marginRight: 10,
  },
  winnersPending: {
    color: "#888",
    fontStyle: "italic",
    fontSize: 14,
  },
  winnersButton: {
    marginLeft: 10,
    borderRadius: 18,
    borderColor: "#1976d2",
    paddingHorizontal: 8,
  },
  answerButton: {
    marginTop: 32,
    borderRadius: 24,
    backgroundColor: "#1976d2",
    alignSelf: "center",
    width: "90%",
    elevation: 3,
  },
});