import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const leaderboardData = {
  "All-Time": {
    "Mega Leaderboard": [
      { rank: 1, name: "Alice Johnson", class: "IX", score: 1200, pic: "https://randomuser.me/api/portraits/women/1.jpg" },
      { rank: 2, name: "Bob Smith", class: "X", score: 960, pic: "https://randomuser.me/api/portraits/men/2.jpg" },
      { rank: 3, name: "Charlie Lee", class: "VIII", score: 940, pic: "https://randomuser.me/api/portraits/men/3.jpg" }
    ],
    "Spelling": [
      { rank: 1, name: "David Green", class: "VII", score: 900, pic: "https://randomuser.me/api/portraits/men/4.jpg" },
      { rank: 2, name: "Emma Wilson", class: "VI", score: 870, pic: "https://randomuser.me/api/portraits/women/5.jpg" }
    ],
    "Reading": [
      { rank: 1, name: "Frank White", class: "V", score: 890, pic: "https://randomuser.me/api/portraits/men/6.jpg" }
    ]
  },
  "Weekly": {
    "Mega Leaderboard": [
      { rank: 1, name: "Alice Johnson", class: "IX", score: 980, pic: "https://randomuser.me/api/portraits/women/1.jpg" },
      { rank: 2, name: "Bob Smith", class: "X", score: 960, pic: "https://randomuser.me/api/portraits/men/2.jpg" }
    ],
    "Spelling": [
      { rank: 1, name: "David Green", class: "VII", score: 900, pic: "https://randomuser.me/api/portraits/men/4.jpg" }
    ]
  },
  "Monthly": {
    "Mega Leaderboard": [
      { rank: 1, name: "Alice Johnson", class: "IX", score: 980, pic: "https://randomuser.me/api/portraits/women/1.jpg" }
    ],
    "Spelling": [
      { rank: 1, name: "David Green", class: "VII", score: 900, pic: "https://randomuser.me/api/portraits/men/4.jpg" }
    ]
  }
};

const userData = {
  rank: 5,
  name: "You",
  class: "X",
  score: 850,
  pic: "https://randomuser.me/api/portraits/women/10.jpg", // Replace with the user's profile picture
};

