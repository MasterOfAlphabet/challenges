import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

// Importing Screens
import HomeScreen from "../screens/HomeScreen";
import SpellingScreen from "../screens/SpellingScreen";
import ReadingScreen from "../screens/ReadingScreen";
import PronunciationScreen from "../screens/PronunciationScreen";
import GrammarScreen from "../screens/GrammarScreen";
import WritingScreen from "../screens/WritingScreen";
import ListeningScreen from "../screens/ListeningScreen";
import VocabularyScreen from "../screens/VocabularyScreen";
import SharpScreen from "../screens/SharpScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Spelling") iconName = "book-outline";
            else if (route.name === "Reading") iconName = "library-outline";
            else if (route.name === "Pronunciation") iconName = "mic-outline";
            else if (route.name === "Grammar") iconName = "create-outline";
            else if (route.name === "Writing") iconName = "pencil-outline";
            else if (route.name === "Listening") iconName = "headset-outline";
            else if (route.name === "Vocabulary") iconName = "chatbubble-outline";
            else if (route.name === "S.H.A.R.P") iconName = "sparkles-outline";

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#4CAF50",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "#f8f9fa", paddingBottom: 5, height: 60 },
        })}
      >
        <Tab.Screen name="Spelling" component={SpellingScreen} />
        <Tab.Screen name="Reading" component={ReadingScreen} />
        <Tab.Screen name="Pronunciation" component={PronunciationScreen} />
        <Tab.Screen name="Grammar" component={GrammarScreen} />
        <Tab.Screen name="Writing" component={WritingScreen} />
        <Tab.Screen name="Listening" component={ListeningScreen} />
        <Tab.Screen name="Vocabulary" component={VocabularyScreen} />
        <Tab.Screen name="S.H.A.R.P" component={SharpScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
