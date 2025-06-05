import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Accordion, Button } from 'react-native-paper';
import { firestore, auth } from '../../firebase'; // Import Firebase initialization
import { List} from 'react-native-paper'; // Use List.Accordion instead of Accordio
import { signInAnonymously } from 'firebase/auth';
import { collection, query, where, limit, getDocs, addDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Picker } from "@react-native-picker/picker";

// List of 10 questions for each module
const allQuestions = {
  Spelling: [
    { question: "Spell the word 'happy'.", options: ["hapy", "happy", "happi"], correctAnswer: 1 },
    { question: "Spell the word 'elephant'.", options: ["elefant", "elephunt", "elephant"], correctAnswer: 2 },
  { question: "Spell the word 'challenge' within 5 seconds.", options: ["challenge", "chalenge", "challange"], correctAnswer: 0, challenge: "Spell the word correctly within 5 seconds." },
  { question: "Spell the word 'accommodation'.", options: ["acommodation", "accomodation", "accommodation"], correctAnswer: 2 },
  { question: "Spell the word 'necessary'.", options: ["neccessary", "necessary", "necessery"], correctAnswer: 1 },
  { question: "Spell the word 'recommend'.", options: ["reccommend", "recommend", "recomend"], correctAnswer: 1 },
    { question: "Spell the word 'definitely'.", options: ["definately", "definitely", "definatly"], correctAnswer: 1 },
    { question: "Spell the word 'separate'.", options: ["seperate", "separate", "separete"], correctAnswer: 1 },
    { question: "Spell the word 'embarrass'.", options: ["embarass", "embarrass", "embarras"], correctAnswer: 1 },
    { question: "Spell the word 'millennium'.", options: ["millenium", "millennium", "milenium"], correctAnswer: 1 },
  ],
  Reading: [
    { question: "What is the main idea of the passage?", options: ["Option 1", "Option 2", "Option 3"], correctAnswer: 0 },
    { question: "What is the author's purpose?", options: ["Option 1", "Option 2", "Option 3"], correctAnswer: 1 },
    { question: "Identify the tone of the passage.", options: ["Happy", "Sad", "Neutral"], correctAnswer: 2, challenge: "Determine the tone of the passage." },
  ],
  Pronunciation: [
    { question: "Pronounce the word 'library'.", options: ["lib-rary", "lie-berry", "li-brary"], correctAnswer: 0 },
    { question: "Pronounce the word 'February'.", options: ["Feb-roo-ary", "Feb-yoo-ary", "Feb-ru-ary"], correctAnswer: 2 },
    { question: "Pronounce the word 'colonel'.", options: ["co-lo-nel", "ker-nel", "col-on-el"], correctAnswer: 1, challenge: "Pronounce the word correctly." },
  ],
  Grammar: [
    { question: "Which sentence is correct?", options: ["She go to school.", "She goes to school.", "She going to school."], correctAnswer: 1 },
    { question: "What is the past tense of 'run'?", options: ["ran", "runned", "running"], correctAnswer: 0 },
    { question: "Identify the correct sentence.", options: ["She don't like apples.", "She doesn't like apples.", "She doesn't likes apples."], correctAnswer: 1, challenge: "Choose the grammatically correct sentence." },
  ],
  Writing: [
    { question: "Which sentence is properly punctuated?", options: ["I love apples.", "I love apples", "I love apples!"], correctAnswer: 0 },
    { question: "What is the plural of 'child'?", options: ["childs", "children", "childes"], correctAnswer: 1 },
    { question: "Which sentence is correctly capitalized?", options: ["i love New York.", "I love new york.", "I love New York."], correctAnswer: 2, challenge: "Choose the correctly capitalized sentence." },
  ],
  Listening: [
    { question: "What did you hear?", options: ["Option 1", "Option 2", "Option 3"], correctAnswer: 0 },
    { question: "What was the main topic?", options: ["Option 1", "Option 2", "Option 3"], correctAnswer: 1 },
    { question: "Identify the speaker's emotion.", options: ["Happy", "Sad", "Angry"], correctAnswer: 1, challenge: "Determine the speaker's emotion." },
  ],
  Vocabulary: [
    { question: "What is the synonym of 'happy'?", options: ["sad", "joyful", "angry"], correctAnswer: 1 },
    { question: "What is the antonym of 'hot'?", options: ["cold", "warm", "boiling"], correctAnswer: 0 },
    { question: "What is the meaning of 'benevolent'?", options: ["Kind", "Cruel", "Indifferent"], correctAnswer: 0, challenge: "Choose the correct meaning of the word." },
  ],
  SHARP: [
    { question: "What is the synonym of 'big'?", options: ["small", "large", "tiny"], correctAnswer: 1 },
    { question: "What is the plural of 'mouse'?", options: ["mouses", "mice", "mousees"], correctAnswer: 1 },
    { question: "What is the past tense of 'swim'?", options: ["swam", "swum", "swimmed"], correctAnswer: 0, challenge: "Choose the correct past tense." },
  ],
};

