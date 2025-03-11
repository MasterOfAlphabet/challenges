// HomeScreen.js
import React, { useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import AuthContext
import { AuthContext } from "../../App";

// 8 Modules
const modules = [
  { name: "Spelling", icon: "book-outline", screen: "Spelling" },
  { name: "Reading", icon: "reader-outline", screen: "Reading" },
  { name: "Pronunciation", icon: "mic-outline", screen: "Pronunciation" },
  { name: "Grammar", icon: "create-outline", screen: "Grammar" },
  { name: "Writing", icon: "pencil-outline", screen: "Writing" },
  { name: "Listening", icon: "headset-outline", screen: "Listening" },
  { name: "Vocabulary", icon: "library-outline", screen: "Vocabulary" },
  { name: "S.H.A.R.P", icon: "flash-outline", screen: "Sharp" },
];

// Assign a unique color to each module
const moduleColors = {
  Spelling: "#f44336",      // Red
  Reading: "#e91e63",       // Pink
  Pronunciation: "#9c27b0", // Purple
  Grammar: "#673ab7",       // Deep Purple
  Writing: "#3f51b5",       // Indigo
  Listening: "#2196f3",     // Blue
  Vocabulary: "#4caf50",    // Green
  "S.H.A.R.P": "#ff9800",   // Orange
};

// Sample daily challenges
const dailyChallenges = [
  {
    module: "Spelling",
    challengeTitle: "Spell 'Synchronization'",
    timeLeft: "2h 15m",
    submissions: 32,
    myStatus: "Not submitted",
  },
  {
    module: "Reading",
    challengeTitle: "Read & Summarize Short Story",
    timeLeft: "1d 3h",
    submissions: 15,
    myStatus: "Submitted",
  },
  {
    module: "Pronunciation",
    challengeTitle: "Pronounce 'Onomatopoeia'",
    timeLeft: "5h 0m",
    submissions: 27,
    myStatus: "Not submitted",
  },
  {
    module: "Grammar",
    challengeTitle: "Identify 10 Nouns",
    timeLeft: "12h 0m",
    submissions: 41,
    myStatus: "Not submitted",
  },
  {
    module: "Writing",
    challengeTitle: "50-Word Short Story",
    timeLeft: "4h 30m",
    submissions: 20,
    myStatus: "Submitted",
  },
  {
    module: "Listening",
    challengeTitle: "Podcast Summary",
    timeLeft: "8h 0m",
    submissions: 9,
    myStatus: "Not submitted",
  },
  {
    module: "Vocabulary",
    challengeTitle: "Learn 3 Synonyms for 'amazing'",
    timeLeft: "16h 0m",
    submissions: 14,
    myStatus: "Not submitted",
  },
  {
    module: "S.H.A.R.P",
    challengeTitle: "Find 5 Antonyms",
    timeLeft: "6h 45m",
    submissions: 12,
    myStatus: "Not submitted",
  },
];

const HERO_HEIGHT = 200;
const ITEM_WIDTH_MOBILE = 0.75;
const SPACER_ITEM_SIZE =
  (Dimensions.get("window").width -
    Dimensions.get("window").width * ITEM_WIDTH_MOBILE) /
  2;

export default function HomeScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  // Access AuthContext
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

  // A simple logout handler
  const handleLogout = () => {
    // If using Firebase Auth, you'd also call signOut() here.
    // For this demo, just set loggedInUser = null
    setLoggedInUser(null);
  };

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(waveAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const waveTranslate = waveAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 15, 0],
  });

  const renderModuleItem = ({ item }) => {
    if (!item.name) {
      return <View style={{ width: SPACER_ITEM_SIZE }} />;
    }
    const bgColor = moduleColors[item.name] || "#9c27b0";

    return (
      <TouchableOpacity
        style={[
          isLargeScreen ? styles.moduleItemLarge : styles.moduleItemMobile,
          { backgroundColor: bgColor },
        ]}
        onPress={() => navigation.navigate(item.screen)}
      >
        <Ionicons
          name={item.icon}
          size={isLargeScreen ? 60 : 50}
          color="#fff"
          style={{ marginBottom: 10 }}
        />
        <Text style={styles.moduleItemText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderChallengeItem = ({ item }) => {
    if (!item || !item.module) {
      return null;
    }
    const challengeColor = moduleColors[item.module] || "#9c27b0";

    return (
      <TouchableOpacity
        style={[styles.challengeCard, { backgroundColor: challengeColor }]}
        onPress={() => {
          if (item.myStatus === "Submitted") {
            alert("You already submitted this challenge.");
          } else {
            navigation.navigate("Challenges", {
              module: item.module,
              title: item.challengeTitle,
            });
          }
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="trophy-outline" size={24} color="#fff" />
          <Text style={styles.challengeModule}>{item.module}</Text>
        </View>
        <Text style={styles.challengeTitle}>{item.challengeTitle}</Text>
        <View style={styles.challengeMeta}>
          <Text style={styles.challengeTime}>⏱ {item.timeLeft}</Text>
          <Text style={styles.challengeSubs}>Subs: {item.submissions}</Text>
          <Text
            style={[
              styles.challengeStatus,
              item.myStatus === "Submitted" ? { color: "#0f0" } : { color: "#ff4444" },
            ]}
          >
            {item.myStatus}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // For mobile => add spacer items, for tablet => just modules
  const moduleData = isLargeScreen
    ? modules
    : [{ key: "left-spacer" }, ...modules, { key: "right-spacer" }];

  return (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={styles.container}>
        {/* Hero / Wave Section */}
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
            {/* If user is not logged in => show Signup & Login */}
            {!loggedInUser && (
              <>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => navigation.navigate("Signup")}
                >
                  <Ionicons name="person-add-outline" size={20} color="#6200ea" />
                  <Text style={styles.signupButtonText}>Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Ionicons name="log-in-outline" size={20} color="#6200ea" />
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </>
            )}

            {/* If user is logged in => show role/email & Logout */}
            {loggedInUser && (
              <>
                <Text style={styles.loggedInText}>
                  Logged in as {loggedInUser.role || loggedInUser.email}
                </Text>
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={20} color="#6200ea" />
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              </>
            )}

            <Text style={styles.appTitle}>Master of Alphabet</Text>
            <Text style={styles.appSubtitle}>8-in-1 English Skills</Text>
          </View>
        </Animated.View>

        {/* Modules Section */}
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Explore Modules</Text>
          {isLargeScreen ? (
            <FlatList
              data={moduleData}
              keyExtractor={(item, index) => item.name || index.toString()}
              numColumns={4}
              columnWrapperStyle={styles.modulesGridRow}
              contentContainerStyle={{ alignItems: "center" }}
              renderItem={renderModuleItem}
            />
          ) : (
            <Animated.FlatList
              data={moduleData}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center" }}
              snapToAlignment="start"
              snapToInterval={Dimensions.get("window").width * ITEM_WIDTH_MOBILE}
              decelerationRate="fast"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              renderItem={renderModuleItem}
            />
          )}
        </View>

        {/* Daily Challenges */}
        <View style={styles.challengesContainer}>
          <Text style={styles.challengesTitle}>Daily Challenges</Text>
          {isLargeScreen ? (
            <FlatList
              data={dailyChallenges}
              keyExtractor={(item, index) => item.module + index}
              renderItem={renderChallengeItem}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
            />
          ) : (
            <FlatList
              data={dailyChallenges}
              keyExtractor={(item, index) => item.module + index}
              renderItem={renderChallengeItem}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    flex: 1,
  },
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

  // If user is not logged in => top-left "Signup", top-right "Login"
  signupButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  signupButtonText: {
    marginLeft: 5,
    color: "#6200ea",
    fontWeight: "bold",
    fontSize: 14,
  },
  loginButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  loginButtonText: {
    marginLeft: 5,
    color: "#6200ea",
    fontWeight: "bold",
    fontSize: 14,
  },

  // If user is logged in => show role + logout
  loggedInText: {
    position: "absolute",
    top: 20,
    left: 20,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  logoutButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  logoutButtonText: {
    marginLeft: 5,
    color: "#6200ea",
    fontWeight: "bold",
    fontSize: 14,
  },

  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#e0e0e0",
  },
  modulesContainer: {
    marginTop: -30,
    paddingBottom: 10,
  },
  modulesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginBottom: 10,
  },
  modulesGridRow: {
    flex: 1,
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  moduleItemMobile: {
    width: Dimensions.get("window").width * ITEM_WIDTH_MOBILE * 0.8,
    height: 140,
    borderRadius: 15,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    elevation: 4,
  },
  moduleItemLarge: {
    width: 120,
    height: 120,
    borderRadius: 15,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    elevation: 4,
  },
  moduleItemText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  challengesContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  challengesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  challengeCard: {
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    marginBottom: 15,
    elevation: 3,
  },
  challengeModule: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  challengeTitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  challengeMeta: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  challengeTime: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  challengeSubs: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  challengeStatus: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
