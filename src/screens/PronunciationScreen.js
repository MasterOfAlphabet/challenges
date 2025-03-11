
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button, ScrollView } from "react-native";
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';


const PronunciationScreen = () => {

  const navigation = useNavigation();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinitionExample, setShowDefinitionExample] = useState(false);
  const [skillLevel, setSkillLevel] = useState("Rookie");
  const [recording, setRecording] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const pronunciationData = {
    Rookie: [
      {
        word: "Happy",
        definition: "Feeling or showing pleasure or contentment.",
       
        example: "She felt happy after receiving the gift.",
      },
      {
        word: "Big",
        definition: "Of considerable size or extent.",
       
        example: "They live in a big house.",
      },
      // Add 8 more words for Rookie level
    ],
    Racer: [
      {
        word: "Accelerate",
        definition: "To increase in speed or amount.",
       
        example: "The car accelerated as it entered the highway.",
      },
      {
        word: "Navigate",
        definition: "To plan and direct the route or course of a journey.",
        
        example: "He navigated the ship through the storm.",
      },
      // Add 8 more words for Racer level
    ],
    Master: [
      {
        word: "Eloquent",
        definition: "Fluent or persuasive in speaking or writing.",
        
        example: "The speaker gave an eloquent speech.",
      },
      {
        word: "Pragmatic",
        definition: "Dealing with things sensibly and realistically.",
        
        example: "She took a pragmatic approach to solving the problem.",
      },
      // Add 8 more words for Master level
    ],
    Prodigy: [
      {
        word: "Ephemeral",
        definition: "Lasting for a very short time.",
        synonyms: ["transient", "fleeting"],
        antonyms: ["permanent", "eternal"],
        example: "The beauty of the sunset was ephemeral.",
      },
      {
        word: "Quintessential",
        definition: "Representing the most perfect or typical example of a quality or class.",
        synonyms: ["archetypal", "classic"],
        antonyms: ["atypical", "unusual"],
        example: "He is the quintessential gentleman.",
      },
      // Add 8 more words for Prodigy level
    ],
    Wizard: [
      {
        word: "Sesquipedalian",
        definition: "Given to using long words.",
        synonyms: ["verbose", "loquacious"],
        antonyms: ["concise", "succinct"],
        example: "The professor's sesquipedalian lecture confused the students.",
      },
      {
        word: "Antidisestablishmentarianism",
        definition: "Opposition to the disestablishment of the Church of England.",
        synonyms: ["opposition", "resistance"],
        antonyms: ["support", "approval"],
        example: "The debate focused on antidisestablishmentarianism.",
      },
      // Add 8 more words for Wizard level
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

  const currentWord = pronunciationData[skillLevel][currentWordIndex];

  const handleNextWord = () => {
    setCurrentWordIndex((prevIndex) => (prevIndex + 1) % pronunciationData[skillLevel].length);
    setShowDefinitionExample(false);
    setRecordedAudio(null); // Clear recorded audio
  };

  const handleShowDefinitionExample = () => {
    setShowDefinitionExample(!showDefinitionExample);
  };

  const pronounceWord = () => {
    Speech.speak(currentWord.word, { language: 'en-US' });
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

      <View style={styles.container}>
     
      <Button
        title="Pronunciation Practice"
        onPress={() => navigation.navigate('PronunciationPractice')}
      />
    </View>


      <View style={styles.skillLevelButtons}>
        {skillLevels.map((level) => (
          <TouchableOpacity
            key={level}
            onPress={() => {
              setSkillLevel(level);
              setCurrentWordIndex(0);
              setShowDefinitionExample(false);
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

      {showDefinitionExample && (
        <View style={styles.definitionContainer}>
          <Text style={styles.definitionText}>Definition: {currentWord.definition}</Text>
          
          <Text style={styles.exampleText}>Example: {currentWord.example}</Text>
        </View>
      )}

      <TouchableOpacity onPress={pronounceWord} style={styles.button}>
        <Text style={styles.buttonText}>Pronounce Word</Text>
      </TouchableOpacity>

      {recording ? (
        <TouchableOpacity onPress={stopRecording} style={styles.button}>
          <Text style={styles.buttonText}>Stop Recording</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startRecording} style={styles.button}>
          <Text style={styles.buttonText}>Record Your Pronunciation</Text>
        </TouchableOpacity>
      )}

      {recordedAudio && (
        <TouchableOpacity onPress={playRecordedAudio} style={styles.button}>
          <Text style={styles.buttonText}>
            {isPlaying ? "Playing..." : "Play Your Recording"}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={handleShowDefinitionExample} style={styles.button}>
        <Text style={styles.buttonText}>
          {showDefinitionExample ? "Hide Definition/Example" : "Show Definition/Example"}
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PronunciationScreen;