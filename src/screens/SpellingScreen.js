import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av"; // For sound effects

// Updated word lists
const wordLists = {
  Easy: [
    "apple",
    "banana",
    "cat",
    "dog",
    "elephant",
    "fish",
    "grape",
    "house",
    "ice",
    "juice",
  ],
  Medium: [
    "bicycle",
    "chocolate",
    "diamond",
    "fountain",
    "guitar",
    "hamburger",
    "island",
    "jungle",
    "kangaroo",
    "marathon",
  ],
  Hard: [
    "accommodate",
    "bureaucracy",
    "conscience",
    "embarrass",
    "fluorescent",
    "handkerchief",
    "irresistible",
    "kaleidoscope",
    "labyrinth",
    "nuisance",
  ],
};

// For the Daily Challenge (one random word per day)
const dailyChallengeWords = [
  "synchronize",
  "queue",
  "onomatopoeia",
  "tsunami",
  "xylophone",
];

export default function SpellingScreen() {
  // Daily Challenge states
  const [dailyWord, setDailyWord] = useState("");
  const [dailyUserInput, setDailyUserInput] = useState("");
  const [dailyAttempted, setDailyAttempted] = useState(false);

  // Spelling Bee states
  const [difficulty, setDifficulty] = useState("Easy");
  const [currentWord, setCurrentWord] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds per word
  const [score, setScore] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);

  // Sound effects
  const [correctSound, setCorrectSound] = useState(null);
  const [incorrectSound, setIncorrectSound] = useState(null);

  // Load sound effects
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: correct } = await Speech.speak("Correct"); // Add your correct sound file
      
      const { sound: incorrect } = await Speech.speak("Incorrect"); // Add your incorrect sound file
    
      setCorrectSound(correct);
      setIncorrectSound(incorrect);
    };

    loadSounds();

    return () => {
      if (correctSound) correctSound.unloadAsync();
      if (incorrectSound) incorrectSound.unloadAsync();
    };
  }, []);

  // ======== DAILY CHALLENGE LOGIC ========

  useEffect(() => {
    // Pick a random daily word (pretend it's once per day)
    const randomIndex = Math.floor(Math.random() * dailyChallengeWords.length);
    setDailyWord(dailyChallengeWords[randomIndex]);
  }, []);

  // Listen to daily challenge word
  const speakDailyWord = () => {
    if (!dailyWord) return;
    Speech.speak(dailyWord);
  };

  // Show hint for daily challenge (first letter)
  const showDailyHint = () => {
    Alert.alert("Hint", `The word starts with: ${dailyWord[0]}`);
  };

  const checkDailyChallenge = async () => {
    if (!dailyWord) return;
    setDailyAttempted(true);

    if (dailyUserInput.trim().toLowerCase() === dailyWord.toLowerCase()) {
      await correctSound.replayAsync(); // Play correct sound
      Alert.alert("Daily Challenge", "Correct! Great job!");
    } else {
      await incorrectSound.replayAsync(); // Play incorrect sound
      Alert.alert(
        "Daily Challenge",
        `Incorrect. The correct spelling is: ${dailyWord}`
      );
    }
  };

  // ======== SPELLING BEE LOGIC ========

  // Load a random word based on difficulty
  const loadRandomWord = () => {
    const words = wordLists[difficulty];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setUserInput("");
    setTimeLeft(10); // Reset timer
    // Speak the word (don't display it)
    Speech.speak(randomWord);
  };

  // Start the Spelling Bee
  const startGame = () => {
    setIsGameActive(true);
    loadRandomWord();
  };

  // Show hint for Spelling Bee (first letter)
  const showHint = () => {
    Alert.alert("Hint", `The word starts with: ${currentWord[0]}`);
  };

  // Handle user input submission
  const checkSpelling = async () => {
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      await correctSound.replayAsync(); // Play correct sound
      setScore((prev) => prev + 1);
      Alert.alert("Correct!", "You spelled the word correctly.");
    } else {
      await incorrectSound.replayAsync(); // Play incorrect sound
      Alert.alert("Incorrect!", `The correct spelling is: ${currentWord}`);
    }
    loadRandomWord(); // Load the next word
  };

  // Timer logic
  useEffect(() => {
    if (isGameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      Alert.alert("Time’s up!", `The correct spelling is: ${currentWord}`);
      loadRandomWord(); // Load the next word
    }
  }, [isGameActive, timeLeft]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ======= DAILY CHALLENGE SECTION ======= */}
      <Text style={styles.title}>Daily Challenge</Text>
      <Button title="Listen to Daily Word" onPress={speakDailyWord} />

      {!dailyAttempted ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Type the daily challenge word"
            value={dailyUserInput}
            onChangeText={setDailyUserInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button title="Submit Daily Challenge" onPress={checkDailyChallenge} />
          <Button title="Show Hint" onPress={showDailyHint} />
        </>
      ) : (
        <Text style={styles.infoText}>
          {`You already attempted today's challenge: ${dailyWord}`}
        </Text>
      )}

      {/* ======= SPELLING BEE SECTION ======= */}
      <Text style={styles.title}>Spelling Bee Competition</Text>

      {/* Difficulty Selection */}
      <Text>Select Difficulty:</Text>
      <View style={styles.difficultyButtons}>
        <Button title="Easy" onPress={() => setDifficulty("Easy")} />
        <Button title="Medium" onPress={() => setDifficulty("Medium")} />
        <Button title="Hard" onPress={() => setDifficulty("Hard")} />
      </View>

      {/* Start Game Button */}
      {!isGameActive && <Button title="Start Game" onPress={startGame} />}

      {/* If Game is Active, show input, timer, etc. */}
      {isGameActive && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Type the word here (spoken above)"
            value={userInput}
            onChangeText={setUserInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
          <Button title="Submit" onPress={checkSpelling} />
          <Button title="Show Hint" onPress={showHint} />
        </>
      )}

      {/* Display Score */}
      <Text style={styles.score}>Score: {score}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  difficultyButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    marginVertical: 10,
  },
  timer: {
    fontSize: 18,
    marginBottom: 20,
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  infoText: {
    fontSize: 16,
    color: "gray",
    marginVertical: 10,
    textAlign: "center",
  },
});