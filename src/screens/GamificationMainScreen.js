import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from "@react-native-picker/picker";

import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

// Level Data for Different Class Groups
const levelData = {
  "Class I & II": [
    { name: 'Rookie', tagline: 'Starting Strong, Learning Along!', colors: ['#FF6B6B', '#FF3B3B'],
      description: "Build confidence by learning the basics of English.",
      modules: ["Spelling", "Reading", "Pronunciation", "Vocabulary"],
      tips: ["Complete one activity daily", "Use flashcards to remember words", "Read aloud to improve pronunciation"],
      goal: "Rank up to Racer by mastering basic words and sentences!" },
    { name: 'Racer', tagline: 'Pacing with Skills, Chasing Next Goals!', colors: ['#FFD93D', '#FFB400'],
      description: "Boost your speed and improve sentence formation.",
      modules: ["Grammar", "Writing", "S.H.A.R.P", "Listening"],
      tips: ["Practice sentence formation", "Read short stories daily", "Write simple paragraphs"],
      goal: "Become a Master by improving reading, writing, and speaking!" },
    { name: 'Master', tagline: 'Crafting Words, Winning Hearts!', colors: ['#2ECC71', '#27AE60'],
      description: "Express yourself confidently with better writing and vocabulary.",
      modules: ["Writing", "Pronunciation", "Vocabulary", "Reading"],
      tips: ["Engage in writing exercises", "Use new vocabulary in speech", "Read books and summarize"],
      goal: "Rank up to Prodigy by strengthening grammar and vocabulary!" },
    { name: 'Prodigy', tagline: 'Winning the Crowd, Making Everyone Proud!', colors: ['#6A11CB', '#FF61D2'],
      description: "Master advanced writing, grammar, and speaking skills.",
      modules: ["S.H.A.R.P", "Listening", "Grammar", "Writing"],
      tips: ["Listen to audiobooks", "Practice storytelling", "Use complex grammar structures"],
      goal: "Achieve Wizard status by demonstrating fluency and confidence!" },
    { name: 'Wizard', tagline: 'A World of Words, at My Command!', colors: ['#8E44AD', '#5E3370'],
      description: "You command the language with fluency, clarity, and expertise!",
      modules: ["All Modules Combined", "Writing", "Grammar & Vocabulary", "Speaking"],
      tips: ["Engage in public speaking", "Write creative essays", "Mentor others"],
      goal: "Stay at Wizard Level & Beyond! Inspire others with your skills!" }
  ],
  "Class III to V": [
    { name: 'Rookie', tagline: 'Building Blocks for Excellence!', colors: ['#FF6B6B', '#FF3B3B'],
      description: "Develop stronger foundational English skills.",
      modules: ["Grammar", "Reading", "Vocabulary", "Writing"],
      tips: ["Practice sentence structures", "Read short stories", "Build word banks"],
      goal: "Rank up to Racer by forming structured sentences!" },
    { name: 'Racer', tagline: 'Accelerating Towards Mastery!', colors: ['#FFD93D', '#FFB400'],
      description: "Advance vocabulary and structured writing.",
      modules: ["Writing", "Listening", "S.H.A.R.P", "Grammar"],
      tips: ["Improve writing with detailed sentences", "Practice listening comprehension", "Use grammar rules effectively"],
      goal: "Become a Master by refining writing and comprehension skills!" },
    { name: 'Master', tagline: 'Refining Language Proficiency!', colors: ['#2ECC71', '#27AE60'],
      description: "Improve fluency and deeper comprehension.",
      modules: ["Reading", "Grammar", "Writing", "Pronunciation"],
      tips: ["Read longer texts", "Apply grammar rules", "Speak with confidence"],
      goal: "Rank up to Prodigy by mastering structured communication!" },
    { name: 'Prodigy', tagline: 'Becoming an English Expert!', colors: ['#6A11CB', '#FF61D2'],
      description: "Students analyze and articulate ideas effectively.",
      modules: ["Listening", "Speaking", "Advanced Writing", "S.H.A.R.P"],
      tips: ["Engage in debates", "Summarize texts", "Write essays with clarity"],
      goal: "Achieve Wizard status by demonstrating high-level fluency!" },
    { name: 'Wizard', tagline: 'Fluency & Mastery Achieved!', colors: ['#8E44AD', '#5E3370'],
      description: "The highest level where students achieve excellence in English.",
      modules: ["Creative Writing", "Grammar & Vocabulary", "Advanced Speaking", "Critical Thinking"],
      tips: ["Write stories", "Engage in formal speaking", "Master complex grammar"],
      goal: "Stay at Wizard Level & Beyond! Inspire others!" }
  ],
  "Class VI to X": [
    { name: 'Rookie', tagline: 'Exploring New Horizons!', colors: ['#FF6B6B', '#FF3B3B'],
      description: "Students refine fundamental skills and expand their knowledge.",
      modules: ["Grammar", "Reading", "Vocabulary", "Writing"],
      tips: ["Master sentence structures", "Read short novels", "Expand vocabulary through daily exercises"],
      goal: "Rank up to Racer by achieving a strong command over sentence formation!" },
    { name: 'Racer', tagline: 'Speeding Towards Excellence!', colors: ['#FFD93D', '#FFB400'],
      description: "Develop structured thinking, writing fluency, and comprehension skills.",
      modules: ["Writing", "Listening", "S.H.A.R.P", "Grammar"],
      tips: ["Analyze passages for deeper understanding", "Practice summarization", "Improve advanced writing techniques"],
      goal: "Become a Master by enhancing writing clarity and comprehension skills!" },
    { name: 'Master', tagline: 'Precision in Expression!', colors: ['#2ECC71', '#27AE60'],
      description: "Sharpen linguistic skills, refine critical thinking, and perfect grammar.",
      modules: ["Reading", "Grammar", "Writing", "Pronunciation"],
      tips: ["Develop thesis-driven essays", "Engage in discussions using formal language", "Write persuasively"],
      goal: "Rank up to Prodigy by mastering complex writing structures and advanced grammar!" },
    { name: 'Prodigy', tagline: 'Mastering Advanced English!', colors: ['#6A11CB', '#FF61D2'],
      description: "Become proficient in academic writing, debate, and literary analysis.",
      modules: ["Listening", "Speaking", "Advanced Writing", "S.H.A.R.P"],
      tips: ["Engage in debates", "Analyze complex texts", "Write research-based essays"],
      goal: "Achieve Wizard status by excelling in literature, formal communication, and writing expertise!" },
    { name: 'Wizard', tagline: 'Language Mastery at its Finest!', colors: ['#8E44AD', '#5E3370'],
      description: "Attain fluency, persuasive writing skills, and mastery over advanced English language concepts.",
      modules: ["Creative Writing", "Grammar & Vocabulary", "Public Speaking", "Critical Thinking"],
      tips: ["Compose compelling speeches", "Write professional-level essays", "Mentor others in language learning"],
      goal: "Stay at Wizard Level & Beyond! Become a thought leader and inspire excellence in communication!" }
  ]
};

