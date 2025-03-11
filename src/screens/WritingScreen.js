// src/screens/WritingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { writingPrompts } from "../data/writingPrompts";

// Stub AI feedback function
const getAIFeedback = async (userText) => {
  // Simulate a call to an AI API
  // Replace this with a real request, e.g.:
  // const response = await fetch("YOUR_API_ENDPOINT", {
  //   method: "POST",
  //   body: JSON.stringify({ text: userText }),
  // });
  // const data = await response.json();
  // return data.feedback;

  return new Promise((resolve) => {
    setTimeout(() => {
      // Some basic “AI-like” feedback
      const feedback = {
        grammar: "Minor grammar mistakes found.",
        style: "Great style and flow!",
        creativity: "Impressive creativity. Keep it up!",
        suggestions: [
          "Consider adding more details to the setting.",
          "Vary sentence length for better pacing.",
        ],
      };
      resolve(feedback);
    }, 1500);
  });
};

export default function WritingScreen() {
  const [gradeLevel, setGradeLevel] = useState("I/II");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [userWriting, setUserWriting] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  // Load a random prompt
  const loadPrompt = () => {
    const promptsForLevel = writingPrompts[gradeLevel] || [];
    if (promptsForLevel.length === 0) {
      setCurrentPrompt("No prompts available for this level.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * promptsForLevel.length);
    setCurrentPrompt(promptsForLevel[randomIndex]);
    setUserWriting("");
    setFeedback(null);
  };

  // Submit writing to AI for feedback
  const handleSubmitWriting = async () => {
    if (!userWriting.trim()) {
      Alert.alert("Empty Writing", "Please write something first!");
      return;
    }
    // Call the AI feedback stub
    const aiFeedback = await getAIFeedback(userWriting);
    setFeedback(aiFeedback);
    // Example scoring
    setScore(score + 10);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Writing Module</Text>

      {/* Grade Level Picker */}
      <Text style={styles.label}>Select Grade Level:</Text>
      <Picker
        selectedValue={gradeLevel}
        style={styles.picker}
        onValueChange={(value) => {
          setGradeLevel(value);
          setCurrentPrompt("");
          setUserWriting("");
          setFeedback(null);
        }}
      >
        <Picker.Item label="I/II" value="I/II" />
        <Picker.Item label="III/V" value="III/V" />
        <Picker.Item label="VI/X" value="VI/X" />
      </Picker>

      {/* Load Prompt Button */}
      <Button title="Load Prompt" onPress={loadPrompt} />

      {/* Display Prompt */}
      {currentPrompt ? (
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>Your Prompt:</Text>
          <Text style={styles.promptText}>{currentPrompt}</Text>
        </View>
      ) : (
        <Text style={styles.noPrompt}>No prompt loaded yet.</Text>
      )}

      {/* User Writing */}
      <Text style={styles.label}>Your Writing:</Text>
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={8}
        value={userWriting}
        onChangeText={setUserWriting}
        placeholder="Start writing here..."
      />

      {/* Submit to AI */}
      <Button title="Get AI Feedback" onPress={handleSubmitWriting} />

      {/* Display Feedback */}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>AI Feedback:</Text>
          <Text style={styles.feedbackText}>
            <Text style={styles.subTitle}>Grammar:</Text> {feedback.grammar}
          </Text>
          <Text style={styles.feedbackText}>
            <Text style={styles.subTitle}>Style:</Text> {feedback.style}
          </Text>
          <Text style={styles.feedbackText}>
            <Text style={styles.subTitle}>Creativity:</Text> {feedback.creativity}
          </Text>
          <Text style={styles.feedbackText}>
            <Text style={styles.subTitle}>Suggestions:</Text>
          </Text>
          {feedback.suggestions?.map((item, index) => (
            <Text key={index} style={styles.suggestionText}>
              - {item}
            </Text>
          ))}
        </View>
      )}

      {/* Score */}
      <Text style={styles.score}>Score: {score}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 20,
    alignSelf: "center",
  },
  promptContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  promptText: {
    fontSize: 16,
  },
  noPrompt: {
    color: "gray",
    fontStyle: "italic",
    marginVertical: 10,
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  feedbackContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 16,
    marginVertical: 3,
  },
  subTitle: {
    fontWeight: "bold",
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  score: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
