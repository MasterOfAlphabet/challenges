import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LevelScreen = ({ route }) => {
  const { level } = route.params || {};
  
  if (!level) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: Level data not found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={level.colors} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.levelTitle}>{level.name}</Text>
          <Text style={styles.tagline}>{level.tagline}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.description}>{level.description}</Text>
        </View>
        
        <Text style={styles.sectionTitle}>📚 Focused Modules</Text>
        <View style={styles.card}>
          {level.modules && level.modules.length > 0 ? (
            level.modules.map((module, index) => (
              <Text key={index} style={styles.module}>✔ {module}</Text>
            ))
          ) : (
            <Text style={styles.module}>No modules available.</Text>
          )}
        </View>
        
        <Text style={styles.sectionTitle}>📈 Improvement Tips</Text>
        <View style={styles.card}>
          {level.tips && level.tips.length > 0 ? (
            level.tips.map((tip, index) => (
              <Text key={index} style={styles.tip}>✔ {tip}</Text>
            ))
          ) : (
            <Text style={styles.tip}>No tips available.</Text>
          )}
        </View>
        
        <View style={styles.goalCard}>
          <Text style={styles.goal}>🏆 Goal: {level.goal || "Keep progressing to the next level!"}</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 20 },
  headerContainer: { alignItems: 'center', marginBottom: 20 },
  levelTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFF', textShadowColor: 'rgba(0, 0, 0, 0.2)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 5 },
  tagline: { fontSize: 16, fontStyle: 'italic', color: '#FFF' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF', marginVertical: 15 },
  card: { backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: 15, borderRadius: 10, marginBottom: 15 },
  goalCard: { backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  description: { fontSize: 16, color: '#FFF', textAlign: 'center' },
  module: { fontSize: 16, color: '#FFF', marginBottom: 5 },
  tip: { fontSize: 16, color: '#FFF', marginBottom: 5 },
  goal: { fontSize: 18, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: 'red', fontWeight: 'bold' }
});

export default LevelScreen;
