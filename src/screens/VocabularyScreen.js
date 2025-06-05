import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';

const VocabularyScreen = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [skillLevel, setSkillLevel] = useState("Rookie");
  const [recording, setRecording] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const vocabularyData = {
    Rookie: [
      {
        word: "Happy",
        partOfSpeech: "adjective",
        definition: "Feeling or showing pleasure or contentment.",
        synonyms: ["joyful", "cheerful"],
        antonyms: ["sad", "unhappy"],
        example: "She felt happy after receiving the gift.",
      },
      {
        word: "Big",
        partOfSpeech: "adjective",
        definition: "Of considerable size or extent.",
        synonyms: ["large", "huge"],
        antonyms: ["small", "tiny"],
        example: "They live in a big house.",
      },
      // Add 8 more words for Rookie level
    ],
    Racer: [
      {
        word: "Accelerate",
        partOfSpeech: "verb",
        definition: "To increase in speed or amount.",
        synonyms: ["speed up", "hasten"],
        antonyms: ["decelerate", "slow down"],
        example: "The car accelerated as it entered the highway.",
      },
      {
        word: "Navigate",
        partOfSpeech: "verb",
        definition: "To plan and direct the route or course of a journey.",
        synonyms: ["steer", "guide"],
        antonyms: ["wander", "drift"],
        example: "He navigated the ship through the storm.",
      },
      // Add 8 more words for Racer level
    ],
    Master: [
      {
        word: "Perspicacious",
        partOfSpeech: "adjective",
        definition: "Having a keen insight or understanding.",
        synonyms: ["sharp", "insightful"],
        antonyms: ["ignorant", "obtuse"],
        example: "The detective was perspicacious in solving the case.",
      },
      {
        word: "Prolific",
        partOfSpeech: "adjective",
        definition: "Producing a large amount of something.",
        synonyms: ["productive", "abundant"],
        antonyms: ["unproductive", "scarce"],
        example: "The author was prolific, writing three books a year.",
      },
      {
        word: "Synthesize",
        partOfSpeech: "verb",
        definition: "To combine different elements to form a whole.",
        synonyms: ["integrate", "fuse"],
        antonyms: ["separate", "break down"],
        example: "Scientists synthesized new materials for medical use.",
      },
      {
        word: "Erudite",
        partOfSpeech: "adjective",
        definition: "Having or showing great knowledge.",
        synonyms: ["scholarly", "learned"],
        antonyms: ["ignorant", "uneducated"],
        example: "The professor was an erudite speaker.",
      },
      {
        word: "Omnipotent",
        partOfSpeech: "adjective",
        definition: "Having unlimited power.",
        synonyms: ["all-powerful", "supreme"],
        antonyms: ["powerless", "weak"],
        example: "The emperor ruled as if he were omnipotent.",
      },
    ],
    Prodigy: [
      {
        word: "Elated",
        partOfSpeech: "adjective",
        definition: "Feeling extreme happiness or excitement.",
        synonyms: ["overjoyed", "ecstatic"],
        antonyms: ["depressed", "miserable"],
        example: "She was elated after winning the competition.",
      },
      {
        word: "Colossal",
        partOfSpeech: "adjective",
        definition: "Extremely large or great.",
        synonyms: ["gigantic", "immense"],
        antonyms: ["tiny", "minuscule"],
        example: "The colossal statue towered over the city.",
      },
      {
        word: "Innovate",
        partOfSpeech: "verb",
        definition: "To introduce new ideas, methods, or products.",
        synonyms: ["create", "revolutionize"],
        antonyms: ["imitate", "stagnate"],
        example: "The company innovates to stay ahead in the market.",
      },
      {
        word: "Perceive",
        partOfSpeech: "verb",
        definition: "To become aware or understand something.",
        synonyms: ["recognize", "comprehend"],
        antonyms: ["ignore", "overlook"],
        example: "He perceived the change in her attitude.",
      },
      {
        word: "Meticulous",
        partOfSpeech: "adjective",
        definition: "Showing great attention to detail.",
        synonyms: ["precise", "thorough"],
        antonyms: ["careless", "sloppy"],
        example: "She was meticulous in preparing her research paper.",
      },
      {
        word: "Ebullient",
        partOfSpeech: "adjective",
        definition: "Cheerful and full of energy.",
        synonyms: ["exuberant", "vivacious"],
        antonyms: ["lethargic", "apathetic"],
        example: "Her ebullient personality lit up the room.",
      },
      {
        word: "Nefarious",
        partOfSpeech: "adjective",
        definition: "Wicked or criminal.",
        synonyms: ["evil", "villainous"],
        antonyms: ["virtuous", "noble"],
        example: "The nefarious plot was uncovered by the detective.",
      },
    ],
    Wizard: [
      {
        word: "Ethereal",
        partOfSpeech: "adjective",
        definition: "Extremely delicate and light, seemingly not of this world.",
        synonyms: ["heavenly", "otherworldly"],
        antonyms: ["earthly", "mundane"],
        example: "The ethereal glow of the northern lights mesmerized them.",
      },
      {
        word: "Conundrum",
        partOfSpeech: "noun",
        definition: "A confusing and difficult problem or question.",
        synonyms: ["puzzle", "enigma"],
        antonyms: ["solution", "explanation"],
        example: "Solving this ancient conundrum required deep thought.",
      },
      {
        word: "Transcend",
        partOfSpeech: "verb",
        definition: "To go beyond limits or rise above.",
        synonyms: ["surpass", "exceed"],
        antonyms: ["fall behind", "fail"],
        example: "Her art transcended cultural barriers.",
      },
      {
        word: "Arcane",
        partOfSpeech: "adjective",
        definition: "Understood by few; mysterious.",
        synonyms: ["obscure", "esoteric"],
        antonyms: ["common", "well-known"],
        example: "The old manuscript contained arcane knowledge.",
      },
      {
        word: "Formidable",
        partOfSpeech: "adjective",
        definition: "Inspiring fear or respect due to size, strength, or skill.",
        synonyms: ["intimidating", "powerful"],
        antonyms: ["weak", "unimpressive"],
        example: "The chess champion was a formidable opponent.",
      },
    ],
    
  };
  

  const skillLevels = ["Rookie", "Racer", "Master", "Prodigy", "Wizard"];
  const skillLevelColors = {
    Rookie: ["#FF0000", "#FF7F00"], // Red to Orange
    Racer: ["#FFFF00", "#00FF00"], // Yellow to Green
    Master: ["#00FF00", "#0000FF"], // Green to Blue
    Prodigy: ["#00FFFF", "#FF00FF"], // Cyan to Magenta
    Wizard: ["#800080", "#4B0082"], // Purple to Indigo
  };

  const currentWord = vocabularyData[skillLevel][currentWordIndex];

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % vocabularyData[skillLevel].length);
    setShowDefinition(false);
    setRecordedAudio(null); // Clear recorded audio
  };

  const handleShowDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  const pronounceSection = (text) => {
    Speech.speak(text, { language: 'en-US' });
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordedAudio(uri);
  };

  const playRecordedAudio = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: recordedAudio });
    setIsPlaying(true);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.skillLevelText}>Skill Level: {skillLevel}</Text>

      <View style={styles.skillLevelButtons}>
        {skillLevels.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => {
              setSkillLevel(level);
              setCurrentWordIndex(0);
              setShowDefinition(false);
              setRecordedAudio(null); // Clear recorded audio when changing levels
            }}
          >
            <LinearGradient
              colors={skillLevelColors[level]}
              style={styles.skillButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.skillButtonText}>{level}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.wordText}>{currentWord.word}</Text>
      <Text style={styles.partOfSpeechText}>({currentWord.partOfSpeech})</Text>

      <TouchableOpacity onPress={() => pronounceSection(currentWord.word)} style={styles.smallButton}>
        <Text style={styles.buttonText}>Pronounce Word</Text>
      </TouchableOpacity>

      {showDefinition && (
        <View style={styles.definitionContainer}>
          <Text style={styles.definitionText}>
            Definition: {currentWord.definition}
          </Text>
          <TouchableOpacity onPress={() => pronounceSection(currentWord.definition)} style={styles.smallButton}>
            <Text style={styles.buttonText}>Pronounce Definition</Text>
          </TouchableOpacity>

          <Text style={styles.synonymsText}>
            Synonyms: {currentWord.synonyms.join(", ")}
          </Text>
          <TouchableOpacity onPress={() => pronounceSection(currentWord.synonyms.join(", "))} style={styles.smallButton}>
            <Text style={styles.buttonText}>Pronounce Synonyms</Text>
          </TouchableOpacity>

          <Text style={styles.antonymsText}>
            Antonyms: {currentWord.antonyms.join(", ")}
          </Text>
          <TouchableOpacity onPress={() => pronounceSection(currentWord.antonyms.join(", "))} style={styles.smallButton}>
            <Text style={styles.buttonText}>Pronounce Antonyms</Text>
          </TouchableOpacity>

          <Text style={styles.exampleText}>
            Example: {currentWord.example}
          </Text>
          <TouchableOpacity onPress={() => pronounceSection(currentWord.example)} style={styles.smallButton}>
            <Text style={styles.buttonText}>Pronounce Example</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleShowDefinition} style={styles.button}>
        <Text style={styles.buttonText}>
          {showDefinition ? "Hide Definition" : "Show Definition"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNextWord} style={styles.button}>
        <Text style={styles.buttonText}>Next Word</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  skillLevelText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  skillLevelButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  skillButton: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  skillButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  wordText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  partOfSpeechText: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 20,
  },
  definitionContainer: {
    marginBottom: 20,
  },
  definitionText: {
    fontSize: 18,
    marginBottom: 10,
  },
  synonymsText: {
    fontSize: 16,
    color: "green",
    marginBottom: 10,
  },
  antonymsText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  exampleText: {
    fontSize: 16,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "80%",
    alignItems: "center",
  },
  smallButton: {
    backgroundColor: "#6200ea",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default VocabularyScreen;