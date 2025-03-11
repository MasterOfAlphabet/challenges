import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

const levels = ["Rookie", "Racer", "Master", "Prodigy", "Wizard"];

const SpellingGame = () => {
  const [selectedLevel, setSelectedLevel] = useState("Master");
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpellingWords(selectedLevel);
  }, [selectedLevel]);

  const fetchSpellingWords = async (level) => {
    try {
      setLoading(true);
      const response = await fetch(`http://192.168.29.84:5000/api/spelling-words?level=${level}`);
      const data = await response.json();
      setWords(data.words);
      setCurrentIndex(0);
      setUserAnswer("");
      setScore(0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching spelling words:", error);
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (userAnswer.trim().toLowerCase() === words[currentIndex].word.toLowerCase()) {
      setScore(score + 1);
    }
    setUserAnswer("");
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert(`Game over! Your final score is: ${score + 1}`);
    }
  };

  const handleSkip = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserAnswer("");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>Spelling Game</Text>
      <Picker
        selectedValue={selectedLevel}
        onValueChange={(itemValue) => setSelectedLevel(itemValue)}
        style={{ height: 50, width: 200, marginBottom: 20 }}
      >
        {levels.map((level) => (
          <Picker.Item key={level} label={level} value={level} />
        ))}
      </Picker>

      {words.length > 0 && (
        <View>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>{words[currentIndex].definition}</Text>
          <TextInput
            style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            value={userAnswer}
            onChangeText={setUserAnswer}
            placeholder="Type your answer"
          />
          <Button title="Submit" onPress={handleSubmit} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity onPress={handlePrev} disabled={currentIndex === 0}>
              <Text style={{ fontSize: 16, color: currentIndex === 0 ? "gray" : "blue" }}>⬅ Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={{ fontSize: 16, color: "blue" }}>Skip ➡</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SpellingGame;
