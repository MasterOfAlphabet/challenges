// src/screens/WritingScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  Vibration
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { writingPrompts } from "../data/writingPrompts";

// Stub AI feedback function
const getAIFeedback = async (userText) => {
  return new Promise((resolve) => {
    setTimeout(() => {
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
  // State management
  const [gradeLevel, setGradeLevel] = useState("I/II");
  const [difficultyLevel, setDifficultyLevel] = useState("Rookie");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [userWriting, setUserWriting] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  
  // Progress tracking
  const [completedPrompts, setCompletedPrompts] = useState({
    "I/II": { Rookie: 0, Racer: 0, Master: 0, Prodigy: 0, Wizard: 0 },
    "III/V": { Rookie: 0, Racer: 0, Master: 0, Prodigy: 0, Wizard: 0 },
    "VI/X": { Rookie: 0, Racer: 0, Master: 0, Prodigy: 0, Wizard: 0 }
  });

  // Badges system
  const [badges, setBadges] = useState({
    "I/II": [],
    "III/V": [],
    "VI/X": []
  });

  // XP values for each level
  const levelXP = {
    "Rookie": 10,
    "Racer": 20,
    "Master": 35,
    "Prodigy": 50,
    "Wizard": 75
  };

  // Load a random prompt
  const loadPrompt = () => {
    const promptsForLevel = writingPrompts[gradeLevel]?.[difficultyLevel] || [];
    if (promptsForLevel.length === 0) {
      setCurrentPrompt("No prompts available for this level.");
      return;
    }
    const randomIndex = Math.floor(Math.random() * promptsForLevel.length);
    setCurrentPrompt(promptsForLevel[randomIndex]);
    setUserWriting("");
    setFeedback(null);
  };

  // Voice input handler
  const handleVoiceInput = async () => {
    if (isRecording) {
      await Speech.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    Speech.startRecognition(async (result) => {
      if (result.isFinal) {
        setUserWriting(prev => prev + (prev ? ' ' : '') + result.value);
        setIsRecording(false);
      }
    });
  };

  // Submit writing handler
  const handleSubmitWriting = async () => {
    if (!userWriting.trim()) {
      Alert.alert("Empty Writing", "Please write something first!");
      return;
    }
    
    const aiFeedback = await getAIFeedback(userWriting);
    setFeedback(aiFeedback);
    
    // Update completed prompts
    setCompletedPrompts(prev => ({
      ...prev,
      [gradeLevel]: {
        ...prev[gradeLevel],
        [difficultyLevel]: prev[gradeLevel][difficultyLevel] + 1
      }
    }));
    
    setScore(score + levelXP[difficultyLevel]);
  };

  // Badge award system
  useEffect(() => {
    const checkForBadge = () => {
      const totalPrompts = writingPrompts[gradeLevel]?.[difficultyLevel]?.length || 0;
      const completed = completedPrompts[gradeLevel]?.[difficultyLevel] || 0;
      
      if (completed >= totalPrompts && totalPrompts > 0 && !badges[gradeLevel].includes(difficultyLevel)) {
        Vibration.vibrate(500);
        Alert.alert(
          `🏆 ${difficultyLevel} Badge Earned!`,
          `You've completed all ${difficultyLevel} prompts for ${gradeLevel}!`
        );
        setBadges(prev => ({
          ...prev,
          [gradeLevel]: [...prev[gradeLevel], difficultyLevel]
        }));
      }
    };
    
    checkForBadge();
  }, [completedPrompts]);

  // Progress tracker component
  const ProgressTracker = () => {
    const totalPrompts = writingPrompts[gradeLevel]?.[difficultyLevel]?.length || 0;
    const completed = completedPrompts[gradeLevel]?.[difficultyLevel] || 0;
    
    return (
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Completed: {completed}/{totalPrompts} {difficultyLevel} prompts
        </Text>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill, 
            { width: `${Math.min((completed / totalPrompts) * 100, 100)}%` }
          ]}/>
        </View>
      </View>
    );
  };

  // Badge display component
  const BadgeDisplay = () => (
    <View style={styles.badgeContainer}>
      <Text style={styles.badgeTitle}>Your Badges:</Text>
      {Object.entries(badges).map(([grade, gradeBadges]) => (
        gradeBadges.length > 0 && (
          <View key={grade} style={styles.gradeBadges}>
            <Text style={styles.gradeText}>{grade}:</Text>
            <View style={styles.badgeRow}>
              {gradeBadges.map(badge => (
                <View key={badge} style={styles.badge}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ))}
            </View>
          </View>
        )
      ))}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✍️ Writing Module</Text>

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
        <Picker.Item label="Grades I/II" value="I/II" />
        <Picker.Item label="Grades III/V" value="III/V" />
        <Picker.Item label="Grades VI/X" value="VI/X" />
      </Picker>

      {/* Difficulty Level Picker */}
      <Text style={styles.label}>Select Difficulty:</Text>
      <Picker
        selectedValue={difficultyLevel}
        style={styles.picker}
        onValueChange={(value) => {
          setDifficultyLevel(value);
          setCurrentPrompt("");
          setUserWriting("");
          setFeedback(null);
        }}
      >
        <Picker.Item label="Rookie (10 XP)" value="Rookie" />
        <Picker.Item label="Racer (20 XP)" value="Racer" />
        <Picker.Item label="Master (35 XP)" value="Master" />
        <Picker.Item label="Prodigy (50 XP)" value="Prodigy" />
        <Picker.Item label="Wizard (75 XP)" value="Wizard" />
      </Picker>

      {/* Load Prompt Button */}
      <Button 
        title={`🎲 Load ${difficultyLevel} Prompt`} 
        onPress={loadPrompt} 
        color="#6a1b9a" 
      />

      {/* Progress Tracker */}
      <ProgressTracker />

      {/* Display Prompt */}
      {currentPrompt ? (
        <View style={styles.promptContainer}>
          <Text style={styles.promptTitle}>
            {difficultyLevel} Challenge:
          </Text>
          <Text style={styles.promptText}>{currentPrompt}</Text>
          <Text style={styles.xpText}>
            🎯 XP Reward: {levelXP[difficultyLevel]}
          </Text>
        </View>
      ) : (
        <Text style={styles.noPrompt}>No prompt loaded yet.</Text>
      )}

      {/* User Writing */}
      <Text style={styles.label}>Your Writing:</Text>
      
      {/* Voice Input */}
      <View style={styles.voiceContainer}>
        <Button
          title={isRecording ? "🎤 Stop Recording" : "🎤 Start Voice Input"}
          onPress={handleVoiceInput}
          color="#e91e63"
        />
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <Text style={styles.recordingText}>Listening... Speak now</Text>
          </View>
        )}
      </View>
      
      <TextInput
        style={styles.textArea}
        multiline
        numberOfLines={8}
        value={userWriting}
        onChangeText={setUserWriting}
        placeholder="Start writing here..."
        editable={!isRecording}
      />

      {/* Submit to AI */}
      <Button 
        title="📝 Get AI Feedback" 
        onPress={handleSubmitWriting} 
        disabled={!userWriting.trim()}
        color="#4caf50"
      />

      {/* Display Feedback */}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>🤖 AI Feedback:</Text>
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

      {/* Badges Display */}
      <BadgeDisplay />

      {/* Score */}
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>✨ Total XP: {score}</Text>
      </View>
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
    color: "#6a1b9a",
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  promptContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#6a1b9a",
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#6a1b9a",
  },
  promptText: {
    fontSize: 16,
    lineHeight: 22,
  },
  xpText: {
    marginTop: 8,
    fontStyle: "italic",
    color: "#4caf50",
    fontWeight: "bold",
  },
  noPrompt: {
    color: "gray",
    fontStyle: "italic",
    marginVertical: 10,
    textAlign: "center",
  },
  textArea: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 150,
    textAlignVertical: "top",
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
    lineHeight: 22,
  },
  feedbackContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#2196f3",
  },
  feedbackText: {
    fontSize: 16,
    marginVertical: 3,
    lineHeight: 22,
  },
  subTitle: {
    fontWeight: "bold",
    color: "#333",
  },
  suggestionText: {
    fontSize: 16,
    marginLeft: 10,
    lineHeight: 22,
    color: "#555",
  },
  scoreContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#4caf50",
  },
  score: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4caf50",
  },
  progressContainer: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3'
  },
  progressText: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500'
  },
  progressBar: {
    height: 10,
    backgroundColor: '#bbdefb',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196f3',
    borderRadius: 5
  },
  badgeContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff9800'
  },
  badgeTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff9800',
    fontSize: 16
  },
  gradeBadges: {
    marginVertical: 5
  },
  gradeText: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#333'
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  badge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  badgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold'
  },
  voiceContainer: {
    marginVertical: 10
  },
  recordingIndicator: {
    backgroundColor: '#fce4ec',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center'
  },
  recordingText: {
    color: '#e91e63',
    fontStyle: 'italic'
  }
});