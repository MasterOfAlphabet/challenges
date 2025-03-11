import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker"; // Updated Picker import

// Mock data for comprehension titles
const comprehensionTitles = [
  { id: 1, title: "The Cat and the Mouse", level: "Beginner" },
  { id: 2, title: "The Solar System", level: "Intermediate" },
  { id: 3, title: "Climate Change", level: "Advanced" },
];

// Mock data for reading passages
const readingPassages = [
  {
    id: 1,
    title: "The Cat and the Mouse",
    passage: "Once upon a time, a cat and a mouse lived in the same house. The cat was lazy, but the mouse was very hardworking. One day, the mouse found a piece of cheese and decided to save it for the winter. The cat, however, wanted to eat the cheese right away.",
    questions: [
      {
        question: "What did the mouse find?",
        options: ["A piece of bread", "A piece of cheese", "A piece of cake"],
        correctAnswer: 1,
        explanation: "The mouse found a piece of cheese, as mentioned in the passage.",
      },
      {
        question: "What did the cat want to do with the cheese?",
        options: ["Save it for winter", "Eat it right away", "Share it with the mouse"],
        correctAnswer: 1,
        explanation: "The cat wanted to eat the cheese right away, as stated in the passage.",
      },
    ],
  },
  {
    id: 2,
    title: "The Solar System",
    passage: "The solar system consists of the Sun and the objects that orbit around it, including planets, moons, asteroids, and comets. The Sun is the largest object in the solar system and provides light and heat to all the planets.",
    questions: [
      {
        question: "What is the largest object in the solar system?",
        options: ["Earth", "The Sun", "Jupiter"],
        correctAnswer: 1,
        explanation: "The Sun is the largest object in the solar system, as mentioned in the passage.",
      },
      {
        question: "What does the Sun provide to the planets?",
        options: ["Light and heat", "Water and air", "Food and shelter"],
        correctAnswer: 0,
        explanation: "The Sun provides light and heat to the planets, as stated in the passage.",
      },
    ],
  },
  {
    id: 3,
    title: "Climate Change",
    passage: "Climate change refers to long-term changes in temperature and weather patterns, primarily caused by human activities such as burning fossil fuels and deforestation. These activities increase the concentration of greenhouse gases in the atmosphere, leading to global warming.",
    questions: [
      {
        question: "What is the primary cause of climate change?",
        options: ["Natural disasters", "Human activities", "Volcanic eruptions"],
        correctAnswer: 1,
        explanation: "Human activities, such as burning fossil fuels and deforestation, are the primary cause of climate change.",
      },
      {
        question: "What do greenhouse gases cause?",
        options: ["Global cooling", "Global warming", "No effect"],
        correctAnswer: 1,
        explanation: "Greenhouse gases cause global warming, as mentioned in the passage.",
      },
    ],
  },
];

const ReadingScreen = () => {
  const [selectedClass, setSelectedClass] = useState("Class I & II");
  const [selectedLevel, setSelectedLevel] = useState("Rookie");
  const [selectedTitle, setSelectedTitle] = useState("");
  const [currentPassage, setCurrentPassage] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [feedback, setFeedback] = useState("");

  // Handle class selection
  const handleClassChange = (value) => {
    setSelectedClass(value);
  };

  // Handle gamification level selection
  const handleLevelChange = (value) => {
    setSelectedLevel(value);
  };

  // Handle comprehension title selection
  const handleTitleChange = (value) => {
    setSelectedTitle(value);
    const passage = readingPassages.find((p) => p.title === value);
    setCurrentPassage(passage);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setFeedback("");
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));

    // Check if the answer is correct and provide feedback
    const currentQuestion = currentPassage.questions[questionIndex];
    if (optionIndex === currentQuestion.correctAnswer) {
      setFeedback("Correct! " + currentQuestion.explanation);
    } else {
      setFeedback(
        `Incorrect. The correct answer is: "${
          currentQuestion.options[currentQuestion.correctAnswer]
        }". ${currentQuestion.explanation}`
      );
    }
  };

  // Move to the next question
  const nextQuestion = () => {
    if (currentQuestionIndex < currentPassage.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setFeedback(""); // Clear feedback for the next question
    } else {
      setShowResults(true);
    }
  };

  // Calculate progress
  const progress = currentPassage
    ? ((currentQuestionIndex + 1) / currentPassage.questions.length) * 100
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Dropdowns for Class, Level, and Title */}
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={selectedClass}
          style={styles.dropdown}
          onValueChange={handleClassChange}
        >
          <Picker.Item label="Class I & II" value="Class I & II" />
          <Picker.Item label="Class III to V" value="Class III to V" />
          <Picker.Item label="Class VI to X" value="Class VI to X" />
        </Picker>

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

        <Picker
          selectedValue={selectedTitle}
          style={styles.dropdown}
          onValueChange={handleTitleChange}
        >
          <Picker.Item label="Select a Title" value="" />
          {comprehensionTitles.map((title) => (
            <Picker.Item key={title.id} label={title.title} value={title.title} />
          ))}
        </Picker>
      </View>

      {/* Display Passage and Questions */}
      {currentPassage && (
        <>
          <Text style={styles.title}>{currentPassage.title}</Text>
          <Text style={styles.passage}>{currentPassage.passage}</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          {/* Display Current Question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {currentPassage.questions[currentQuestionIndex].question}
            </Text>
            {currentPassage.questions[currentQuestionIndex].options.map((option, optionIndex) => (
              <TouchableOpacity
                key={optionIndex}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestionIndex] === optionIndex && styles.selectedOption,
                ]}
                onPress={() => handleAnswerSelect(currentQuestionIndex, optionIndex)}
                disabled={feedback !== ""} // Disable options after feedback is shown
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Feedback */}
          {feedback && <Text style={styles.feedbackText}>{feedback}</Text>}

          {/* Next Question Button */}
          {feedback && (
            <TouchableOpacity style={styles.button} onPress={nextQuestion}>
              <Text style={styles.buttonText}>
                {currentQuestionIndex < currentPassage.questions.length - 1 ? "Next Question" : "Finish"}
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}

      {/* Show Results */}
      {showResults && (
        <Text style={styles.resultsText}>
          You scored{" "}
          {Object.values(selectedAnswers).filter(
            (answer, index) => answer === currentPassage.questions[index].correctAnswer
          ).length}{" "}
          out of {currentPassage.questions.length}!
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  passage: {
    fontSize: 16,
    marginBottom: 20,
  },
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#76c7c0",
    borderRadius: 5,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: "#cce5ff",
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  feedbackText: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
    fontStyle: "italic",
  },
  resultsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
});

export default ReadingScreen;