const GamificationMainScreen = () => {
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Gamification Levels</Text>

        {/* Class Group Dropdown */}
        <Picker
          selectedValue={selectedClass}
          onValueChange={(itemValue) => setSelectedClass(itemValue)}
          style={styles.picker}
        >
          {Object.keys(levelData).map((classGroup, index) => (
            <Picker.Item key={index} label={classGroup} value={classGroup} />
          ))}
        </Picker>

        {/* Level Cards Based on Selected Class */}
        <View style={styles.levelsWrapper}>
          {levelData[selectedClass].map((level, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.levelCard} 
              onPress={() => navigation.navigate("LevelScreen", { level })}
            >
              <LinearGradient colors={level.colors} style={styles.gradientCard}>
                <Text style={styles.levelTitle}>{level.name}</Text>
                <Text style={styles.tagline}>{level.tagline}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f4f4f4' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  picker: { height: 50, backgroundColor: '#fff', marginBottom: 15 },
  levelCard: { borderRadius: 10, marginVertical: 10, overflow: 'hidden' },
  gradientCard: { padding: 20, borderRadius: 10, alignItems: 'center' },
  levelTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFF' },
  tagline: { fontSize: 14, fontStyle: 'italic', color: '#FFF' },
});

export default GamificationMainScreen;