const LeaderboardScreen = () => {
  const [activeSections, setActiveSections] = useState([]);
  const [timeframe, setTimeframe] = useState("All-Time");
  const [sortBy, setSortBy] = useState("Rank");
  const [leaderboardType, setLeaderboardType] = useState("Global");
  const [searchQuery, setSearchQuery] = useState("");

  const renderHeader = (category, isActive) => (
    <TouchableOpacity style={styles.header} onPress={() => toggleSection(category)}>
      <Text style={styles.headerText}>{category}</Text>
      <Ionicons name={isActive ? "chevron-up" : "chevron-down"} size={24} color="black" />
    </TouchableOpacity>
  );

  const getBadge = (score) => {
    if (score >= 1000) return "🏆"; // Gold trophy for 1000+ points
    if (score >= 500) return "⭐"; // Star for 500+ points
    if (score >= 250) return "🎖️"; // Medal for 250+ points
    return null; // No badge
  };

  const renderContent = (data) => {
    const filteredData = leaderboardType === "Global"
      ? data.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : data.filter((item) => item.class === userData.class && item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const sortedData = filteredData.sort((a, b) => {
      if (sortBy === "Rank") return a.rank - b.rank;
      if (sortBy === "Score") return b.score - a.score; // Descending order for scores
      if (sortBy === "Name") return a.name.localeCompare(b.name); // Alphabetical order
      return 0;
    });

    // Trigger animation when data changes
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    return (
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View style={[styles.row, getRankStyle(item.rank)]}>
            <Text style={styles.rank}>{item.rank}</Text>
            <Image source={{ uri: item.pic }} style={styles.avatar} />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{item.name}</Text>
              {item.rank <= 3 && (
                <Text style={styles.title}>
                  {item.rank === 1 ? "Wizard" : item.rank === 2 ? "Prodigy" : "Master"}
                </Text>
              )}
            </View>
            <Text style={styles.class}>{item.class}</Text>
            <Text style={styles.score}>{item.score}</Text>
            {getBadge(item.score) && (
              <Text style={styles.badge}>{getBadge(item.score)}</Text>
            )}
          </View>
        )}
      />
    );
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return styles.wizardRow;
    if (rank === 2) return styles.prodigyRow;
    if (rank === 3) return styles.masterRow;
    return {};
  };

  const toggleSection = (category) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // Add animation
    setActiveSections((prev) =>
      prev.includes(category) ? prev.filter((t) => t !== category) : [...prev, category]
    );
  };

  return (
    <FlatList
      contentContainerStyle={styles.scrollContainer}
      data={Object.keys(leaderboardData[timeframe])} // Use the categories as data
      keyExtractor={(category) => category}
      renderItem={({ item: category }) => (
        <View key={category}>
          {renderHeader(category, activeSections.includes(category))}
          {activeSections.includes(category) && renderContent(leaderboardData[timeframe][category])}
        </View>
      )}
      ListHeaderComponent={
        <>
          <Text style={styles.screenTitle}>Leaderboard</Text>

          {/* User Progress Section */}
          <View style={styles.userProgress}>
            <Text style={styles.userProgressTitle}>Your Progress</Text>
            <View style={styles.userProgressRow}>
              <Image source={{ uri: userData.pic }} style={styles.avatar} />
              <View style={styles.userProgressDetails}>
                <Text style={styles.userProgressName}>{userData.name}</Text>
                <Text style={styles.userProgressClass}>Class: {userData.class}</Text>
              </View>
              <View style={styles.userProgressStats}>
                <Text style={styles.userProgressRank}>Rank: {userData.rank}</Text>
                <Text style={styles.userProgressScore}>Score: {userData.score}</Text>
              </View>
            </View>
          </View>

          {/* Timeframe and Sorting Pickers */}
          <Picker
            selectedValue={timeframe}
            onValueChange={(itemValue) => setTimeframe(itemValue)}
            style={{ height: 50, width: 150, backgroundColor: "#fff", marginBottom: 20 }}
          >
            <Picker.Item label="All-Time" value="All-Time" />
            <Picker.Item label="Weekly" value="Weekly" />
            <Picker.Item label="Monthly" value="Monthly" />
          </Picker>
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            style={{ height: 50, width: 150, backgroundColor: "#fff", marginBottom: 20 }}
          >
            <Picker.Item label="Sort by Rank" value="Rank" />
            <Picker.Item label="Sort by Score" value="Score" />
            <Picker.Item label="Sort by Name" value="Name" />
          </Picker>

          {/* Global vs. Class Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, leaderboardType === "Global" && styles.activeToggleButton]}
              onPress={() => setLeaderboardType("Global")}
            >
              <Text style={[styles.toggleButtonText, leaderboardType === "Global" && styles.activeToggleButtonText]}>Global</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, leaderboardType === "Class" && styles.activeToggleButton]}
              onPress={() => setLeaderboardType("Class")}
            >
              <Text style={[styles.toggleButtonText, leaderboardType === "Class" && styles.activeToggleButtonText]}>Class</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <TextInput
            style={styles.searchBar}
            placeholder="Search by name..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </>
      }
    />
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40, // Add extra padding at the bottom
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  userProgress: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  userProgressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#6200ea",
  },
  userProgressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  userProgressDetails: {
    flex: 1,
    marginLeft: 10,
  },
  userProgressName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userProgressClass: {
    fontSize: 14,
    color: "gray",
  },
  userProgressStats: {
    alignItems: "flex-end",
  },
  userProgressRank: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userProgressScore: {
    fontSize: 16,
    color: "#6200ea",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeToggleButton: {
    backgroundColor: "#6200ea",
  },
  toggleButtonText: {
    fontSize: 16,
    color: "#000",
  },
  activeToggleButtonText: {
    color: "#fff",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 5,
    elevation: 3,
  },
  wizardRow: {
    backgroundColor: "#FFD700", // Gold
    borderColor: "#FFA500",
    borderWidth: 2,
  },
  prodigyRow: {
    backgroundColor: "#C0C0C0", // Silver
    borderColor: "#808080",
    borderWidth: 2,
  },
  masterRow: {
    backgroundColor: "#CD7F32", // Bronze
    borderColor: "#8B4513",
    borderWidth: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    color: "#6200ea",
    fontWeight: "bold",
  },
  class: {
    fontSize: 16,
    color: "gray",
    marginRight: 10,
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  badge: {
    fontSize: 20,
    marginLeft: 10,
  },
});

export default LeaderboardScreen;