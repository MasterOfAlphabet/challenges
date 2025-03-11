import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient"; // For gradient background

const SchoolDashboard = () => {
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [activeBadge, setActiveBadge] = useState(null);

  const modules = [
    "Spelling",
    "Reading",
    "Pronunciation",
    "Grammar",
    "Writing",
    "Listening",
    "Vocabulary",
    "S.H.A.R.P",
    "Mega Competition",
  ];

  const badgeLevels = [
    {
      level: "Rookie",
      students: 120,
      classGroups: {
        "I/II": 30,
        "III to V": 50,
        "VI to X": 40,
      },
    },
    {
      level: "Racer",
      students: 80,
      classGroups: {
        "I/II": 20,
        "III to V": 35,
        "VI to X": 25,
      },
    },
    {
      level: "Master",
      students: 50,
      classGroups: {
        "I/II": 10,
        "III to V": 20,
        "VI to X": 20,
      },
    },
    {
      level: "Prodigy",
      students: 30,
      classGroups: {
        "I/II": 5,
        "III to V": 15,
        "VI to X": 10,
      },
    },
    {
      level: "Wizard",
      students: 10,
      classGroups: {
        "I/II": 2,
        "III to V": 5,
        "VI to X": 3,
      },
    },
  ];

  const handleBadgePress = (level) => {
    setActiveBadge(activeBadge === level ? null : level);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* School Name and Logo */}
      <View style={styles.header}>
        <Text style={styles.schoolName}>Greenwood High School</Text>
        <Text style={styles.schoolLogo}>🏫</Text> {/* Placeholder for logo */}
      </View>

      {/* Total Students Joined / Total Strength */}
      <TouchableOpacity style={styles.studentsCard}>
        <Text style={styles.studentsTitle}>Total Students</Text>
        <Text style={styles.studentsCount}>850 / 1000</Text>
      </TouchableOpacity>

       {/* Quiz Winners Section */}
       <Text style={styles.sectionTitle}>Quiz Winners</Text>
      <View style={styles.quizWinners}>
        <Text>Daily: Alice Johnson (Class IX) - 980 Points</Text>
        <Text>Weekly: Bob Smith (Class X) - 960 Points</Text>
        <Text>Monthly: Charlie Lee (Class VIII) - 940 Points</Text>
      </View>
      
      {/* Dropdown for Modules and Mega Competition */}
      <Picker
        selectedValue={selectedModule}
        onValueChange={(itemValue) => setSelectedModule(itemValue)}
        style={styles.dropdown}
      >
        {modules.map((module) => (
          <Picker.Item key={module} label={module} value={module} />
        ))}
      </Picker>

      {/* Badge Levels Accordion */}
      {badgeLevels.map((badge) => (
        <TouchableOpacity
          key={badge.level}
          style={[
            styles.badgeCard,
            badge.level === "Rookie" && styles.rookieBadge,
            badge.level === "Racer" && styles.racerBadge,
            badge.level === "Master" && styles.masterBadge,
            badge.level === "Wizard" && styles.wizardBadge,
          ]}
          onPress={() => handleBadgePress(badge.level)}
        >
          {badge.level === "Prodigy" ? (
            <LinearGradient
              colors={["#3498db", "#e84393"]} // Blue to Pink Gradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.prodigyBadge}
            >
              <Text style={styles.badgeLevel}>{badge.level}</Text>
              <Text style={styles.badgeStudents}>{badge.students} Students</Text>
              {activeBadge === badge.level && (
                <View style={styles.classwiseData}>
                  <Text style={styles.classwiseText}>
                    Class I/II: {badge.classGroups["I/II"]} Students
                  </Text>
                  <Text style={styles.classwiseText}>
                    Class III to V: {badge.classGroups["III to V"]} Students
                  </Text>
                  <Text style={styles.classwiseText}>
                    Class VI to X: {badge.classGroups["VI to X"]} Students
                  </Text>
                </View>
              )}
            </LinearGradient>
          ) : (
            <>
              <Text style={styles.badgeLevel}>{badge.level}</Text>
              <Text style={styles.badgeStudents}>{badge.students} Students</Text>
              {activeBadge === badge.level && (
                <View style={styles.classwiseData}>
                  <Text style={styles.classwiseText}>
                    Class I/II: {badge.classGroups["I/II"]} Students
                  </Text>
                  <Text style={styles.classwiseText}>
                    Class III to V: {badge.classGroups["III to V"]} Students
                  </Text>
                  <Text style={styles.classwiseText}>
                    Class VI to X: {badge.classGroups["VI to X"]} Students
                  </Text>
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  schoolName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  schoolLogo: {
    fontSize: 40,
  },
  studentsCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  studentsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  studentsCount: {
    fontSize: 24,
    color: "#6200ea",
  },
  dropdown: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  badgeCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  rookieBadge: {
    backgroundColor: "#ff4444", // Red
  },
  racerBadge: {
    backgroundColor: "#ffdd59", // Yellow
  },
  masterBadge: {
    backgroundColor: "#00b894", // Green
  },
  prodigyBadge: {
    borderRadius: 8,
  },
  wizardBadge: {
    backgroundColor: "#6c5ce7", // Purple
  },
  badgeLevel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff", // White text for better contrast
  },
  badgeStudents: {
    fontSize: 14,
    color: "#fff", // White text for better contrast
  },
  classwiseData: {
    marginTop: 10,
  },
  classwiseText: {
    color: "#fff", // White text for better contrast
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quizWinners: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
  },
});

export default SchoolDashboard;