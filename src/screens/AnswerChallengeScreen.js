import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function AnswerChallengeScreen() {
  const isLoggedIn = false; // TODO: Replace with actual auth check

  return (
    <View style={styles.container}>
      <Text style={styles.info}>User must login to submit the challenge</Text>

      <View style={styles.questionBox}>
        <Text style={styles.question}>Q: What is the correct spelling of "accommodation"?</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: isLoggedIn ? '#22c55e' : '#94a3b8' }]}
        disabled={!isLoggedIn}
      >
        <Text style={styles.submitButtonText}>Submit Challenge</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  info: { fontSize: 16, marginBottom: 20 },
  questionBox: { backgroundColor: '#e2e8f0', padding: 15, borderRadius: 8 },
  question: { fontSize: 16 },
  submitButton: { marginTop: 30, padding: 12, borderRadius: 8, alignItems: 'center' },
  submitButtonText: { color: 'white', fontWeight: 'bold' },
});
