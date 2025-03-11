import React, { useState, useEffect, useContext } from "react"; // Add useContext here
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";

import { AuthContext } from "../../App"; // Import AuthContext
import { allQuestions } from "../data/testYourSkillsQuestionsData";

export default function PracticeSkillsScreen() {

  const { loggedInUser } = useContext(AuthContext); // Get loggedInUser from AuthContext

  // ========================
  // === Role Check ===
  // ========================
  useEffect(() => {
    if (loggedInUser?.role !== "Student") {
      Alert.alert(
        "Access Denied",
        "This feature is only available for students.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [loggedInUser]);

  // If the user is not a Student, show a message and don't render the screen
  if (loggedInUser?.role !== "Student") {
    return (
      <View style={styles.container}>
        <Text style={styles.accessDeniedText}>
          This feature is only available for students.
        </Text>
      </View>
    );
  }

  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedClass, setSelectedClass] = useState("I");
  const [selectedCategory, setSelectedCategory] = useState("Dictation");
  const [selectedSharpCategory, setSelectedSharpCategory] = useState("Synonyms");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [score, setScore] = useState(0);

  // Load questions automatically when dropdown values change
  useEffect(() => {
    if (isPracticing) {
      loadQuestions();
    }
  }, [selectedModule, selectedClass, selectedCategory, selectedSharpCategory]);

  // Speak the word for Dictation questions
  useEffect(() => {
    if (
      isPracticing &&
      selectedModule === "Spelling" &&
      questions[currentQuestionIndex]?.type === "Dictation" &&
      questions[currentQuestionIndex]?.word
    ) {
      Speech.speak(questions[currentQuestionIndex].word);
    }
  }, [currentQuestionIndex, isPracticing, selectedModule]);

  const loadQuestions = () => {
    let selectedQuestions = [];
    if (selectedModule === "Spelling") {
      if (selectedCategory === "All-In-One") {
        const dictationQuestions = allQuestions.Spelling[selectedClass].Dictation.slice(0, 5);
        const unscrambleQuestions = allQuestions.Spelling[selectedClass].Unscramble.slice(0, 5);
        const missingLettersQuestions = allQuestions.Spelling[selectedClass].MissingLetters.slice(0, 5);
        const correctlySpelledWordQuestions = allQuestions.Spelling[selectedClass].CorrectlySpelledWord.slice(0, 5);
        selectedQuestions = [
          ...dictationQuestions,
          ...unscrambleQuestions,
          ...missingLettersQuestions,
          ...correctlySpelledWordQuestions,
        ].sort(() => Math.random() - 0.5);
      } else {
        selectedQuestions = allQuestions.Spelling[selectedClass][selectedCategory] || [];
      }
    } else if (selectedModule === "SHARP") {
      if (selectedSharpCategory === "All-In-One") {
        const synonymsQuestions = allQuestions.SHARP[selectedClass].Synonyms.slice(0, 5);
        const homonymsQuestions = allQuestions.SHARP[selectedClass].Homonyms.slice(0, 5);
        const antonymsQuestions = allQuestions.SHARP[selectedClass].Antonyms.slice(0, 5);
        const rhymingWordsQuestions = allQuestions.SHARP[selectedClass].RhymingWords.slice(0, 5);
        const pluralQuestions = allQuestions.SHARP[selectedClass].Plural.slice(0, 5);
        selectedQuestions = [
          ...synonymsQuestions,
          ...homonymsQuestions,
          ...antonymsQuestions,
          ...rhymingWordsQuestions,
          ...pluralQuestions,
        ].sort(() => Math.random() - 0.5);
      } else {
        selectedQuestions = allQuestions.SHARP[selectedClass][selectedSharpCategory] || [];
      }
    } else if (selectedModule === "8-in-1") {
      selectedQuestions = Object.values(allQuestions)
        .flatMap((module) => module[selectedClass] || [])
        .sort(() => Math.random() - 0.5);
    } else {
      selectedQuestions = allQuestions[selectedModule]?.[selectedClass] || [];
    }

    if (!selectedQuestions || selectedQuestions.length === 0) {
      Alert.alert("No questions available for this module and class.");
      return;
    }
    setQuestions(selectedQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsPracticing(true);
    setScore(0); // Reset score when starting a new practice session
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) {
      Alert.alert("Please select an answer before checking.");
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1); // Increment score for correct answers
      Alert.alert("Correct!", "Great job! You got it right! 🎉", [
        {
          text: "Next",
          onPress: () => handleNextQuestion(),
        },
      ]);
    } else {
      Alert.alert(
        "Incorrect",
        `Oops! The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}. ${currentQuestion.explanation || "Try again!"}`,
        [
          {
            text: "Next",
            onPress: () => handleNextQuestion(),
          },
        ]
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Practice session is over
      setIsPracticing(false);
      const percentage = (score / questions.length) * 100;
      let feedback = "";
      if (percentage >= 80) {
        feedback = "You learned the concept well! 🎉";
      } else if (percentage >= 50) {
        feedback = "Good effort! Keep practicing! 💪";
      } else {
        feedback = "Practice more to improve! 📚";
      }
      Alert.alert(
        "Practice Complete",
        `Your score: ${score}/${questions.length}\n${feedback}`
      );
    }
  };

  const replayAudio = () => {
    if (
      selectedModule === "Spelling" &&
      questions[currentQuestionIndex]?.type === "Dictation" &&
      questions[currentQuestionIndex]?.word
    ) {
      Speech.speak(questions[currentQuestionIndex].word);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Practice Your Skills</Text>

      <Picker
        selectedValue={selectedModule}
        onValueChange={(itemValue) => {
          setSelectedModule(itemValue);
          setIsPracticing(false); // Reset practice session when module changes
        }}
        style={styles.dropdown}
      >
        <Picker.Item label="Spelling" value="Spelling" />
        <Picker.Item label="Reading" value="Reading" />
        <Picker.Item label="Pronunciation" value="Pronunciation" />
        <Picker.Item label="Grammar" value="Grammar" />
        <Picker.Item label="Writing" value="Writing" />
        <Picker.Item label="Listening" value="Listening" />
        <Picker.Item label="Vocabulary" value="Vocabulary" />
        <Picker.Item label="SHARP" value="SHARP" />
        <Picker.Item label="8-in-1" value="8-in-1" />
      </Picker>

      <Picker
        selectedValue={selectedClass}
        onValueChange={(itemValue) => {
          setSelectedClass(itemValue);
          setIsPracticing(false); // Reset practice session when class changes
        }}
        style={styles.dropdown}
      >
        <Picker.Item label="Class I" value="I" />
        <Picker.Item label="Class II" value="II" />
      </Picker>

      {selectedModule === "Spelling" && (
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            setIsPracticing(false); // Reset practice session when category changes
          }}
          style={styles.dropdown}
        >
          <Picker.Item label="Dictation" value="Dictation" />
          <Picker.Item label="Unscramble" value="Unscramble" />
          <Picker.Item label="Missing Letters" value="MissingLetters" />
          <Picker.Item label="Correctly Spelled Word" value="CorrectlySpelledWord" />
          <Picker.Item label="All-In-One" value="All-In-One" />
        </Picker>
      )}

      {selectedModule === "SHARP" && (
        <Picker
          selectedValue={selectedSharpCategory}
          onValueChange={(itemValue) => {
            setSelectedSharpCategory(itemValue);
            setIsPracticing(false); // Reset practice session when SHARP category changes
          }}
          style={styles.dropdown}
        >
          <Picker.Item label="Synonyms" value="Synonyms" />
          <Picker.Item label="Homonyms" value="Homonyms" />
          <Picker.Item label="Antonyms" value="Antonyms" />
          <Picker.Item label="Rhyming Words" value="RhymingWords" />
          <Picker.Item label="Plural" value="Plural" />
          <Picker.Item label="All-In-One" value="All-In-One" />
        </Picker>
      )}

      {!isPracticing ? (
        <TouchableOpacity style={styles.button} onPress={loadQuestions}>
          <Text style={styles.buttonText}>Start Practicing</Text>
        </TouchableOpacity>
      ) : (
        <>
          <Text style={styles.question}>
            {questions[currentQuestionIndex]?.question}
          </Text>
          {selectedModule === "Spelling" &&
            questions[currentQuestionIndex]?.type === "Dictation" &&
            questions[currentQuestionIndex]?.word && (
              <TouchableOpacity style={styles.audioButton} onPress={replayAudio}>
                <Text style={styles.audioButtonText}>Replay Audio</Text>
              </TouchableOpacity>
            )}
          {questions[currentQuestionIndex]?.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.optionButton,
                selectedAnswer === idx && styles.selectedOptionButton,
              ]}
              onPress={() => setSelectedAnswer(idx)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckAnswer}>
            <Text style={styles.buttonText}>Check Answer</Text>
          </TouchableOpacity>
          <Text style={styles.practicingLabel}>Practicing...</Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fff",
    marginBottom: 20,
    width: "100%",
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  checkButton: {
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  audioButton: {
    padding: 10,
    backgroundColor: "#ffc107",
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: "#007bff",
  },
  optionText: {
    fontSize: 16,
  },
  practicingLabel: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
    color: "#555",
  },
});