// App.js
import React, { useState, createContext, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Import your existing screens
import HomeScreen from "./src/screens/HomeScreen";
import SpellingScreen from "./src/screens/SpellingScreen";
import ReadingScreen from "./src/screens/ReadingScreen";
import PronunciationScreen from "./src/screens/PronunciationScreen";
import GrammarScreen from "./src/screens/GrammarScreen";
import WritingScreen from "./src/screens/WritingScreen";
import ListeningScreen from "./src/screens/ListeningScreen";
import VocabularyScreen from "./src/screens/VocabularyScreen";
import SharpScreen from "./src/screens/SharpScreen";

import Dashboard from "./src/screens/Dashboard";
import TestYourSkillsScreen from "./src/screens/TestYourSkillsScreen";
import LeaderBoardScreen from "./src/screens/LeaderboardScreen";

import LoginScreen from "./src/screens/LoginScreen";
import SignupScreen from "./src/screens/SignupScreen";

import SchoolDashboard from "./src/screens/SchoolDashboard";
import TeacherDashboard from './src/screens/TeacherDashboard';
import AdminDashboard from './src/screens/AdminDashboard';
import StudentDashboard from './src/screens/StudentDashboard';

import PronunciationPractice from "./src/screens/PronunciationPractice";
import LearningScreen from "./src/screens/LearningScreen";
import PracticeSkillsScreen from "./src/screens/PracticeSkillsScreen";

import Battles from "./src/screens/Battles";

import ChallengesScreen from "./src/screens/ChallengesScreen";
import ChallengeCreationScreen from './src/screens/ChallengeCreationScreen';
import ChallengeSubmissionScreen from "./src/screens/ChallengeSubmissionScreen";
import AnnouncingWinnersScreen from "./src/screens/AnnounceWinnersScreen";

import TestSkillsHistoryScreen from "./src/screens/TestSkillsHistoryScreen"; // Import the new score history screen

//import UnscrambleScreen from "./src/screens/UnscrambleScreen";

import GamificationMainScreen from './src/screens/GamificationMainScreen';
import LevelScreen from './src/screens/LevelScreen';

// 1) Create AuthContext so we can store loggedInUser
export const AuthContext = createContext(null);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GamificationStack = createStackNavigator();

function GamificationStackScreen() {
  return (
    <GamificationStack.Navigator>
      <GamificationStack.Screen name="GamificationMain" component={GamificationMainScreen} />
      <GamificationStack.Screen name="LevelScreen" component={LevelScreen} />
    </GamificationStack.Navigator>
  );
}

const ChallengesStack = createStackNavigator();

function ChallengesStackScreen() {
  return (
    <ChallengesStack.Navigator>
      <ChallengesStack.Screen name="ChallengesScreen" component={ChallengesScreen} />
      <ChallengesStack.Screen name="ChallengeCreationScreen" component={ChallengeCreationScreen} />
      <ChallengesStack.Screen name="ChallengeSubmission" component={ChallengeSubmissionScreen} />
      <ChallengesStack.Screen name="AnnouncingWinners" component={AnnouncingWinnersScreen} />
    </ChallengesStack.Navigator>
  );
}

// 1) Create a stack for Dashboard
const DashboardStack = createStackNavigator();

function DashboardStackScreen() {
  return (
    <DashboardStack.Navigator>
      <DashboardStack.Screen name="DashboardMain" component={Dashboard} />
      <DashboardStack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <DashboardStack.Screen name="StudentDashboard" component={StudentDashboard} />
      <DashboardStack.Screen name="SchoolDashboard" component={SchoolDashboard} />
      <DashboardStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <DashboardStack.Screen name="ChallengeCreationScreen" component={ChallengeCreationScreen} />
      {/* etc. */}
    </DashboardStack.Navigator>
  );
}

// Stack Navigator for Module Screens
const ModuleStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="LearningScreen" component={LearningScreen} />
    <Stack.Screen name="Spelling" component={SpellingScreen} />
    <Stack.Screen name="Reading" component={ReadingScreen} />
    <Stack.Screen name="Pronunciation" component={PronunciationScreen} />
    <Stack.Screen name="Grammar" component={GrammarScreen} />
    <Stack.Screen name="Writing" component={WritingScreen} />
    <Stack.Screen name="Listening" component={ListeningScreen} />
    <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
    <Stack.Screen name="Sharp" component={SharpScreen} />
    {/* Keep your existing screens */}
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SchoolDashboard" component={SchoolDashboard} />
    <Stack.Screen name="PronunciationPractice" component={PronunciationPractice} />
    <Stack.Screen name="Signup" component={SignupScreen} />
    <Stack.Screen name="TestYourSkills" component={TestYourSkillsScreen} />
    <Stack.Screen name="TestSkillsHistory" component={TestSkillsHistoryScreen} />
     {/*<Stack.Screen name="UnscrambleScreen" component={UnscrambleScreen} />*/}
  </Stack.Navigator>
);

// Bottom Tab Navigator
const AppTabs = () => {
  const { loggedInUser } = useContext(AuthContext); // Get loggedInUser from AuthContext

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Practice":
              iconName = "build";
              break;
            case "Test":
              iconName = "checkbox";
              break;
            case "Battles":
              iconName = "flame";
              break;
            case "Challenges":
              iconName = "list";
              break;
            case "Dashboard":
              iconName = "stats-chart";
              break;
            case "LeaderBoard":
              iconName = "trophy";
              break;
            default:
              iconName = "help-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#f8f9fa", paddingBottom: 5 },
      })}
    >
      <Tab.Screen
        name="Home"
        component={ModuleStack}
        options={{ headerShown: false }}
      />

<Tab.Screen name="Gamification" component={GamificationStackScreen} />

      {/* Only show Practice and Test tabs for Students */}
      {loggedInUser?.role === "Student" && (
        <>
          <Tab.Screen name="Learn" component={LearningScreen} />
          <Tab.Screen name="Practice" component={PracticeSkillsScreen} />
          <Tab.Screen name="Test" component={TestStackScreen} />
        </>
      )}
      
     
      {/*<Tab.Screen name="Unscramble" component={UnscrambleScreen} />*/}
      <Tab.Screen name="Battles" component={Battles} />
      <Tab.Screen name="Challenges" component={ChallengesStackScreen} />
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoardScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  // 2) Keep track of loggedInUser. If null => not logged in
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    // 3) Provide AuthContext to entire app
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}