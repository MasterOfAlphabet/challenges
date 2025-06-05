import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Sample Data - More comprehensive
const generateSampleData = () => {
  const districts = ["Hyderabad", "Warangal", "Rangareddy", "Khammam", "Nizamabad"];
  const schools = [
    "Telangana Model School", 
    "Kendriya Vidyalaya", 
    "Delhi Public School",
    "St. Ann's High School",
    "GVMC High School"
  ];
  
  let data = {};
  
  // Generate data for all combinations
  ["Spelling", "Reading", "Grammar", "Vocabulary", "Writing", "Listening", "S.H.A.R.P", "All Modules"].forEach(module => {
    data[module] = {};
    ["Daily", "Weekly", "Monthly", "All-Time"].forEach(timeframe => {
      data[module][timeframe] = {};
      ["Class", "School", "District", "State", "National"].forEach(category => {
        const count = Math.floor(Math.random() * 15) + 3; // 3-18 participants
        data[module][timeframe][category] = Array.from({length: count}, (_, i) => ({
          rank: i + 1,
          name: i === 4 ? "You" : ["Rajesh", "Priya", "Arjun", "Sneha", "Amit", "Kavitha", "Rahul"][Math.floor(Math.random() * 7)],
          school: schools[Math.floor(Math.random() * schools.length)],
          district: districts[Math.floor(Math.random() * districts.length)],
          score: Math.floor(Math.random() * 1000) + 500,
          pic: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50)}.jpg`
        }));
      });
    });
  });
  
  return data;
};

const LeaderboardScreen = () => {
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedTimeframe, setSelectedTimeframe] = useState("Daily");
  const [selectedCategory, setSelectedCategory] = useState("Class");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(null);

  // Load data (simulating API call)
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLeaderboardData(generateSampleData());
      setIsLoading(false);
    }, 800);
  }, []);

  // Get current leaderboard data
  const getCurrentData = () => {
    if (!leaderboardData) return [];
    
    return leaderboardData[selectedModule]?.[selectedTimeframe]?.[selectedCategory] || [];
  };

  const currentData = getCurrentData();

  // Enhanced badge system
  const getBadge = (rank) => {
    const badges = {
      1: { emoji: "👑", color: "#FFD700", title: "Crown Champion" },
      2: { emoji: "⚡", color: "#C0C0C0", title: "Speed Master" },
      3: { emoji: "💎", color: "#CD7F32", title: "Elite Performer" },
    };
    return badges[rank] || null;
  };

  // Filter data based on search
  const filteredData = currentData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render leaderboard item
  const renderItem = ({ item }) => {
    const badge = getBadge(item.rank);
    
    return (
      <LinearGradient
        colors={badge ? [badge.color, "#FFFFFF"] : ["#FFFFFF", "#FFFFFF"]}
        start={[0, 0]}
        end={[1, 0]}
        style={[styles.itemContainer, badge && { borderLeftWidth: 6, borderLeftColor: badge.color }]}
      >
        <Text style={styles.rank}>{item.rank}</Text>
        
        <Image source={{ uri: item.pic }} style={styles.avatar} />
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.details}>{item.school} • {item.district}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{item.score}</Text>
          {badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
              <Text style={styles.badgeText}>{badge.title}</Text>
            </View>
          )}
        </View>
      </LinearGradient>
    );
  };

  if (isLoading || !leaderboardData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Loading Leaderboards...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header */}
        <Text style={styles.header} numberOfLines={1}>
          Telangana Champions
        </Text>
        
        {/* Compact User Card */}
        <View style={styles.userCard}>
          <Image 
            source={{ uri: "https://randomuser.me/api/portraits/women/10.jpg" }} 
            style={styles.userAvatar} 
          />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>You</Text>
            <Text style={styles.userInfoText} numberOfLines={1}>
              Class X • Warangal
            </Text>
          </View>
          <View style={styles.userStats}>
            <Text style={styles.userRank}>
              Rank #{currentData.findIndex(item => item.name === "You") + 1 || "-"}
            </Text>
            <Text style={styles.userScore}>
              {currentData.find(item => item.name === "You")?.score || "0"} pts
            </Text>
          </View>
        </View>

        {/* Filters Row - Now in a compact horizontal scroll */}
        <View style={styles.filterSection}>
  <Text style={styles.sectionTitle}>Filter Leaderboards</Text>
  <ScrollView 
    horizontal 
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.filterRow}
  >
    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>Module</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedModule}
          onValueChange={setSelectedModule}
          style={styles.picker}
          dropdownIconColor="#6200ea"
        >
          {Object.keys(leaderboardData).map(module => (
            <Picker.Item key={module} label={module} value={module} />
          ))}
        </Picker>
      </View>
    </View>

    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>Timeframe</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedTimeframe}
          onValueChange={setSelectedTimeframe}
          style={styles.picker}
          dropdownIconColor="#6200ea"
        >
          {["Daily", "Weekly", "Monthly", "All-Time"].map(timeframe => (
            <Picker.Item key={timeframe} label={timeframe} value={timeframe} />
          ))}
        </Picker>
      </View>
    </View>

    <View style={styles.filterGroup}>
      <Text style={styles.filterLabel}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={setSelectedCategory}
          style={styles.picker}
          dropdownIconColor="#6200ea"
        >
          {["Class", "School", "District", "State", "National"].map(category => (
            <Picker.Item key={category} label={category} value={category} />
          ))}
        </Picker>
      </View>
    </View>
  </ScrollView>
</View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6200ea" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search participants..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Leaderboard Title */}
        <View style={styles.leaderboardHeader}>
          <Text style={styles.leaderboardTitle} numberOfLines={1}>
            {selectedCategory} • {selectedModule}
          </Text>
          <Text style={styles.leaderboardSubtitle}>
            {selectedTimeframe} • {filteredData.length} participants
          </Text>
        </View>

        {/* Leaderboard List */}
        {filteredData.length > 0 ? (
          <FlatList
            data={filteredData}
            scrollEnabled={false} // Disable nested scrolling
            keyExtractor={(item) => `${item.rank}-${item.name}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={40} color="#6200ea" />
            <Text style={styles.emptyText}>No participants found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};


// Enhanced Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ea",
    textAlign: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#6200ea",
  },
  userDetails: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userInfoText: {
    fontSize: 14,
    color: "#666",
  },
  userStats: {
    alignItems: "flex-end",
  },
  userRank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  userScore: {
    fontSize: 16,
    color: "#333",
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    color: "#6200ea",
    marginBottom: 5,
    fontWeight: "500",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    height: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#333",
  },
  leaderboardHeader: {
    marginBottom: 15,
  },
  leaderboardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  leaderboardSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6200ea",
    width: 30,
    textAlign: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  details: {
    fontSize: 12,
    color: "#666",
  },
  scoreContainer: {
    alignItems: "center",
  },
  score: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
  },
  badge: {
    alignItems: "center",
    marginTop: 5,
  },
  badgeEmoji: {
    fontSize: 16,
  },
  badgeText: {
    fontSize: 10,
    color: "#6200ea",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6200ea',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  // Enhance picker styles
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    height: 40,
    width: '100%',
  },
  filterContainer: {
    flex: 1,
    marginHorizontal: 5,
    minWidth: 100, // Ensure pickers are always visible
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    padding: 12,
    paddingBottom: 20,
  },
  header: {
    fontSize: 20, // Reduced from 24
    fontWeight: "bold",
    color: "#6200ea",
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
  },
  userAvatar: {
    width: 48, // Reduced from 60
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#6200ea",
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: 16, // Reduced from 18
    fontWeight: "bold",
  },
  userInfoText: {
    fontSize: 13, // Reduced from 14
    color: "#666",
  },
  userStats: {
    alignItems: "flex-end",
    minWidth: 70,
  },
  userRank: {
    fontSize: 14, // Reduced from 16
    fontWeight: "bold",
    color: "#6200ea",
  },
  userScore: {
    fontSize: 14,
  },
  filterRow: {
    flexDirection: "row",
    paddingBottom: 10,
  },
  filterContainer: {
    width: 140, // Fixed width for pickers
    marginRight: 10,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    height: 40,
  },
  searchContainer: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: 40,
  },
  leaderboardHeader: {
    marginBottom: 12,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  leaderboardSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    height: 60, // Fixed height for items
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  rank: {
    width: 24,
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ea",
    textAlign: "center",
  },
  avatar: {
    width: 40, // Reduced from 50
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  name: {
    fontSize: 14, // Reduced from 16
    fontWeight: "600",
  },
  details: {
    fontSize: 11, // Reduced from 12
    color: "#666",
  },
  score: {
    fontSize: 14, // Reduced from 16
    fontWeight: "bold",
    color: "#6200ea",
  },
  filterSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6200ea',
    marginBottom: 8,
    marginLeft: 4,
  },
  filterGroup: {
    marginRight: 12,
    width: 140,
  },
  filterLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
    marginLeft: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
});

export default LeaderboardScreen;