const QuizBattles = () => {
  const [user, setUser] = useState(null);
  const [battle, setBattle] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [battleEnded, setBattleEnded] = useState(false);
  const [selectedModule, setSelectedModule] = useState("Spelling"); // Dropdown state

  // Initialize Firebase Auth
  useEffect(() => {
    const anonymousLogin = async () => {
      try {
        const { user } = await signInAnonymously(auth);
        setUser(user);
      } catch (error) {
        console.error("Anonymous login failed:", error);
      }
    };
    anonymousLogin();
  }, []);

  // Find or create a battle
  const findBattle = async () => {
    try {
      const battlesRef = collection(db, "battles");
      const q = query(battlesRef, where("status", "==", "waiting"), limit(1));
      const availableBattle = await getDocs(q);

      if (!availableBattle.empty) {
        // Join an existing battle
        console.log("Joining existing battle...");
        const battleDoc = availableBattle.docs[0];
        const battleData = battleDoc.data();
        setBattle({ id: battleDoc.id, ...battleData });

        await updateDoc(doc(db, "battles", battleDoc.id), {
          player2: user.uid,
          status: "ongoing",
        });
      } else {
        // Create a new battle
        console.log("Creating new battle...");
        const newQuestions = getRandomQuestions(2); // Get 2 random questions
        if (newQuestions.length === 0) {
          Alert.alert("No more questions available.");
          return;
        }
        const newBattle = {
          player1: user.uid,
          player2: null,
          status: "waiting",
          questions: newQuestions,
          scores: { [user.uid]: 0 },
          createdAt: new Date(),
        };
        const battleRef = await addDoc(collection(db, "battles"), newBattle);
        setBattle({ id: battleRef.id, ...newBattle });
        setUsedQuestions((prev) => [...prev, ...newQuestions]); // Track used questions
      }
    } catch (error) {
      console.error("Error finding/creating battle:", error);
    }
  };

  // Get 2 random questions from the selected module or all modules
  const getRandomQuestions = (count) => {
    let availableQuestions = [];
    if (selectedModule === "8-in-1") {
      // Combine questions from all modules
      Object.values(allQuestions).forEach((moduleQuestions) => {
        availableQuestions = [...availableQuestions, ...moduleQuestions];
      });
    } else {
      // Use questions from the selected module
      availableQuestions = allQuestions[selectedModule];
    }

    // Filter out used questions
    availableQuestions = availableQuestions.filter(
      (q) => !usedQuestions.includes(q)
    );

    const shuffled = availableQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Start the quiz battle
  useEffect(() => {
    if (battle) {
      console.log("Setting up Firestore listener...");
      const battleRef = doc(db, "battles", battle.id);
      const unsubscribe = onSnapshot(battleRef, (doc) => {
        if (doc.exists()) {
          console.log("Battle data:", doc.data());
          const battleData = doc.data();
          if (battleData.status === "ongoing") {
            console.log("Questions:", battleData.questions);
            setQuestions(battleData.questions);
            setOpponentScore(battleData.scores[battleData.player2] || 0);
          }
        } else {
          console.log("Battle document does not exist.");
        }
      }, (error) => {
        console.error("Firestore listener error:", error);
      });

      return () => unsubscribe();
    }
  }, [battle]);

  // Handle answer selection
  const handleAnswer = async (answer) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore((prev) => prev + 1);
    }

    // Update score in Firestore
    const battleRef = doc(db, "battles", battle.id);
    await updateDoc(battleRef, {
      [`scores.${user.uid}`]: score,
    });

    // Move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(10);
    } else {
      // End of battle
      setBattleEnded(true);
      Alert.alert("Battle Over", `Your score: ${score}\nOpponent's score: ${opponentScore}`);
    }
  };

  // Timer for each question
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleAnswer(null); // Auto-submit if time runs out
    }
  }, [timeLeft]);

  // Reset battle state for a new battle
  const resetBattle = () => {
    setBattle(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setOpponentScore(0);
    setTimeLeft(10);
    setBattleEnded(false);
    findBattle(); // Start a new battle
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Module Selection Dropdown */}
      <Text style={styles.title}>Quiz Battles</Text>
      <Picker
        selectedValue={selectedModule}
        onValueChange={(itemValue) => setSelectedModule(itemValue)}
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

      {!battle ? (
        <TouchableOpacity style={styles.button} onPress={findBattle}>
          <Text style={styles.buttonText}>Find Battle</Text>
        </TouchableOpacity>
      ) : (
        <>
          {questions.length > 0 ? (
            <>
              <Text style={styles.question}>
                {questions[currentQuestionIndex]?.question}
              </Text>
              {questions[currentQuestionIndex]?.challenge && (
                <Text style={styles.challengeText}>
                  Challenge: {questions[currentQuestionIndex]?.challenge}
                </Text>
              )}
              <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
              {questions[currentQuestionIndex]?.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </>
          ) : (
            <Text>No questions available.</Text>
          )}
          <Text style={styles.score}>Your Score: {score}</Text>
          <Text style={styles.score}>Opponent's Score: {opponentScore}</Text>
          {battleEnded && (
            <>
              {usedQuestions.length < Object.values(allQuestions).flat().length ? (
                <TouchableOpacity style={styles.button} onPress={resetBattle}>
                  <Text style={styles.buttonText}>Battle Again!</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.endMessage}>No more battles for now.</Text>
              )}
            </>
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
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
  challengeText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#ff0000",
    fontStyle: "italic",
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
  endMessage: {
    fontSize: 18,
    marginTop: 20,
    color: "#ff0000",
  },
});

export default QuizBattles;