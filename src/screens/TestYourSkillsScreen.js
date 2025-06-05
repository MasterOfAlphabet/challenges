import React, { useState, useEffect, useRef, useContext } from "react";
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
import { AuthContext } from "../../App";
import { allQuestions } from "../data/testYourSkillsQuestionsData";
import { firestore } from "../../firebase"; // Import Firestore
import { collection, addDoc } from "firebase/firestore"; // Firestore functions

export default function TestYourSkills({ navigation }) {
  const { loggedInUser } = useContext(AuthContext);
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedClass, setSelectedClass] = useState("I");
  const [selectedCategory, setSelectedCategory] = useState("Dictation");
  const [selectedSharpCategory, setSelectedSharpCategory] = useState("Synonyms");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [moduleScores, setModuleScores] = useState({});

  // We’ll store the “previous” dropdown selections in refs,
  // so we can revert if user cancels the prompt
  const prevModuleRef = useRef(selectedModule);
  const prevClassRef = useRef(selectedClass);
  const prevCategoryRef = useRef(selectedCategory);
  const prevSharpCategoryRef = useRef(selectedSharpCategory);

  const hasAttemptedQuizzes = Object.values(moduleScores).some(
    (score) => score !== undefined
  );

  // ==============================
  // === Helper to build scoreKey
  // ==============================
  function getScoreKey() {
    // For Spelling or SHARP, we have categories
    if (selectedModule === "Spelling") {
      // e.g. "Spelling-I-Dictation"
      return [selectedModule, selectedClass, selectedCategory].join("-");
    } else if (selectedModule === "SHARP") {
      // e.g. "SHARP-I-Synonyms"
      return [selectedModule, selectedClass, selectedSharpCategory].join("-");
    } else {
      // e.g. "Reading-I"
      return [selectedModule, selectedClass].join("-");
    }
  }

  // ============================
  // === Start Quiz
  // ============================
  const startQuiz = () => {
    let selectedQuestions = [];
    if (selectedModule === "Spelling") {
      if (selectedCategory === "All-In-One") {
        const dictationQuestions =
          allQuestions.Spelling[selectedClass].Dictation.slice(0, 5);
        const unscrambleQuestions =
          allQuestions.Spelling[selectedClass].Unscramble.slice(0, 5);
        const missingLettersQuestions =
          allQuestions.Spelling[selectedClass].MissingLetters.slice(0, 5);
        const correctlySpelledWordQuestions =
          allQuestions.Spelling[selectedClass].CorrectlySpelledWord.slice(0, 5);
        selectedQuestions = [
          ...dictationQuestions,
          ...unscrambleQuestions,
          ...missingLettersQuestions,
          ...correctlySpelledWordQuestions,
        ].sort(() => Math.random() - 0.5);
      } else {
        selectedQuestions =
          allQuestions.Spelling[selectedClass][selectedCategory] || [];
      }
    } else if (selectedModule === "SHARP") {
      if (selectedSharpCategory === "All-In-One") {
        const synonymsQuestions =
          allQuestions.SHARP[selectedClass].Synonyms.slice(0, 5);
        const homonymsQuestions =
          allQuestions.SHARP[selectedClass].Homonyms.slice(0, 5);
        const antonymsQuestions =
          allQuestions.SHARP[selectedClass].Antonyms.slice(0, 5);
        const rhymingWordsQuestions =
          allQuestions.SHARP[selectedClass].RhymingWords.slice(0, 5);
        const pluralQuestions =
          allQuestions.SHARP[selectedClass].Plural.slice(0, 5);
        selectedQuestions = [
          ...synonymsQuestions,
          ...homonymsQuestions,
          ...antonymsQuestions,
          ...rhymingWordsQuestions,
          ...pluralQuestions,
        ].sort(() => Math.random() - 0.5);
      } else {
        selectedQuestions =
          allQuestions.SHARP[selectedClass][selectedSharpCategory] || [];
      }
    } else if (selectedModule === "8-in-1") {
      // Fetch questions from all modules for the selected class
      selectedQuestions = Object.values(allQuestions)
        .flatMap((module) => module[selectedClass] || [])
        .sort(() => Math.random() - 0.5)
        .slice(0, 10); // Limit to 10 questions for the quiz
    } else {
      selectedQuestions = allQuestions[selectedModule]?.[selectedClass] || [];
    }

    if (!selectedQuestions || selectedQuestions.length === 0) {
      Alert.alert("No questions available for this module and class.");
      return;
    }

    setQuestions(selectedQuestions);
    setQuizStarted(true);
    setQuizEnded(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(10);
  };

  // ================================
  // === Save Score to Firestore
  // ================================
  const saveScoreToFirestore = async (finalScore, totalQuestions) => {
    try {
      const scoreData = {
        userId: loggedInUser.uid,
        date: new Date().toISOString(),
        class: selectedClass,
        module: selectedModule,
        score: finalScore,
        totalQuestions: totalQuestions,
      };

      // Add category only if the module has categories (Spelling or SHARP)
      if (selectedModule === "Spelling") {
        scoreData.category = selectedCategory;
      } else if (selectedModule === "SHARP") {
        scoreData.category = selectedSharpCategory;
      }

      await addDoc(collection(db, "testScores"), scoreData);
      console.log("Score saved to Firestore");
    } catch (error) {
      console.error("Error saving score to Firestore:", error);
    }
  };

  // ================================
  // === Handle Quiz End
  // ================================
  const handleQuizEnd = (finalScore) => {
    const totalQuestions = questions.length;
    saveScoreToFirestore(finalScore, totalQuestions); // Save score to Firestore
    Alert.alert("Quiz Over", `Your score: ${finalScore}/${totalQuestions}`);
  };

  // ================================
  // === handleAnswer
  // ================================
  const handleAnswer = (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(10);
    } else {
      // End of quiz
      setQuizEnded(true);
      const finalScore =
        score + (answer === questions[currentQuestionIndex].correctAnswer ? 1 : 0);
      handleQuizEnd(finalScore); // Handle quiz end
    }
  };

  // ================================
  // === Timer
  // ================================
  useEffect(() => {
    if (!quizStarted || quizEnded) return;
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswer(null);
    }
  }, [timeLeft, quizStarted, quizEnded]);

  // ================================
  // === Spelling "Dictation" TTS
  // ================================
  useEffect(() => {
    if (
      quizStarted &&
      !quizEnded &&
      selectedModule === "Spelling" &&
      questions[currentQuestionIndex]?.word
    ) {
      Speech.speak(questions[currentQuestionIndex].word);
    }
  }, [currentQuestionIndex, quizStarted, quizEnded, selectedModule]);

  // ================================
  // === Confirm Abandon Quiz
  // ================================
  function confirmAbandon(newValue, setState, prevRef) {
    Alert.alert(
      "Abandon Current Quiz?",
      "You're in the middle of a quiz. Changing the dropdown will start a new quiz. Proceed?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            // revert to old value
            setState(prevRef.current);
          },
        },
        {
          text: "Yes",
          onPress: () => {
            // accept new value, reset quiz
            prevRef.current = newValue; // update the ref
            setState(newValue);
            // reset quiz states
            setQuizStarted(false);
            setQuizEnded(false);
            setQuestions([]);
            setCurrentQuestionIndex(0);
            setScore(0);
            setTimeLeft(10);
          },
        },
      ]
    );
  }

  // ================================
  // === Handle Module Change
  // ================================
  function handleModuleChange(newModule) {
    // If quiz is ongoing, ask user if they want to abandon
    if (quizStarted && !quizEnded) {
      confirmAbandon(newModule, setSelectedModule, prevModuleRef);
    } else {
      // otherwise, just set it
      prevModuleRef.current = newModule;
      setSelectedModule(newModule);
    }
  }

  // Similarly for class, category, sharp category
  function handleClassChange(newClass) {
    if (quizStarted && !quizEnded) {
      confirmAbandon(newClass, setSelectedClass, prevClassRef);
    } else {
      prevClassRef.current = newClass;
      setSelectedClass(newClass);
    }
  }

  function handleSpellingCategoryChange(newCat) {
    if (quizStarted && !quizEnded) {
      confirmAbandon(newCat, setSelectedCategory, prevCategoryRef);
    } else {
      prevCategoryRef.current = newCat;
      setSelectedCategory(newCat);
    }
  }

  function handleSharpCategoryChange(newCat) {
    if (quizStarted && !quizEnded) {
      confirmAbandon(newCat, setSelectedSharpCategory, prevSharpCategoryRef);
    } else {
      prevSharpCategoryRef.current = newCat;
      setSelectedSharpCategory(newCat);
    }
  }

  // ================================
  // === Render
  // ================================
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Test Your Skills</Text>

      {/* Add "Your Test Skills Score History" button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate("TestSkillsHistory")}
      >
        <Text style={styles.historyButtonText}>Your Test Skills Score History</Text>
      </TouchableOpacity>

      {/* Score Container */}
      <View style={styles.scoreContainer}>
        {hasAttemptedQuizzes ? (
          Object.keys(moduleScores).map((key) => {
            const [module, classLevel, category] = key.split("-");
            if (module === "Spelling") {
              return (
                <View key={key} style={styles.moduleScoreContainer}>
                  <Text style={styles.moduleScore}>
                    {module} - {classLevel}
                  </Text>
                  <Text style={styles.categoryScore}>
                    {category}: {moduleScores[key]} out of{" "}
                    {category === "All-In-One" ? 20 : 10}
                  </Text>
                </View>
              );
            } else if (module === "SHARP") {
              return (
                <View key={key} style={styles.moduleScoreContainer}>
                  <Text style={styles.moduleScore}>
                    {module} - {classLevel}
                  </Text>
                  <Text style={styles.categoryScore}>
                    {category}: {moduleScores[key]} out of{" "}
                    {category === "All-In-One" ? 25 : 10}
                  </Text>
                </View>
              );
            } else {
              return (
                <View key={key} style={styles.moduleScoreContainer}>
                  <Text style={styles.moduleScore}>
                    {module} - {classLevel}: {moduleScores[key]} out of{" "}
                    {moduleScores[key] === 20 ? 20 : 10}
                  </Text>
                </View>
              );
            }
          })
        ) : (
          <Text style={styles.welcomeMessage}>
            Hey, your score will appear after you attempt a quiz. Let's go!
          </Text>
        )}
      </View>

      {/* Module Picker */}
      <Picker
        selectedValue={selectedModule}
        onValueChange={handleModuleChange}
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

      {/* Class Picker */}
      <Picker
        selectedValue={selectedClass}
        onValueChange={handleClassChange}
        style={styles.dropdown}
      >
        <Picker.Item label="Class I" value="I" />
        <Picker.Item label="Class II" value="II" />
      </Picker>

      {/* Spelling Category Picker */}
      {selectedModule === "Spelling" && (
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleSpellingCategoryChange}
          style={styles.dropdown}
        >
          <Picker.Item label="Dictation" value="Dictation" />
          <Picker.Item label="Unscramble" value="Unscramble" />
          <Picker.Item label="Missing Letters" value="MissingLetters" />
          <Picker.Item
            label="Correctly Spelled Word"
            value="CorrectlySpelledWord"
          />
          <Picker.Item label="All-In-One" value="All-In-One" />
        </Picker>
      )}

      {/* SHARP Category Picker */}
      {selectedModule === "SHARP" && (
        <Picker
          selectedValue={selectedSharpCategory}
          onValueChange={handleSharpCategoryChange}
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

      {/* Start Quiz Button */}
      {!quizStarted ? (
        <TouchableOpacity style={styles.button} onPress={startQuiz}>
          <Text style={styles.buttonText}>Start Quiz</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* If quiz is ongoing */}
          {questions.length > 0 && !quizEnded ? (
            <>
              <Text style={styles.question}>
                {questions[currentQuestionIndex]?.question}
              </Text>

              {/* If Spelling => replay TTS button */}
              {selectedModule === "Spelling" &&
                questions[currentQuestionIndex]?.type === "Dictation" &&
                questions[currentQuestionIndex]?.word && (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={() =>
                      Speech.speak(questions[currentQuestionIndex].word)
                    }
                  >
                    <Text style={styles.audioButtonText}>Replay Audio</Text>
                  </TouchableOpacity>
                )}

              <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
              {questions[currentQuestionIndex]?.options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(idx)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text>No questions available.</Text>
          )}

          {quizEnded && (
            <>
              <Text style={styles.score}>
                Your Score: {score}/{questions.length}
              </Text>
              <TouchableOpacity style={styles.button} onPress={startQuiz}>
                <Text style={styles.buttonText}>Restart Quiz</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </ScrollView>
  );
}


// ========================
// ======== STYLES ========
// ========================
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
  historyButton: {
    padding: 15,
    backgroundColor: "#28a745",
    borderRadius: 5,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  historyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  moduleScoreContainer: {
    marginBottom: 10,
  },
  moduleScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryScore: {
    fontSize: 14,
    marginLeft: 10,
    color: "#555",
  },
  welcomeMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    fontStyle: "italic",
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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  audioButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginBottom: 20,
  },
  audioButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  timer: {
    fontSize: 16,
    marginBottom: 10,
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
  },
  score: {
    fontSize: 16,
    marginTop: 10,
  },
});
