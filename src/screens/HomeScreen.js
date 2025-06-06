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
import { AuthContext } from "../../App";
import { LinearGradient } from "expo-linear-gradient";
import { auth } from "../../firebase"; // Make sure this path is correct
import { signOut } from "firebase/auth";


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

const moduleColors = {
  Spelling: "#f44336",
  Reading: "#e91e63",
  Pronunciation: "#9c27b0",
  Grammar: "#673ab7",
  Writing: "#3f51b5",
  Listening: "#2196f3",
  Vocabulary: "#4caf50",
  "S.H.A.R.P": "#ff9800",
};

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
  const { loggedInUser, setLoggedInUser } = useContext(AuthContext);

  // 1. Update the handleLogout function (around line 50)
const handleLogout = () => {
  setLoggedInUser(null);
  // If using Firebase auth, add: 
  // import { auth } from '../firebase';
  // import { signOut } from 'firebase/auth';
  // await signOut(auth);
  navigation.navigate("Login"); // Changed from no navigation to this
};

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
    if (!item || !item.module) return null;
    const challengeColor = moduleColors[item.module] || "#9c27b0";

    return (
      <TouchableOpacity
        style={[
          styles.challengeCard,
          { backgroundColor: challengeColor },
          isLargeScreen && { height: 180, marginRight: 0, marginBottom: 15 }
        ]}
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
        <Text 
          style={styles.challengeTitle}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.challengeTitle}
        </Text>
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
            {!loggedInUser ? (
              <>
                <TouchableOpacity
                  style={styles.signupButton}
                  onPress={() => navigation.navigate("Signup")}
                >
                  <Ionicons name="person-add-outline" size={20} color="#6200ea" />
                  <Text style={styles.signupButtonText}>Signup</Text>
                </TouchableOpacity>
                // 2. Update the login button in the hero section (around line 180)
<TouchableOpacity
  style={styles.loginButton}
  onPress={() => navigation.navigate("Login")} // Keep as navigate (not replace)
>
  <Ionicons name="log-in-outline" size={20} color="#6200ea" />
  <Text style={styles.loginButtonText}>Login</Text>
</TouchableOpacity>
              </>
            ) : (
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

        {/* Rest of your existing JSX remains exactly the same */}
        {/* Modules Section */}
        <View style={styles.modulesContainer}>
          <Text style={styles.modulesTitle}>Explore Modules</Text>
          {isLargeScreen ? (
            <View style={styles.modulesGridContainer}>
              {modules.map((item, index) => (
                <View key={index} style={styles.moduleItemWrapper}>
                  {renderModuleItem({ item })}
                </View>
              ))}
            </View>
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

        {/* Quick Access Links */}
        <View style={styles.linksContainer}>
          <Text style={styles.linksTitle}>Quick Access</Text>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("LearnPrepareTest", { section: "Learn" })}
          >
            <Text style={styles.linkText}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("LearnPrepareTest", { section: "Prepare" })}
          >
            <Text style={styles.linkText}>Prepare</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("LearnPrepareTest", { section: "Test" })}
          >
            <Text style={styles.linkText}>Test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("FindTheCorrectlySpelledWord")}
          >
            <Text style={styles.linkText}>Find the Correctly Spelled Word</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("Unscramble")}
          >
            <Text style={styles.linkText}>Unscrambled</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("DailyChallengesScreen")}
          >
            <Text style={styles.linkText}>Daily Challenges</Text>
          </TouchableOpacity>

            <TouchableOpacity
            style={styles.link}
            onPress={() => navigation.navigate("DWMSChallengeScreen")}
          >
            <Text style={styles.linkText}>DWMS Challenges</Text>
          </TouchableOpacity>

        </View>

        {/* Diagnostic Buttons */}
        <TouchableOpacity
          style={styles.diagnosticButton}
          onPress={() => navigation.navigate("ModuleSelectionScreen")}
        >
          <LinearGradient
            colors={['#6200ea', '#3700b3']}
            style={styles.diagnosticButtonGradient}
          >
            <Ionicons name="analytics" size={24} color="white" />
            <Text style={styles.diagnosticButtonText}>Start Diagnostic Test</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Daily Challenges Section */}
        <View style={styles.challengesContainer}>
          <Text style={styles.challengesTitle}>Daily Challenges</Text>
          {isLargeScreen ? (
            <View style={styles.challengesGrid}>
              {dailyChallenges.map((item, index) => (
                <View key={index} style={styles.challengeItemWrapper}>
                  {renderChallengeItem({ item })}
                </View>
              ))}
            </View>
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
  modulesGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  moduleItemWrapper: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
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
  challengesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  challengeItemWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  challengeCard: {
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
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
  linksContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  linksTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  link: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  linkText: {
    fontSize: 16,
    color: "#6200ea",
  },
  diagnosticButton: {
    marginTop: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  diagnosticButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diagnosticButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});