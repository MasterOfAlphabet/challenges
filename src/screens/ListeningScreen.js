import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Speech from "expo-speech";
import {
  Feather,
  Ionicons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

// Mock data for comprehension titles
const comprehensionTitles = [
  { id: 1, title: "The Cat and the Mouse", level: "Beginner" },
  { id: 2, title: "The Solar System", level: "Intermediate" },
  { id: 3, title: "Climate Change", level: "Advanced" },
];

// Mock data for listening passages
const listeningPassages = [
  {
    id: 1,
    title: "The Cat and the Mouse",
    passage:
      "Once upon a time, a cat and a mouse lived in the same house. The cat was lazy, but the mouse was very hardworking. One day, the mouse found a piece of cheese and decided to save it for the winter. The cat, however, wanted to eat the cheese right away.",
    questions: [
      {
        question: "What did the mouse find?",
        options: ["A piece of bread", "A piece of cheese", "A piece of cake"],
        correctAnswer: 1,
        explanation:
          "The mouse found a piece of cheese, as mentioned in the passage.",
      },
      {
        question: "What did the cat want to do with the cheese?",
        options: [
          "Save it for winter",
          "Eat it right away",
          "Share it with the mouse",
        ],
        correctAnswer: 1,
        explanation:
          "The cat wanted to eat the cheese right away, as stated in the passage.",
      },
    ],
  },
  {
    id: 2,
    title: "The Solar System",
    passage:
      "The solar system consists of the Sun and the objects that orbit around it, including planets, moons, asteroids, and comets. The Sun is the largest object in the solar system and provides light and heat to all the planets.",
    questions: [
      {
        question: "What is the largest object in the solar system?",
        options: ["Earth", "The Sun", "Jupiter"],
        correctAnswer: 1,
        explanation:
          "The Sun is the largest object in the solar system, as mentioned in the passage.",
      },
      {
        question: "What does the Sun provide to the planets?",
        options: ["Light and heat", "Water and air", "Food and shelter"],
        correctAnswer: 0,
        explanation:
          "The Sun provides light and heat to the planets, as stated in the passage.",
      },
    ],
  },
  {
    id: 3,
    title: "Climate Change",
    passage:
      "Climate change refers to long-term changes in temperature and weather patterns, primarily caused by human activities such as burning fossil fuels and deforestation. These activities increase the concentration of greenhouse gases in the atmosphere, leading to global warming.",
    questions: [
      {
        question: "What is the primary cause of climate change?",
        options: ["Natural disasters", "Human activities", "Volcanic eruptions"],
        correctAnswer: 1,
        explanation:
          "Human activities, such as burning fossil fuels and deforestation, are the primary cause of climate change.",
      },
      {
        question: "What do greenhouse gases cause?",
        options: ["Global cooling", "Global warming", "No effect"],
        correctAnswer: 1,
        explanation:
          "Greenhouse gases cause global warming, as mentioned in the passage.",
      },
    ],
  },
];

// Mock data for sentences
const sentences = {
  "Very Short": "The sun shines.",
  Short: "Birds fly in the sky.",
  Long: "The quick brown fox jumps over the lazy dog.",
  "Very Long": "Despite the heavy rain, the children continued to play in the park.",
  "Extremely Long":
    "The majestic mountain stood tall, covered in a blanket of snow, as the sun slowly rose over the horizon.",
};

// Mock data for paragraphs
const paragraphs = [
  "The early bird catches the worm. This is a well-known saying that emphasizes the importance of starting your day early.",
  "A journey of a thousand miles begins with a single step. This proverb reminds us that every big achievement starts with a small action.",
  "Practice makes perfect. The more you practice, the better you become at any skill.",
  "Honesty is the best policy. Being truthful and honest always leads to better outcomes in life.",
  "Where there's a will, there's a way. If you are determined to achieve something, you will find a way to do it.",
];

// Mock data for words
const words = ["apple", "banana", "cherry", "date", "elderberry"];

// 4 categories in a 2x2 grid, each with a color
const categories = [
  {
    key: "Words",
    label: "Words",
    icon: <Feather name="type" size={40} color="#fff" />,
    color: "#4caf50",
  },
  {
    key: "Sentences",
    label: "Sentences",
    icon: <Ionicons name="text" size={40} color="#fff" />,
    color: "#ff9800",
  },
  {
    key: "Paragraphs",
    label: "Paragraphs",
    icon: <FontAwesome name="paragraph" size={40} color="#fff" />,
    color: "#9c27b0",
  },
  {
    key: "Comprehension",
    label: "Comprehension",
    icon: <MaterialIcons name="menu-book" size={40} color="#fff" />,
    color: "#2196f3",
  },
];

const ListeningScreen = () => {
  // Default category = "Words"
  const [selectedCategory, setSelectedCategory] = useState("Words");
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const [selectedLevel, setSelectedLevel] = useState("Rookie");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [selectedLines, setSelectedLines] = useState("");
  const [selectedSentence, setSelectedSentence] = useState("");
  const [selectedWords, setSelectedWords] = useState("");
  const [currentPassage, setCurrentPassage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPassageRead, setIsPassageRead] = useState(false);

  // Category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedTitle("");
    setSelectedLines("");
    setSelectedSentence("");
    setSelectedWords("");
    setCurrentPassage(null);
    setIsPassageRead(false);
    setShowResults(false);
    setFeedback("");
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
  };

  // Class & Level
  const handleClassChange = (value) => {
    setSelectedClass(value);
  };
  const handleLevelChange = (value) => {
    setSelectedLevel(value);
  };

  // Title
  const handleTitleChange = (value) => {
    setSelectedTitle(value);
    const passage = listeningPassages.find((p) => p.title === value);
    setCurrentPassage(passage);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFeedback("");
    setIsPassageRead(false);
  };

  // Lines (Paragraphs)
  const handleLinesChange = (value) => {
    setSelectedLines(value);
  };

  // Sentence
  const handleSentenceChange = (value) => {
    setSelectedSentence(value);
  };

  // Words
  const handleWordsChange = (value) => {
    setSelectedWords(value);
  };

  // Answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    const currentQuestion = currentPassage.questions[questionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setFeedback(`Correct! ${currentQuestion.explanation}`);
    } else {
      setFeedback(
        `Incorrect. The correct answer is: "${
          currentQuestion.options[currentQuestion.correctAnswer]
        }". ${currentQuestion.explanation}`
      );
    }
  };

  // Next question
  const nextQuestion = () => {
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback("");
    } else {
      setShowResults(true);
    }
  };

  // Score
  const calculateScore = () => {
    if (!currentPassage) {
      return { score: "0/0", feedbackMessage: "" };
    }
    const correctCount = Object.values(selectedAnswers).filter(
      (answer, idx) => answer === currentPassage.questions[idx].correctAnswer
    ).length;
    const total = currentPassage.questions.length;
    const scorePercent = (correctCount / total) * 100;

    let feedbackMessage = "";
    if (scorePercent === 100) {
      feedbackMessage = "Amazing job! You got all answers right.";
    } else if (scorePercent >= 70) {
      feedbackMessage =
        "Good work! You did well, but there's room for improvement.";
    } else {
      feedbackMessage = "Keep practicing to improve your listening skills!";
    }
    return { score: `${correctCount}/${total}`, feedbackMessage };
  };

  // Start listening
  const startListeningComprehension = () => {
    if (currentPassage) {
      Speech.speak(currentPassage.title, {
        onDone: () => {
          Speech.speak(currentPassage.passage, {
            onDone: () => {
              setIsPassageRead(true);
            },
          });
        },
      });
    }
  };

  const startReadingParagraphs = () => {
    const lines = parseInt(selectedLines, 10);
    const paragraph = paragraphs[lines - 1] || paragraphs[0];
    Speech.speak(paragraph, {
      onDone: () => {
        Alert.alert("Repeat", "Please repeat the paragraph.");
      },
    });
  };

  const startReadingSentences = () => {
    const sentence = sentences[selectedSentence];
    Speech.speak(sentence, {
      onDone: () => {
        Alert.alert("Repeat", "Please repeat the sentence.");
      },
    });
  };

  const startReadingWords = () => {
    const wordCount = parseInt(selectedWords, 10);
    const selectedWordsList = words.slice(0, wordCount).join(", ");
    Speech.speak(selectedWordsList, {
      onDone: () => {
        Alert.alert("Repeat", "Please repeat the words.");
      },
    });
  };

  // We'll apply a color scheme to the body area based on the selectedCategory
  const categoryColor = categories.find((c) => c.key === selectedCategory)?.color || "#9e9e9e";

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: categoryColor + "20" }, // slight tint
      ]}
    >
      <Text style={styles.screenTitle}>Listening Skills</Text>

      {/* 2x2 Grid for Categories */}
      <View style={styles.categoryGrid}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[
              styles.categoryCard,
              { backgroundColor: cat.color },
              cat.key === selectedCategory && styles.categoryCardSelected,
            ]}
            onPress={() => handleCategorySelect(cat.key)}
          >
            {cat.icon}
            <Text style={styles.categoryText}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* The body container for selected category, with a slightly deeper color? */}
      <View style={[styles.bodyContainer, { borderColor: categoryColor }]}>
        {/* Class and Level */}
        <Text style={styles.label}>Class Group:</Text>
        <Picker
          selectedValue={selectedClass}
          style={styles.dropdown}
          onValueChange={handleClassChange}
        >
          <Picker.Item label="Class I & II" value="Class I & II" />
          <Picker.Item label="Class III to V" value="Class III to V" />
          <Picker.Item label="Class VI to X" value="Class VI to X" />
        </Picker>

        <Text style={styles.label}>Level:</Text>
        <Picker
          selectedValue={selectedLevel}
          style={styles.dropdown}
          onValueChange={handleLevelChange}
        >
          <Picker.Item label="Rookie" value="Rookie" />
          <Picker.Item label="Racer" value="Racer" />
          <Picker.Item label="Master" value="Master" />
          <Picker.Item label="Prodigy" value="Prodigy" />
          <Picker.Item label="Wizard" value="Wizard" />
        </Picker>

        {/* Category-specific UI */}
        {selectedCategory === "Comprehension" && (
          <>
            <Text style={styles.label}>Select a Title:</Text>
            <Picker
              selectedValue={selectedTitle}
              style={styles.dropdown}
              onValueChange={handleTitleChange}
            >
              <Picker.Item label="-- Select a Title --" value="" />
              {comprehensionTitles.map((item) => (
                <Picker.Item
                  key={item.id}
                  label={item.title}
                  value={item.title}
                />
              ))}
            </Picker>

            {currentPassage && !isPassageRead && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: categoryColor }]}
                onPress={startListeningComprehension}
              >
                <Text style={styles.actionButtonText}>
                  Start Listening Comprehension
                </Text>
              </TouchableOpacity>
            )}

            {currentPassage && isPassageRead && !showResults && (
              <View style={styles.questionContainer}>
                <Text style={styles.questionTitle}>
                  {currentPassage.questions[currentQuestionIndex].question}
                </Text>
                {currentPassage.questions[currentQuestionIndex].options.map(
                  (option, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.optionButton}
                      onPress={() => handleAnswerSelect(currentQuestionIndex, idx)}
                      disabled={feedback !== ""}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  )
                )}
                {feedback !== "" && (
                  <Text style={styles.feedbackText}>{feedback}</Text>
                )}
                {feedback !== "" && (
                  <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: categoryColor }]}
                    onPress={nextQuestion}
                  >
                    <Text style={styles.nextButtonText}>
                      {currentQuestionIndex <
                      currentPassage.questions.length - 1
                        ? "Next Question"
                        : "Finish"}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}

        {selectedCategory === "Paragraphs" && (
          <>
            <Text style={styles.label}>Select # of Lines:</Text>
            <Picker
              selectedValue={selectedLines}
              style={styles.dropdown}
              onValueChange={handleLinesChange}
            >
              <Picker.Item label="-- Select Lines --" value="" />
              <Picker.Item label="1 Line" value="1" />
              <Picker.Item label="2 Lines" value="2" />
              <Picker.Item label="3 Lines" value="3" />
              <Picker.Item label="4 Lines" value="4" />
              <Picker.Item label="5 Lines" value="5" />
            </Picker>

            {selectedLines !== "" && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: categoryColor }]}
                onPress={startReadingParagraphs}
              >
                <Text style={styles.actionButtonText}>Read Paragraph</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {selectedCategory === "Sentences" && (
          <>
            <Text style={styles.label}>Select Sentence Length:</Text>
            <Picker
              selectedValue={selectedSentence}
              style={styles.dropdown}
              onValueChange={handleSentenceChange}
            >
              <Picker.Item label="-- Select Sentence --" value="" />
              <Picker.Item label="Very Short" value="Very Short" />
              <Picker.Item label="Short" value="Short" />
              <Picker.Item label="Long" value="Long" />
              <Picker.Item label="Very Long" value="Very Long" />
              <Picker.Item label="Extremely Long" value="Extremely Long" />
            </Picker>

            {selectedSentence !== "" && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: categoryColor }]}
                onPress={startReadingSentences}
              >
                <Text style={styles.actionButtonText}>Read Sentence</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {selectedCategory === "Words" && (
          <>
            <Text style={styles.label}>Select # of Words:</Text>
            <Picker
              selectedValue={selectedWords}
              style={styles.dropdown}
              onValueChange={handleWordsChange}
            >
              <Picker.Item label="-- Select Words --" value="" />
              <Picker.Item label="1 Word" value="1" />
              <Picker.Item label="2 Words" value="2" />
              <Picker.Item label="3 Words" value="3" />
              <Picker.Item label="4 Words" value="4" />
              <Picker.Item label="5 Words" value="5" />
            </Picker>

            {selectedWords !== "" && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: categoryColor }]}
                onPress={startReadingWords}
              >
                <Text style={styles.actionButtonText}>Read Words</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {showResults && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              You scored {calculateScore().score}!
            </Text>
            <Text style={styles.resultsMessage}>
              {calculateScore().feedbackMessage}
            </Text>
            <Text style={styles.tipsTitle}>Tips to Improve:</Text>
            <Text style={styles.tipsText}>
              • Listen carefully to the passage.
              {"\n"}• Take notes while listening.
              {"\n"}• Review explanations for incorrect answers.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    // backgroundColor dynamically changed to categoryColor + "20" in the code
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4a148c",
    textAlign: "center",
    marginBottom: 20,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryCard: {
    width: (width - 60) / 2, // 2 columns with some margin
    borderRadius: 10,
    paddingVertical: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  categoryCardSelected: {
    // highlight selected if you want
    borderWidth: 2,
    borderColor: "#fff",
  },
  categoryText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  bodyContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 3,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#4a148c",
  },
  dropdown: {
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  questionContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  feedbackText: {
    marginTop: 10,
    fontStyle: "italic",
    color: "#333",
  },
  nextButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    marginVertical: 15,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    marginTop: 20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4a148c",
    textAlign: "center",
  },
  resultsMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#4a148c",
  },
  tipsText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
});

export default ListeningScreen;
