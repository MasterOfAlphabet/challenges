import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Share,
} from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Mock data for challenges
const challengesData = {
  daily: {
    present: [
      { id: 1, module: "Spelling Super Star", timeLeft: "2h 15m", submissions: 1234 },
      { id: 2, module: "Grammar Guru", timeLeft: "5h 30m", submissions: 567 },
    ],
    upcoming: [
      { id: 3, module: "Vocabulary Virtuoso", timeLeft: "3h 45m", submissions: 0 },
    ],
    past: [
      { id: 4, module: "Reading Rockstar", timeLeft: "Ended 2 days ago", submissions: 456 },
    ],
  },
  weekly: {
    present: [
      { id: 5, module: "Writing Wizard", timeLeft: "3d 2h", submissions: 789 },
    ],
    upcoming: [
      { id: 6, module: "Punctuation Pro", timeLeft: "1d 0h", submissions: 0 },
    ],
    past: [],
  },
  monthly: {
    present: [
      { id: 7, module: "Comprehension Champion", timeLeft: "10d 0h", submissions: 456 },
    ],
    upcoming: [],
    past: [
      { id: 8, module: "Phonics Phenom", timeLeft: "Ended 1 month ago", submissions: 123 },
    ],
  },
  special: {
    present: [],
    upcoming: [
      { id: 9, module: "Summer Challenge", timeLeft: "3h 45m", submissions: 0 },
    ],
    past: [
      { id: 10, module: "Holiday Special", timeLeft: "Ended 2 weeks ago", submissions: 234 },
    ],
  },
};

// Colors for each category
const categoryColors = {
  daily:   { primary: "#007bff", secondary: "#e6f2ff" },
  weekly:  { primary: "#28a745", secondary: "#e6f9f0" },
  monthly: { primary: "#dc3545", secondary: "#f8e8e8" },
  special: { primary: "#ffc107", secondary: "#fff3cd" },
};

// Wave hero style constants
const HERO_HEIGHT = 180;

/** 
 * Attempts to parse a string like "2h 15m", "3d 2h", "5h 30m"
 * into total seconds for a countdown. You can adjust as needed.
 */
function parseTimeLeftString(timeLeftStr) {
  // Examples: "2h 15m", "3h 45m", "3d 2h"
  // We'll handle days/hours/minutes in a simplistic manner
  let totalSeconds = 0;

  // Basic approach:
  //  - find "Xd" => add X * 86400
  //  - find "Xh" => add X * 3600
  //  - find "Xm" => add X * 60
  // If string has "Ended" or "Starts" => return 0 or handle differently
  if (!timeLeftStr || typeof timeLeftStr !== "string") return 0;
  if (timeLeftStr.toLowerCase().includes("ended")) return 0; // no countdown
  if (timeLeftStr.toLowerCase().includes("start")) {
    // if we have "3h 45m" after "Starts in " => parse anyway
    const trimmed = timeLeftStr.replace("Starts in", "").trim();
    return parseTimeLeftString(trimmed);
  }

  const dayMatch = timeLeftStr.match(/(\d+)d/);
  if (dayMatch) {
    totalSeconds += parseInt(dayMatch[1], 10) * 86400;
  }

  const hourMatch = timeLeftStr.match(/(\d+)h/);
  if (hourMatch) {
    totalSeconds += parseInt(hourMatch[1], 10) * 3600;
  }

  const minMatch = timeLeftStr.match(/(\d+)m/);
  if (minMatch) {
    totalSeconds += parseInt(minMatch[1], 10) * 60;
  }

  return totalSeconds;
}

/** 
 * Renders a countdown timer for a given initialSeconds.
 * 
 * If the timer hits 0, it displays "Time's up!"
 */
function ChallengeTimer({ initialTimeString }) {
  const navigation = useNavigation();
  const [secondsLeft, setSecondsLeft] = useState(() => parseTimeLeftString(initialTimeString));

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const intervalId = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(intervalId);
  }, [secondsLeft]);

  if (secondsLeft <= 0) {
    return <Text style={styles.timerText}>Time’s up!</Text>;
  }

  // Convert secondsLeft => d/h/m/s
  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  let display = "";
  if (days > 0) display += `${days}d `;
  if (hours >= 0) display += `${hours}h `;
  if (mins >= 0) display += `${mins}m `;
  display += `${secs}s`;

  return <Text style={styles.timerText}>Time Left: {display}</Text>;
}

