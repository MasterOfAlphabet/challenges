import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const UnscrambleScreen = () => {
  const [numberOfLetters, setNumberOfLetters] = useState(5);
  const [questionType, setQuestionType] = useState("Arrange the letters");
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [userInput, setUserInput] = useState(""); // For Fill in the Blank
  const [letters, setLetters] = useState([]); // Scrambled letters
  const [arrangedLetters, setArrangedLetters] = useState([]); // For Arrange the Letters

  const words = {
    3: {
      "Arrange the letters": ["CAT", "DOG", "BAT", "RAT", "MAT", "HAT", "PAN", "CAN", "MAN", "FAN"],
      "Fill in the blank": ["C_T", "D_G", "B_T", "R_T", "M_T", "H_T", "P_N", "C_N", "M_N", "F_N"],
      "Multiple choice": [
        { word: "CAT", options: ["CAT", "DOG", "BAT", "RAT"] },
        { word: "DOG", options: ["DOG", "CAT", "BAT", "RAT"] },
        { word: "BAT", options: ["BAT", "CAT", "DOG", "RAT"] },
        { word: "RAT", options: ["RAT", "CAT", "DOG", "BAT"] },
        { word: "MAT", options: ["MAT", "CAT", "DOG", "BAT"] },
        { word: "HAT", options: ["HAT", "CAT", "DOG", "BAT"] },
        { word: "PAN", options: ["PAN", "CAT", "DOG", "BAT"] },
        { word: "CAN", options: ["CAN", "CAT", "DOG", "BAT"] },
        { word: "MAN", options: ["MAN", "CAT", "DOG", "BAT"] },
        { word: "FAN", options: ["FAN", "CAT", "DOG", "BAT"] },
      ],
      "Drag & Drop": ["CAT", "DOG", "BAT", "RAT", "MAT", "HAT", "PAN", "CAN", "MAN", "FAN"],
    },
    4: {
      "Arrange the letters": ["FISH", "BIRD", "FROG", "DUCK", "BEAR", "WOLF", "LION", "DEER", "GOAT", "FROG"],
      "Fill in the blank": ["F_SH", "B_RD", "FR_G", "D_CK", "B_AR", "W_LF", "L_ON", "D_ER", "G_AT", "FR_G"],
      "Multiple choice": [
        { word: "FISH", options: ["FISH", "BIRD", "FROG", "DUCK"] },
        { word: "BIRD", options: ["BIRD", "FISH", "FROG", "DUCK"] },
        { word: "FROG", options: ["FROG", "FISH", "BIRD", "DUCK"] },
        { word: "DUCK", options: ["DUCK", "FISH", "BIRD", "FROG"] },
        { word: "BEAR", options: ["BEAR", "FISH", "BIRD", "FROG"] },
        { word: "WOLF", options: ["WOLF", "FISH", "BIRD", "FROG"] },
        { word: "LION", options: ["LION", "FISH", "BIRD", "FROG"] },
        { word: "DEER", options: ["DEER", "FISH", "BIRD", "FROG"] },
        { word: "GOAT", options: ["GOAT", "FISH", "BIRD", "FROG"] },
        { word: "FROG", options: ["FROG", "FISH", "BIRD", "DUCK"] },
      ],
      "Drag & Drop": ["FISH", "BIRD", "FROG", "DUCK", "BEAR", "WOLF", "LION", "DEER", "GOAT", "FROG"],
    },
    5: {
      "Arrange the letters": ["APPLE", "GRAPE", "LEMON", "MANGO", "PEACH", "PEAR", "KIWI", "BERRY", "MELON", "ORANGE"],
      "Fill in the blank": ["A_PLE", "G_APE", "L_MON", "M_NGO", "P_ACH", "P_AR", "K_WI", "B_RRY", "M_LON", "O_ANGE"],
      "Multiple choice": [
        { word: "APPLE", options: ["APPLE", "GRAPE", "LEMON", "MANGO"] },
        { word: "GRAPE", options: ["GRAPE", "APPLE", "LEMON", "MANGO"] },
        { word: "LEMON", options: ["LEMON", "APPLE", "GRAPE", "MANGO"] },
        { word: "MANGO", options: ["MANGO", "APPLE", "GRAPE", "LEMON"] },
        { word: "PEACH", options: ["PEACH", "APPLE", "GRAPE", "LEMON"] },
        { word: "PEAR", options: ["PEAR", "APPLE", "GRAPE", "LEMON"] },
        { word: "KIWI", options: ["KIWI", "APPLE", "GRAPE", "LEMON"] },
        { word: "BERRY", options: ["BERRY", "APPLE", "GRAPE", "LEMON"] },
        { word: "MELON", options: ["MELON", "APPLE", "GRAPE", "LEMON"] },
        { word: "ORANGE", options: ["ORANGE", "APPLE", "GRAPE", "LEMON"] },
      ],
      "Drag & Drop": ["APPLE", "GRAPE", "LEMON", "MANGO", "PEACH", "PEAR", "KIWI", "BERRY", "MELON", "ORANGE"],
    },
    6: {
      "Arrange the letters": ["BANANA", "ORANGE", "PINEAPPLE", "STRAWBERRY", "WATERMELON", "BLUEBERRY", "RASPBERRY", "BLACKBERRY", "PAPAYA", "GUAVA"],
      "Fill in the blank": ["B_NANA", "O_ANGE", "P_NEAPPLE", "S_RAWBERRY", "W_TERMELON", "B_UEBERRY", "R_SPBERRY", "B_ACKBERRY", "P_PAYA", "G_AVA"],
      "Multiple choice": [
        { word: "BANANA", options: ["BANANA", "ORANGE", "PINEAPPLE", "STRAWBERRY"] },
        { word: "ORANGE", options: ["ORANGE", "BANANA", "PINEAPPLE", "STRAWBERRY"] },
        { word: "PINEAPPLE", options: ["PINEAPPLE", "BANANA", "ORANGE", "STRAWBERRY"] },
        { word: "STRAWBERRY", options: ["STRAWBERRY", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "WATERMELON", options: ["WATERMELON", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "BLUEBERRY", options: ["BLUEBERRY", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "RASPBERRY", options: ["RASPBERRY", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "BLACKBERRY", options: ["BLACKBERRY", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "PAPAYA", options: ["PAPAYA", "BANANA", "ORANGE", "PINEAPPLE"] },
        { word: "GUAVA", options: ["GUAVA", "BANANA", "ORANGE", "PINEAPPLE"] },
      ],
      "Drag & Drop": ["BANANA", "ORANGE", "PINEAPPLE", "STRAWBERRY", "WATERMELON", "BLUEBERRY", "RASPBERRY", "BLACKBERRY", "PAPAYA", "GUAVA"],
    },
    7: {
      "Arrange the letters": ["AVOCADO", "COCONUT", "DRAGONFRUIT", "PASSIONFRUIT", "STARFRUIT", "BLACKCURRANT", "CRANBERRY", "ELDERBERRY", "GOOSEBERRY", "HUCKLEBERRY"],
      "Fill in the blank": ["A_OCADO", "C_CONUT", "D_AGONFRUIT", "P_SSIONFRUIT", "S_ARFRUIT", "B_ACKCURRANT", "C_ANBERRY", "E_LDERBERRY", "G_OOSEBERRY", "H_CKLEBERRY"],
      "Multiple choice": [
        { word: "AVOCADO", options: ["AVOCADO", "COCONUT", "DRAGONFRUIT", "PASSIONFRUIT"] },
        { word: "COCONUT", options: ["COCONUT", "AVOCADO", "DRAGONFRUIT", "PASSIONFRUIT"] },
        { word: "DRAGONFRUIT", options: ["DRAGONFRUIT", "AVOCADO", "COCONUT", "PASSIONFRUIT"] },
        { word: "PASSIONFRUIT", options: ["PASSIONFRUIT", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "STARFRUIT", options: ["STARFRUIT", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "BLACKCURRANT", options: ["BLACKCURRANT", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "CRANBERRY", options: ["CRANBERRY", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "ELDERBERRY", options: ["ELDERBERRY", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "GOOSEBERRY", options: ["GOOSEBERRY", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
        { word: "HUCKLEBERRY", options: ["HUCKLEBERRY", "AVOCADO", "COCONUT", "DRAGONFRUIT"] },
      ],
      "Drag & Drop": ["AVOCADO", "COCONUT", "DRAGONFRUIT", "PASSIONFRUIT", "STARFRUIT", "BLACKCURRANT", "CRANBERRY", "ELDERBERRY", "GOOSEBERRY", "HUCKLEBERRY"],
    },
    8: {
      "Arrange the letters": ["BLUEBERRY", "RASPBERRY", "BLACKBERRY", "STRAWBERRY", "WATERMELON", "PINEAPPLE", "DRAGONFRUIT", "PASSIONFRUIT", "STARFRUIT", "HUCKLEBERRY"],
      "Fill in the blank": ["B_UEBERRY", "R_SPBERRY", "B_ACKBERRY", "S_RAWBERRY", "W_TERMELON", "P_NEAPPLE", "D_AGONFRUIT", "P_SSIONFRUIT", "S_ARFRUIT", "H_CKLEBERRY"],
      "Multiple choice": [
        { word: "BLUEBERRY", options: ["BLUEBERRY", "RASPBERRY", "BLACKBERRY", "STRAWBERRY"] },
        { word: "RASPBERRY", options: ["RASPBERRY", "BLUEBERRY", "BLACKBERRY", "STRAWBERRY"] },
        { word: "BLACKBERRY", options: ["BLACKBERRY", "BLUEBERRY", "RASPBERRY", "STRAWBERRY"] },
        { word: "STRAWBERRY", options: ["STRAWBERRY", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "WATERMELON", options: ["WATERMELON", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "PINEAPPLE", options: ["PINEAPPLE", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "DRAGONFRUIT", options: ["DRAGONFRUIT", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "PASSIONFRUIT", options: ["PASSIONFRUIT", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "STARFRUIT", options: ["STARFRUIT", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
        { word: "HUCKLEBERRY", options: ["HUCKLEBERRY", "BLUEBERRY", "RASPBERRY", "BLACKBERRY"] },
      ],
      "Drag & Drop": ["BLUEBERRY", "RASPBERRY", "BLACKBERRY", "STRAWBERRY", "WATERMELON", "PINEAPPLE", "DRAGONFRUIT", "PASSIONFRUIT", "STARFRUIT", "HUCKLEBERRY"],
    },
  };

  // Ensure currentQuestion is defined
  const currentQuestion =
    words[numberOfLetters]?.[questionType]?.[currentQuestionIndex] || "";

  // Reset for new question
  useEffect(() => {
    if (currentQuestion) {
      setLetters(currentQuestion.split("").sort(() => Math.random() - 0.5));
      setArrangedLetters([]); // Clear arranged letters
      setUserInput(""); // Clear user input
      setFeedback(null);
      setTimeLeft(30); // Reset timer for each question
    }
  }, [currentQuestionIndex, questionType, numberOfLetters]);

  // Timer
  useEffect(() => {
    if (timerEnabled && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, timerEnabled]);

  // Move letter to the special area (Arrange the Letters)
  const moveLetterToSpecialArea = (index) => {
    const letter = letters[index];
    setArrangedLetters((prev) => [...prev, letter]); // Add to special area
    setLetters((prev) => prev.filter((_, i) => i !== index)); // Remove from scrambled area
  };

  // Move letter back to the scrambled area (Arrange the Letters)
  const moveLetterToScrambledArea = (index) => {
    const letter = arrangedLetters[index];
    setLetters((prev) => [...prev, letter]); // Add to scrambled area
    setArrangedLetters((prev) => prev.filter((_, i) => i !== index)); // Remove from special area
  };

  // Swap letters when dropped (Drag & Drop)
  const swapLetters = (fromIndex, toIndex) => {
    const newLetters = [...letters];
    const temp = newLetters[fromIndex];
    newLetters[fromIndex] = newLetters[toIndex];
    newLetters[toIndex] = temp;
    setLetters(newLetters);
  };

  // Handle submit
  const handleSubmit = () => {
    let userAnswer;
    if (questionType === "Fill in the blank") {
      userAnswer = userInput;
    } else if (questionType === "Arrange the letters") {
      userAnswer = arrangedLetters.join("");
    } else if (questionType === "Drag & Drop") {
      userAnswer = letters.join("");
    }

    if (userAnswer === currentQuestion) {
      setFeedback("✅ Correct! Well done.");
      setScore((prev) => prev + 10); // Award 10 points for correct answer

      // Move to the next question or end the game
      if (currentQuestionIndex < words[numberOfLetters][questionType].length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex((prev) => prev + 1);
        }, 1000); // Delay before moving to the next question
      } else {
        setGameOver(true); // End of game
      }
    } else {
      setFeedback("❌ Incorrect. Try again!");
      // Do not move to the next question if the answer is incorrect
    }
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameOver(false);
  };

  // Drag & Drop Logic
  const DraggableLetter = ({ letter, index, swapLetters }) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startPosition = useSharedValue(index * 60); // Initial X position

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startIndex = index;
      },
      onActive: (event) => {
        translateX.value = event.translationX;
      },
      onEnd: () => {
        const newIndex = Math.round((translateX.value + startPosition.value) / 60);
        if (newIndex !== index && newIndex >= 0 && newIndex < letters.length) {
          runOnJS(swapLetters)(index, newIndex);
        }
        translateX.value = withSpring(0);
      },
    });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateX: translateX.value }],
    }));

    return (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.letter, animatedStyle]}>
          <Text style={styles.letterText}>{letter}</Text>
        </Animated.View>
      </PanGestureHandler>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Configuration Modal */}
      <Modal visible={!gameOver && currentQuestionIndex === 0} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Game Configuration</Text>

            {/* Number of Letters */}
            <Text style={styles.label}>Number of Letters:</Text>
            <Picker
              selectedValue={numberOfLetters}
              onValueChange={(itemValue) => setNumberOfLetters(itemValue)}
              style={styles.picker}
            >
              {[3, 4, 5, 6, 7, 8].map((num) => (
                <Picker.Item key={num} label={`${num}`} value={num} />
              ))}
            </Picker>

            {/* Question Type */}
            <Text style={styles.label}>Question Type:</Text>
            <Picker
              selectedValue={questionType}
              onValueChange={(itemValue) => setQuestionType(itemValue)}
              style={styles.picker}
            >
              {[
                "Fill in the blank",
                "Arrange the letters",
                "Drag & Drop",
              ].map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>

            {/* Timer */}
            <Text style={styles.label}>Timer:</Text>
            <Picker
              selectedValue={timerEnabled}
              onValueChange={(itemValue) => setTimerEnabled(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Yes" value={true} />
              <Picker.Item label="No" value={false} />
            </Picker>

            {/* Start Game Button */}
            <TouchableOpacity style={styles.startButton} onPress={() => setCurrentQuestionIndex(1)}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Game Screen */}
      {!gameOver && currentQuestionIndex > 0 && (
        <View style={styles.gameContainer}>
          <Text style={styles.heading}>
            {questionType === "Fill in the blank" ? "Fill in the Blank" : "Unscramble the Word"}
          </Text>

          {/* Timer */}
          {timerEnabled && <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>}

          {/* Scrambled Letters */}
          <View style={styles.lettersContainer}>
            {letters.map((letter, index) => {
              if (questionType === "Drag & Drop") {
                return (
                  <DraggableLetter
                    key={index}
                    letter={letter}
                    index={index}
                    swapLetters={swapLetters}
                  />
                );
              } else {
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.letter}
                    onPress={() => moveLetterToSpecialArea(index)}
                  >
                    <Text style={styles.letterText}>{letter}</Text>
                  </TouchableOpacity>
                );
              }
            })}
          </View>

          {/* Special Area for Arrange the Letters */}
          {questionType === "Arrange the letters" && (
            <View style={styles.specialArea}>
              <View style={styles.line} />
              <View style={styles.arrangedLettersContainer}>
                {arrangedLetters.map((letter, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.letter}
                    onPress={() => moveLetterToScrambledArea(index)}
                  >
                    <Text style={styles.letterText}>{letter}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Text Input for Fill in the Blank */}
          {questionType === "Fill in the blank" && (
            <TextInput
              style={styles.input}
              placeholder="Type the correct word"
              value={userInput}
              onChangeText={(text) => setUserInput(text.toUpperCase())} // Convert to uppercase
              autoCapitalize="characters" // Auto-capitalize letters
            />
          )}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>

          {/* Feedback */}
          {feedback && <Text style={styles.feedback}>{feedback}</Text>}
        </View>
      )}

      {/* Game Over Screen */}
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.finalScoreText}>Your Final Score: {score}</Text>
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  picker: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
  },
  gameContainer: {
    width: "100%",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  lettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    paddingVertical: 10,
  },
  letter: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#6200EE",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
  },
  letterText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  specialArea: {
    marginBottom: 20,
    alignItems: "center",
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#000",
    marginBottom: 10,
  },
  arrangedLettersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  input: {
    width: "80%",
    height: 50,
    borderColor: "#6200EE",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#FFF",
    fontSize: 18,
  },
  feedback: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  finalScoreText: {
    fontSize: 20,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: "#FF5733",
    padding: 15,
    borderRadius: 8,
  },
  resetText: {
    color: "#FFF",
    fontSize: 18,
  },
});

export default UnscrambleScreen;