import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

const modules = [
  { name: "Spelling", icon: "book-outline" },
  { name: "Reading", icon: "reader-outline" },
  { name: "Pronunciation", icon: "mic-outline" },
  { name: "Grammar", icon: "create-outline" },
  { name: "Writing", icon: "pencil-outline" },
  { name: "Listening", icon: "headset-outline" },
  { name: "Vocabulary", icon: "library-outline" },
  { name: "S.H.A.R.P", icon: "flash-outline" },
];

export default function LearnPrepareTestScreen({ route }) {
  const navigation = useNavigation();
  const [selectedModule, setSelectedModule] = useState(
    modules.find(module => module.name === route.params?.module)?.name || modules[0].name
  );
  const [currentSection, setCurrentSection] = useState(route.params?.section || "Learn");

  useEffect(() => {
    console.log("Navigated to section:", currentSection);
    if (route.params?.module) {
      const moduleExists = modules.some(m => m.name === route.params.module);
      if (moduleExists) {
        setSelectedModule(route.params.module);
      }
    }
  }, [route.params?.module]);

  const getTabIndex = () => {
    switch (currentSection) {
      case "Learn":
        return "Learn";
      case "Prepare":
        return "Prepare";
      case "Test":
        return "Test";
      default:
        return "Learn";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {currentSection} - {selectedModule}
        </Text>
      </View>

      {/* Module Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moduleScrollContainer}
        style={styles.moduleScroll}
      >
        {modules.map((module) => (
          <TouchableOpacity
            key={module.name}
            style={[
              styles.moduleButton,
              selectedModule === module.name && styles.selectedModuleButton,
            ]}
            onPress={() => setSelectedModule(module.name)}
          >
            <View style={styles.moduleIconContainer}>
              <Ionicons
                name={module.icon}
                size={24}
                color={selectedModule === module.name ? "#6200ea" : "#555"}
                style={styles.moduleIcon}
              />
            </View>
            <Text
              style={[
                styles.moduleText,
                selectedModule === module.name && styles.selectedModuleText,
              ]}
              numberOfLines={1}
            >
              {module.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tabs for Learn, Prepare, Test */}
      <View style={styles.tabWrapper}>
        <Tab.Navigator
          initialRouteName={getTabIndex()}
          screenOptions={{
            tabBarLabelStyle: {
              fontSize: 14,
              fontWeight: "bold",
              textTransform: "capitalize",
            },
            tabBarStyle: {
              backgroundColor: "#6200ea",
              elevation: 0,
              height: 48,
            },
            tabBarIndicatorStyle: {
              backgroundColor: "#fff",
              height: 3,
              borderRadius: 2,
              width: "30%",
              marginLeft: "10%",
            },
            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#ddd",
            tabBarPressColor: "rgba(255, 255, 255, 0.2)",
            tabBarItemStyle: {
              width: "auto",
              paddingHorizontal: 16,
            },
          }}
        >
          <Tab.Screen name="Learn">
            {() => (
              <View style={styles.content}>
                <Text style={styles.contentTitle}>Learn - {selectedModule}</Text>
                <Text>This is the Learn section for {selectedModule}.</Text>
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Prepare">
            {() => (
              <View style={styles.content}>
                <Text style={styles.contentTitle}>Prepare - {selectedModule}</Text>
                <Text>This is the Prepare section for {selectedModule}.</Text>
              </View>
            )}
          </Tab.Screen>
          <Tab.Screen name="Test">
            {() => (
              <View style={styles.content}>
                <Text style={styles.contentTitle}>Test - {selectedModule}</Text>
                <Text>This is the Test section for {selectedModule}.</Text>
              </View>
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#6200ea",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  moduleScroll: {
    maxHeight: 90,
    paddingVertical: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moduleScrollContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  moduleButton: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },
  selectedModuleButton: {
    backgroundColor: "#e3daf9",
  },
  moduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 0, 234, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  moduleIcon: {
    textAlign: 'center',
  },
  moduleText: {
    fontSize: 12,
    color: "#555",
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedModuleText: {
    color: "#6200ea",
    fontWeight: "bold",
  },
  tabWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});