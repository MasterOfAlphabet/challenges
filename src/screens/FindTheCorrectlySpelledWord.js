import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as Speech from "expo-speech";

const FindTheCorrectlySpelledWord = () => {
  const [optionsVisible, setOptionsVisible] = useState([]); // Controls visibility of options
  const [isSpeaking, setIsSpeaking] = useState(true); // Prevents premature clicking

  const question = {
    image: require("../../assets/Elephant.png"), // Replace with actual image path
    correctAnswer: "Elephant",
    options: ["Eliphant", "Elephant", "Elephent"],
  };

  useEffect(() => {
    setOptionsVisible([]); // Reset options on load
    setIsSpeaking(true); // Lock interaction during speech

    Speech.speak("Find the correct spelling. Please take a look at the picture and find the correct spelling. Your choices are...", {
      onDone: () => revealOptionsAndSpeak(0),
    });
  }, []);
  
  const speakLetterByLetter = (word, index, callback) => {
    if (index < word.length) {
      Speech.speak(word[index], {
        onDone: () => {
          setTimeout(() => speakLetterByLetter(word, index + 1, callback), 500); // 1-sec delay between letters
        },
      });
    } else {
      callback(); // Move to next option after speaking the current word
    }
  };
  
  const revealOptionsAndSpeak = (index) => {
    if (index < question.options.length) {
      const word = question.options[index];
  
      // Show the option text immediately before speaking
      setOptionsVisible((prev) => [...prev, word]);
  
      setTimeout(() => {
        Speech.speak(`Option ${index + 1}`, {
          onDone: () => speakLetterByLetter(word, 0, () => {
            revealOptionsAndSpeak(index + 1); // Move to next option after speaking
          }),
        });
      }, 1000);
    } else {
      setIsSpeaking(false); // Unlock interactions after all options are spoken
    }
  };
  
  
  

  const handleAnswer = (selected) => {
    if (isSpeaking) return; // Prevent early clicks before speech ends

    if (selected === question.correctAnswer) {
      Speech.speak("Correct! Well done!");
    } else {
      Speech.speak("Oops! Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>📝 Find the Correct Spelling</Text>

      <Image source={question.image} style={styles.image} />

      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              optionsVisible.includes(option) ? styles.visible : styles.hidden,
            ]}
            onPress={() => handleAnswer(option)}
            disabled={isSpeaking}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 16, // Reduced size to fit in one line
    fontWeight: "bold",
    color: "#4A00E0",
    marginBottom: 15,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#6200ea",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    width: "80%",
    opacity: 0,
    elevation: 4,
  },
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
  optionText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

export default FindTheCorrectlySpelledWord;
