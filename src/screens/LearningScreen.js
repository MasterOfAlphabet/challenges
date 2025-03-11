import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const moduleOptions = [
  "Spelling", "Reading", "Pronunciation", "Grammar",
  "Writing", "Listening", "Vocabulary", "S.H.A.R.P."
];

const moduleColors = {
  Spelling: "#f44336",
  Reading: "#e91e63",
  Pronunciation: "#9c27b0",
  Grammar: "#673ab7",
  Writing: "#3f51b5",
  Listening: "#2196f3",
  Vocabulary: "#4caf50",
  "S.H.A.R.P.": "#ff9800",
};

const moduleIcons = {
  Spelling: "book-outline",
  Reading: "reader-outline",
  Pronunciation: "mic-outline",
  Grammar: "create-outline",
  Writing: "pencil-outline",
  Listening: "headset-outline",
  Vocabulary: "library-outline",
  "S.H.A.R.P.": "flash-outline",
};

const moduleDescriptions = {
  Spelling: "Spelling is a fundamental skill that helps improve reading, writing, and communication. Learning proper spelling enhances vocabulary, boosts confidence, and reduces confusion in written communication.",
  Reading: "Reading is the key to understanding and learning new information. It strengthens comprehension, enhances focus, and develops imagination. Being a strong reader helps in academics and real-world problem-solving.",
  Pronunciation: "Proper pronunciation is essential for clear communication. It ensures that words are understood correctly and helps in building confidence while speaking.",
  Grammar: "Grammar is the backbone of any language. Understanding grammar rules helps in constructing meaningful sentences and improving communication skills.",
  Writing: "Writing is a powerful tool for expressing thoughts and ideas. It enhances creativity, builds critical thinking, and improves communication skills.",
  Listening: "Listening is an important skill that helps in understanding and interpreting information effectively. Good listening skills improve focus, comprehension, and communication.",
  Vocabulary: "A rich vocabulary enhances both spoken and written communication. It allows for clearer expression of ideas and helps in understanding complex texts.",
  "S.H.A.R.P.": "The S.H.A.R.P. module focuses on Synonyms, Homophones, Antonyms, Root words, and Plural forms. It strengthens vocabulary and improves word relationships.",
};

const moduleCategories = {
  Spelling: [
    { title: "Dictation", description: "Dictation helps reinforce spelling by requiring students to listen and write words correctly.", example: "Teacher says 'accommodation', you write 'accommodation'." },
    { title: "Unscramble", description: "Rearranging scrambled letters helps recognize letter patterns.", example: "'pplae' → 'apple'." },
    { title: "Missing Letters", description: "Filling in missing letters strengthens spelling recall.", example: "'a_ple' → 'apple'." },
    { title: "Find the Correctly Spelled Word", description: "Choosing the correct spelling enhances word recognition.", example: "(a) accomodation (b) accommodation (c) acommodation" },
  ],
};

export default function LearningScreen() {
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const categories = moduleCategories[selectedModule] || [];

  return (
    <ScrollView style={styles.container}>
      {/* Module Header with Icon and Color */}
      <View style={[styles.header, { backgroundColor: moduleColors[selectedModule] }]}>
        <Ionicons name={moduleIcons[selectedModule]} size={30} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerText}>{selectedModule} Learning</Text>
      </View>
      
      {/* Module Description */}
      <Text style={styles.moduleDescription}>{moduleDescriptions[selectedModule]}</Text>

      {/* Dropdown to Select Module */}
      <Picker
        selectedValue={selectedModule}
        onValueChange={(itemValue) => setSelectedModule(itemValue)}
      >
        {moduleOptions.map((module) => (
          <Picker.Item key={module} label={module} value={module} />
        ))}
      </Picker>

      {/* Accordion-Style Category Cards with Different Colors */}
      {categories.map((category, index) => (
        <View key={index} style={[styles.card, { backgroundColor: moduleColors[selectedModule] }]}>
          <TouchableOpacity
            onPress={() => setExpandedCategory(expandedCategory === index ? null : index)}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>{category.title}</Text>
          </TouchableOpacity>

          {expandedCategory === index && (
            <View style={styles.cardContent}>
              <Text style={styles.cardDescription}>{category.description}</Text>
              <Text style={styles.cardExample}>Example: {category.example}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 8, marginBottom: 15 },
  headerIcon: { marginRight: 10 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  moduleDescription: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  card: { marginBottom: 10, borderRadius: 8, elevation: 2, padding: 15 },
  cardHeader: { paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardContent: { paddingTop: 10 },
  cardDescription: { fontSize: 16, color: "#fff", marginBottom: 5 },
  cardExample: { fontSize: 14, fontStyle: "italic", color: "#eee" },
});
