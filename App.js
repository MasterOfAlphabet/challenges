// App.js
import React, { useState, createContext, useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Keep ALL your original imports (unchanged)
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
import TestSkillsHistoryScreen from "./src/screens/TestSkillsHistoryScreen";
import Unscramble from "./src/screens/UnscrambleScreen";
import GamificationMainScreen from './src/screens/GamificationMainScreen';
import LevelScreen from './src/screens/LevelScreen';
import LearnPrepareTestScreen from './src/screens/LearnPrepareTestScreen';
import FindTheCorrectlySpelledWord from './src/screens/FindTheCorrectlySpelledWord';
import DiagnosticDashboard from './src/screens/DiagnosticDashboard';
import SkillsTestScreen from './src/screens/SkillsTestScreen;';
import SkillsAnalysisResultsScreen from './src/screens/SkillsAnalysisResultsScreen;';
import ModuleSelectionScreen from './src/screens/ModuleSelectionScreen';

import ModuleSkillAnalysisDetailsScreen from './src/screens/ModuleSkillAnalysisDetailsScreen';

import DailyChallengesScreen from './src/screens/DailyChallengesScreen';

// Auth Context (unchanged)
export const AuthContext = createContext(null);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 1. First, simplify your Diagnostic stack to go straight to test:
function DiagnosticStackScreen() {
  return (
    <Stack.Navigator>
      {/* Remove DiagnosticDashboard if you don't need it */}
	<Stack.Screen 
        name="ModuleSelectionScreen" 
        component={ModuleSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SkillsTestScreen" 
        component={SkillsTestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SkillsAnalysisResultsScreen" 
        component={SkillsAnalysisResultsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ModuleSkillAnalysisDetailsScreen" 
        component={ModuleSkillAnalysisDetailsScreen}
        options={{ headerShown: false }}
      />
       <Stack.Screen 
        name="LearnPrepareTestScreen" 
        component={LearnPrepareTestScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Keep ALL your other stack navigators (TestStackScreen, GamificationStackScreen, etc.) 
// EXACTLY AS THEY WERE in your original file.

// Stack for Test-related screens
function TestStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="TestYourSkillsMain" component={TestYourSkillsScreen} />
      <Stack.Screen name="TestSkillsHistory" component={TestSkillsHistoryScreen} />
    </Stack.Navigator>
  );
}

// Stack for Gamification screens
function GamificationStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="GamificationMain" component={GamificationMainScreen} />
      <Stack.Screen name="LevelScreen" component={LevelScreen} />
    </Stack.Navigator>
  );
}

function ChallengesStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Challenges"  // Changed from "ChallengesMain" to match navigation target
        component={ChallengesScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeCreation"  // Keep this name consistent
        component={ChallengeCreationScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ChallengeSubmission" 
        component={ChallengeSubmissionScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="AnnouncingWinners" 
        component={AnnouncingWinnersScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack for Dashboard screens
function DashboardStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardMain" component={Dashboard} />
      <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
      <Stack.Screen name="SchoolDashboard" component={SchoolDashboard} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    </Stack.Navigator>
  );
}

// Main Module Stack Navigator
function ModuleStack() {
  return (
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
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PronunciationPractice" component={PronunciationPractice} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="LearnPrepareTest" component={LearnPrepareTestScreen} />
      <Stack.Screen name="FindTheCorrectlySpelledWord" component={FindTheCorrectlySpelledWord} />
      <Stack.Screen name="Unscramble" component={Unscramble} />
      <Stack.Screen name="DiagnosticDashboard" component={DiagnosticDashboard} />
      <Stack.Screen name="DailyChallengesScreen" component={DailyChallengesScreen} />
      
    </Stack.Navigator>
  );
}

// 2. Only update the TAB NAVIGATOR to add Diagnostic tab correctly
function AppTabs() {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "Home": iconName = "home"; break;
            case "Practice": iconName = "build"; break;
            case "Test": iconName = "checkbox"; break;
            case "Battles": iconName = "flame"; break;
            case "Challenges": iconName = "list"; break;
            case "Dashboard": iconName = "stats-chart"; break;
            case "LeaderBoard": iconName = "trophy"; break;
            case "Gamification": iconName = "game-controller"; break;
            case "Learn": iconName = "book"; break;
            case "Skills Analysis": iconName = "analytics"; break; // ✅ Added Diagnostic icon
            default: iconName = "help-circle";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#3498db",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#f8f9fa", paddingBottom: 5 },
      })}
    >
      {/* Keep ALL your existing tabs EXACTLY AS THEY WERE */}
      <Tab.Screen name="Home" component={ModuleStack} options={{ headerShown: false }} />
      
      {loggedInUser?.role === "Student" && (
        <>
          <Tab.Screen name="Learn" component={LearningScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Practice" component={PracticeSkillsScreen} options={{ headerShown: false }} />
          <Tab.Screen name="Test" component={TestStackScreen} options={{ headerShown: false }} />
        </>
      )}

      <Tab.Screen name="Gamification" component={GamificationStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Battles" component={Battles} options={{ headerShown: false }} />
      <Tab.Screen name="Challenges" component={ChallengesStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Dashboard" component={DashboardStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name="LeaderBoard" component={LeaderBoardScreen} options={{ headerShown: false }} />

      {/* ✅ ONLY ADD THIS NEW TAB (if missing) */}
      <Tab.Screen 
        name="Skills Analysis" 
        component={DiagnosticStackScreen} 
        options={{ headerShown: false }} 
      />
    </Tab.Navigator>
  );
}

// Keep the rest of your file EXACTLY THE SAME (App component, etc.)
export default function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}