export default function ChallengesScreen() {
  const navigation = useNavigation();

  const [expandedCategory, setExpandedCategory] = useState("daily");
  const [expandedSection, setExpandedSection] = useState(null);

  // Animations for wave hero
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in hero
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Wave animation
    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate wave movement
  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 15, 0],
  });

  // Category click
  const handleCategoryClick = (category) => {
    setExpandedCategory(category);
    setExpandedSection(null);
  };

  // Section click (Present/Upcoming/Past)
  const handleSectionClick = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Share
  const handleShareChallenge = (module) => {
    Share.share({
      message: `Check out this challenge: ${module}`,
    });
  };

  // Renders each challenge card with the color style from Home's daily challenges
  const renderChallengeCard = (challenge, catKey, section) => {
    const colorSet = categoryColors[catKey];

    return (
      <View
        key={challenge.id}
        style={[
          styles.challengeCard,
          { backgroundColor: colorSet.primary },
        ]}
      >
        <View style={styles.challengeHeader}>
          <Text style={styles.moduleName}>{challenge.module}</Text>
          <TouchableOpacity onPress={() => handleShareChallenge(challenge.module)}>
            <Feather name="share-2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* If we can parse timeLeft => show a countdown timer for Present & Upcoming */}
        {(section === "present" || section === "upcoming") && (
          <ChallengeTimer initialTimeString={challenge.timeLeft} />
        )}

        {/* For Past => show ended time, winner, etc. */}
        {section === "past" && (
          <>
            <Text style={styles.timeLeft}>{challenge.timeLeft}</Text>
            {/* Show Winner Info */}
            <Text style={styles.pastWinner}>
              Winner: John Doe, XYZ School
            </Text>
            {/* Link to Leaderboard */}
            <TouchableOpacity
              style={styles.leaderboardLink}
              onPress={() => navigation.navigate("LeaderBoard")}
            >
              <Ionicons name="trophy-outline" size={18} color="#fff" />
              <Text style={styles.leaderboardLinkText}>View Leaderboard</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Show submissions if available */}
        {typeof challenge.submissions === "number" && section !== "past" && (
          <Text style={styles.submissions}>
            {challenge.submissions} submissions
          </Text>
        )}

        {/* Actions for present/upcoming/past */}
        <View style={styles.challengeActions}>
          {section === "present" && (
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join Challenge</Text>
            </TouchableOpacity>
          )}
          {section === "upcoming" && (
            <TouchableOpacity style={styles.reminderButton}>
              <MaterialIcons name="notifications" size={20} color="#fff" />
              <Text style={styles.reminderButtonText}>Set Reminder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Ionicon for each expandedSection
  const iconForSection = (section) =>
    expandedSection === section ? "chevron-up" : "chevron-down";

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.container}>
        {/* Wave Hero */}
        <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [{ translateY: waveTranslate }],
              },
            ]}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Challenges</Text>
            <Text style={styles.heroSubtitle}>Daily, Weekly, Monthly & Special</Text>
          </View>
        </Animated.View>

        {/* Category Row */}
        <View style={styles.categoryRow}>
          {Object.entries(categoryColors).map(([catKey, catColors]) => (
            <TouchableOpacity
              key={catKey}
              style={[styles.categoryCard, { backgroundColor: catColors.secondary }]}
              onPress={() => handleCategoryClick(catKey)}
            >
              {catKey === "daily" && (
                <MaterialIcons name="today" size={24} color={catColors.primary} />
              )}
              {catKey === "weekly" && (
                <MaterialIcons name="date-range" size={24} color={catColors.primary} />
              )}
              {catKey === "monthly" && (
                <MaterialIcons name="calendar-today" size={24} color={catColors.primary} />
              )}
              {catKey === "special" && (
                <Feather name="gift" size={24} color={catColors.primary} />
              )}
              <Text style={[styles.categoryText, { color: catColors.primary }]}>
                {catKey.charAt(0).toUpperCase() + catKey.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Accordion for each category */}
        {Object.entries(challengesData).map(([catKey, catData]) => {
          if (catKey !== expandedCategory) return null; // show only expandedCategory

          return (
            <View key={catKey} style={{ marginBottom: 20 }}>
              {/* Present */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => handleSectionClick("present")}
              >
                <Text style={[styles.sectionTitle, { color: categoryColors[catKey].primary }]}>
                  Present Challenges
                </Text>
                <Ionicons
                  name={iconForSection("present")}
                  size={24}
                  color={categoryColors[catKey].primary}
                />
              </TouchableOpacity>
              {expandedSection === "present" &&
                catData.present.map((challenge) =>
                  renderChallengeCard(challenge, catKey, "present")
                )}

              {/* Upcoming */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => handleSectionClick("upcoming")}
              >
                <Text style={[styles.sectionTitle, { color: categoryColors[catKey].primary }]}>
                  Upcoming Challenges
                </Text>
                <Ionicons
                  name={iconForSection("upcoming")}
                  size={24}
                  color={categoryColors[catKey].primary}
                />
              </TouchableOpacity>
              {expandedSection === "upcoming" &&
                catData.upcoming.map((challenge) =>
                  renderChallengeCard(challenge, catKey, "upcoming")
                )}

              {/* Past */}
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => handleSectionClick("past")}
              >
                <Text style={[styles.sectionTitle, { color: categoryColors[catKey].primary }]}>
                  Past Challenges
                </Text>
                <Ionicons
                  name={iconForSection("past")}
                  size={24}
                  color={categoryColors[catKey].primary}
                />
              </TouchableOpacity>
              {expandedSection === "past" &&
                catData.past.map((challenge) =>
                  renderChallengeCard(challenge, catKey, "past")
                )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
  },
  // Wave hero
  heroContainer: {
    width: "100%",
    height: HERO_HEIGHT,
    backgroundColor: "#6200ea",
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
  },
  wave: {
    position: "absolute",
    width: "200%",
    height: HERO_HEIGHT * 2,
    backgroundColor: "#7f39fb",
    borderRadius: 300,
    top: -HERO_HEIGHT / 1.2,
    left: 0,
  },
  heroContent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: HERO_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
  },

  // Category row
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: "23%",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },

  // Section header row
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // Challenge Cards
  challengeCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 15,
    elevation: 3,
  },
  challengeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  timeLeft: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  submissions: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
  },
  challengeActions: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  // Past Winner
  pastWinner: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
  },
  leaderboardLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  leaderboardLinkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },

  // "Join Challenge" style
  joinButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  // "Set Reminder" style
  reminderButton: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  reminderButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 5,
  },

  // Timer text
  timerText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 10,
    fontWeight: "bold",
  },
});
