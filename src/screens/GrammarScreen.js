import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Quiz data for different grade levels
const quizzes = {
  "Class I": [
    {
      question: "Which sentence uses the correct tense?",
      options: ["She go to school.", "She goes to school.", "She going to school."],
      correctAnswer: 1,
      explanation: "The correct sentence is 'She goes to school' because the subject 'She' requires the verb 'goes' in the present tense.",
    },
    {
      question: "Fill in the blank: The cat is ___ the table.",
      options: ["on", "in", "at"],
      correctAnswer: 0,
      explanation: "The correct preposition is 'on' because the cat is placed above the table.",
    },
  ],
  "Class V": [
    {
      question: "Which sentence is in the past tense?",
      options: ["She is going to school.", "She went to school.", "She goes to school."],
      correctAnswer: 1,
      explanation: "The correct sentence is 'She went to school' because 'went' is the past tense of 'go'.",
    },
  ],
  // Add more grades and questions as needed
};

const GrammarScreen = () => {
  const [selectedGrade, setSelectedGrade] = useState("Class I");
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = quizzes[selectedGrade][currentQuizIndex];

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === currentQuiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setCurrentQuizIndex((prev) => (prev + 1) % quizzes[selectedGrade].length);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grammar Mastery Quizzes</Text>
      <View style={styles.gradeSelector}>
        <Text>Select Grade: </Text>
        <View style={styles.select}>
          {Object.keys(quizzes).map((grade) => (
            <TouchableOpacity
              key={grade}
              onPress={() => {
                setSelectedGrade(grade);
                setCurrentQuizIndex(0);
                setSelectedAnswer(null);
                setShowFeedback(false);
              }}
              style={[
                styles.gradeButton,
                selectedGrade === grade && styles.selectedGradeButton,
              ]}
            >
              <Text style={styles.gradeButtonText}>{grade}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.quizContainer}>
        <Text style={styles.question}>{currentQuiz.question}</Text>
        {currentQuiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleAnswerClick(index)}
            style={[
              styles.optionButton,
              showFeedback &&
                (index === currentQuiz.correctAnswer
                  ? styles.correctOption
                  : styles.incorrectOption),
            ]}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackText}>
              {selectedAnswer === currentQuiz.correctAnswer
                ? "Correct!"
                : "Incorrect. Try again!"}
            </Text>
            <Text style={styles.explanation}>{currentQuiz.explanation}</Text>
            <TouchableOpacity onPress={handleNextQuiz} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next Quiz</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gradeSelector: {
    marginBottom: 20,
  },
  select: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gradeButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  selectedGradeButton: {
    backgroundColor: '#007bff',
  },
  gradeButtonText: {
    color: '#000',
  },
  quizContainer: {
    width: '100%',
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
  },
  correctOption: {
    backgroundColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: '#F44336',
  },
  optionText: {
    fontSize: 16,
  },
  feedbackContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  explanation: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  scoreContainer: {
    marginTop: 20,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GrammarScreen;