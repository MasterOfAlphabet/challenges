import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native'; // Added ScrollView
import { Picker } from '@react-native-picker/picker';
import * as Speech from "expo-speech";

// Replaced numeric levels with strings for Gamification Levels
const gamificationLevels = ["Rookie", "Racer", "Master", "Prodigy", "Wizard"];

// Word Library from above
const wordLibrary = {
  "I/II": {
    Rookie: [
      "banana",
      "orange",
      "cactus",
      "puzzle",
      "rabbit",
      "basket",
      "coffee",
      "button",
      "sunset",
      "turtle",
    ],
    Racer: [
      "gallery",
      "horizon",
      "cushion",
      "marble",
      "feather",
      "laundry",
      "blossom",
      "cottage",
      "tangent",
      "castle",
    ],
    Master: [
      "avocado",
      "boulevard",
      "chimney",
      "dinosaur",
      "gelatin",
      "kitchen",
      "magnolia",
      "necklace",
      "omelet",
      "panther",
    ],
    Prodigy: [
      "amphibian",
      "cylindrical",
      "hemisphere",
      "raspberry",
      "parliament",
    ],
    Wizard: ["hierarchy", "xylophone", "tsunami"],
  },
  "III to V": {
    Rookie: [
      "pebble",
      "jungle",
      "cousin",
      "vacuum",
      "vinegar",
      "cactus",
      "avocado",
      "carnival",
      "firework",
      "turtle",
    ],
    Racer: [
      "cabinet",
      "decision",
      "friction",
      "guardian",
      "journey",
      "lettuce",
      "monarch",
      "plastic",
      "scissors",
      "tribune",
    ],
    Master: [
      "aluminum",
      "biscuit",
      "corridor",
      "domino",
      "foliage",
      "gymnasium",
      "mosquito",
      "numerical",
      "papyrus",
      "zucchini",
    ],
    Prodigy: [
      "acquiesce",
      "bouquet",
      "fuchsia",
      "maisonette",
      "tapestry",
    ],
    Wizard: ["sarcophagus", "rhythm", "debris"],
  },
  "VI to X": {
    Rookie: [
      "account",
      "bargain",
      "comment",
      "digital",
      "evening",
      "gallery",
      "history",
      "jackpot",
      "kingdom",
      "library",
    ],
    Racer: [
      "marathon",
      "narrative",
      "obstacle",
      "phoenix",
      "qualify",
      "relevant",
      "simulate",
      "tourist",
      "utopia",
      "vaccine",
    ],
    Master: [
      "abominable",
      "blueprint",
      "calibrate",
      "deduction",
      "federation",
      "heirloom",
      "lightning",
      "nuisance",
      "pyramid",
      "rhinoceros",
    ],
    Prodigy: [
      "acknowledge",
      "bureaucracy",
      "concierge",
      "delicatessen",
      "doppelganger",
    ],
    Wizard: ["guillotine", "mnemonic", "queue"],
  },
};

const PronunciationPractice = () => {
  const [classGroup, setClassGroup] = useState("I/II");
  const [gamificationLevel, setGamificationLevel] = useState("Rookie");
  const [words, setWords] = useState([]);
  const [isPracticing, setIsPracticing] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Handle class group selection
  const handleClassGroupChange = (value) => {
    setClassGroup(value);
    setWords([]);
  };

  // Handle gamification level selection
  const handleGamificationLevelChange = (value) => {
    setGamificationLevel(value);
    setWords([]);
  };

  // Load words based on selected class group and level
  const loadWords = () => {
    const selectedWords = wordLibrary[classGroup][gamificationLevel] || [];
    setWords(selectedWords);
  };

  // Pronounce words with a 3-second gap
  const startPronunciationPractice = () => {
    setIsPracticing(true);
    let index = 0;

    const pronounceWord = () => {
      if (index < words.length) {
        const word = words[index];
        setHighlightedIndex(index);

        // Pronounce the word twice, 1.5s apart
        setTimeout(() => {
          Speech.speak(word);
        }, 1500);

        // Move to next word after 3 seconds
        index++;
        setTimeout(() => {
          setHighlightedIndex(-1);
          pronounceWord();
        }, 3000);
      } else {
        setIsPracticing(false);
      }
    };

    pronounceWord();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Pronunciation Practice</Text>

      {/* Class Group Dropdown */}
      <Text style={styles.label}>Select Class Group:</Text>
      <Picker
        selectedValue={classGroup}
        style={styles.picker}
        onValueChange={handleClassGroupChange}
      >
        <Picker.Item label="I/II" value="I/II" />
        <Picker.Item label="III to V" value="III to V" />
        <Picker.Item label="VI to X" value="VI to X" />
      </Picker>

      {/* Gamification Level Dropdown */}
      <Text style={styles.label}>Select Gamification Level:</Text>
      <Picker
        selectedValue={gamificationLevel}
        style={styles.picker}
        onValueChange={handleGamificationLevelChange}
      >
        {gamificationLevels.map((level) => (
          <Picker.Item label={level} value={level} key={level} />
        ))}
      </Picker>

      {/* Load Words Button */}
      <Button title="Load Words" onPress={loadWords} />

      {/* Display Words */}
      {words.length > 0 && (
        <View style={styles.wordsContainer}>
          <Text style={styles.wordsTitle}>Words to Practice:</Text>
          {words.map((word, index) => (
            <Text
              key={index}
              style={[
                styles.word,
                highlightedIndex === index && styles.highlightedWord,
              ]}
            >
              {word}
            </Text>
          ))}
        </View>
      )}

      {/* Pronunciation Practice Button */}
      {words.length > 0 && (
        <Button
          title={isPracticing ? "Practicing..." : "Start Pronunciation Practice"}
          onPress={startPronunciationPractice}
          disabled={isPracticing}
        />
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
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  picker: {
    height: 50,
    width: 220,
    marginBottom: 20,
  },
  wordsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  wordsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  word: {
    fontSize: 16,
    marginBottom: 5,
  },
  highlightedWord: {
    color: "#007AFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default PronunciationPractice;
