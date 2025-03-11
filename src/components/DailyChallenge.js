import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { Audio } from "expo-av";
import { saveAttempt } from "../utils/attempts";
import { updateStreak } from "../utils/streak";

import challenges from '../data/challenges'; // Import your questions from challenges.js

const DailyChallenge = ({ challenge }) => {
  const [sound, setSound] = useState(null);
  const [answer, setAnswer] = useState(""); // State for the user's answer

  useEffect(() => {
    if (challenge.audio) {
      loadAudio();
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [challenge]);

  const loadAudio = async () => {
    const { sound } = await Audio.Sound.createAsync(challenge.audio);
    setSound(sound);
  };

  const playAudio = async () => {
    if (sound) {
      await sound.replayAsync();
    }
  };

  const handleStartChallenge = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "Please type your answer.");
      return;
    }

    // Debug: Log the challenge object to verify its structure
    console.log("Challenge object:", challenge);

    // Check if challenge.answer exists
    if (!challenge.answer) {
      Alert.alert("Error", "No correct answer found for this challenge.");
      return;
    }

    // Debug: Log the user's answer and the correct answer
    console.log("User answer:", answer);
    console.log("Correct answer:", challenge.answer);

    // Check if the answer is correct
    const isCorrect = answer.toLowerCase() === challenge.answer.toLowerCase();
    console.log("Is correct?", isCorrect);

    try {
      await saveAttempt(challenge.id, isCorrect ? "completed" : "failed");
      await updateStreak(isCorrect);

      // Show feedback based on the answer
      if (isCorrect) {
        showWinnerAnnouncement(100, "2:30", 3); // Example values for correct answer
      } else {
        Alert.alert("Incorrect", `The correct answer is: ${challenge.answer}`);
      }
    } catch (error) {
      console.error("Error saving attempt or updating streak:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const showWinnerAnnouncement = (score, timeTaken, streak) => {
    Alert.alert(
      "Congratulations! 🎉",
      `Score: ${score}\nTime Taken: ${timeTaken}\nStreak: ${streak}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Challenge</Text>
      <View style={styles.challengeCard}>
        {challenge.text && <Text style={styles.challengeText}>{challenge.text}</Text>}
        {challenge.image && <Image source={challenge.image} style={styles.challengeImage} />}
        {challenge.audio && (
          <TouchableOpacity style={styles.audioButton} onPress={playAudio}>
            <Text style={styles.audioButtonText}>Play Audio</Text>
          </TouchableOpacity>
        )}

        {/* Add a TextInput for the answer */}
        <TextInput
          placeholder="Type your answer here"
          value={answer}
          onChangeText={setAnswer}
          style={styles.input}
        />

        {/* Update the button text */}
        <TouchableOpacity style={styles.startButton} onPress={handleStartChallenge}>
          <Text style={styles.startButtonText}>Submit Daily Challenge</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  challengeCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  challengeText: {
    fontSize: 16,
    marginBottom: 10,
  },
  challengeImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  audioButton: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  audioButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default DailyChallenge;