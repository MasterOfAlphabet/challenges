// TeacherDashboard.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-paper';

export default function TeacherDashboard({ route, navigation }) {
  const [latestChallenge, setLatestChallenge] = useState(null);

  useEffect(() => {
    if (route.params?.newChallenge) {
      setLatestChallenge(route.params.newChallenge);
    }
  }, [route.params]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Teacher's Profile Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.heading}>Teacher's Profile</Text>
          <Text>Name: John Doe</Text>
          <Text>Experience: 10 years</Text>
          <Text>Skills: Mathematics, Physics, Programming</Text>
        </Card.Content>
      </Card>

      <Button
  mode="contained"
  onPress={() => navigation.navigate('Challenges', { 
    screen: 'ChallengeCreation' 
  })}
  style={styles.submitButton}
>
  Submit Challenge
</Button>
      {/* If we have a new challenge, show it */}
      {latestChallenge && (
        <Card style={styles.card}>
          <Card.Title title="Latest Challenge" />
          <Card.Content>
            <Text>Challenge Name: {latestChallenge.name}</Text>
            <Text>Challenge Type: {latestChallenge.type}</Text>
            <Text>Start Date: {latestChallenge.startDate}</Text>
            <Text>End Date: {latestChallenge.endDate}</Text>
            <Text>Class: {latestChallenge.class}</Text>
            <Text>Module: {latestChallenge.module}</Text>
            <Text>Question Type: {latestChallenge.questionType}</Text>

            <Text style={{ marginTop: 8 }}>
              Question: {latestChallenge.questionData?.questionText}
            </Text>

            {/* If multiple choice, show the options */}
            {latestChallenge.questionType === 'Multiple Choice' && (
              <>
                {latestChallenge.questionData?.options?.map((opt, idx) => (
                  <Text key={idx}>
                    Option {String.fromCharCode(65 + idx)}: {opt}
                  </Text>
                ))}
                <Text>
                  Correct Option: {latestChallenge.questionData?.correctOption}
                </Text>
              </>
            )}

            {/* If fill in blank or T/F, show correctAnswer */}
            {latestChallenge.questionType !== 'Multiple Choice' && (
              <Text>
                Correct Answer: {latestChallenge.questionData?.correctAnswer}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  submitButton: {
    marginBottom: 16,
  },
});
