import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// Import your big allQuestions data
import { allQuestions } from "../data/battleQuestions";

import session from '../services/session';  // Add this line

const SkillsTestScreen = ({ route, navigation }) => {
  // Default values and parameter handling
  const defaultModule = 'Spelling';
  const defaultClassLevel = 1;
  const params = route?.params || {};
  const module = params.module || defaultModule;
  const classLevel = params.classLevel || defaultClassLevel;

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isLoading, setIsLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [testSubmitted, setTestSubmitted] = useState(false);

  const getQuestionsForTest = (module, classLevel) => {
    if (module === 'all') {
      // Combine questions from all modules
      let allQs = [];
      Object.keys(allQuestions).forEach(mod => {
        const modQs = allQuestions[mod][classLevel];
        if (Array.isArray(modQs)) {
          allQs = [...allQs, ...modQs];
        } else {
          Object.values(modQs).forEach(qType => {
            allQs = [...allQs, ...qType];
          });
        }
      });
      return allQs.sort(() => 0.5 - Math.random()).slice(0, 20);
    } else {
      // Get specific module questions
      const modQs = allQuestions[module][classLevel];
      return Array.isArray(modQs) 
        ? modQs.sort(() => 0.5 - Math.random()).slice(0, 10)
        : Object.values(modQs).flat().sort(() => 0.5 - Math.random()).slice(0, 10);
    }
  };

  // Helper functions defined before useEffect hooks
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
    
    // Only auto-advance if not the last question
    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1);
      }, 500);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      // Treat unanswered questions as incorrect
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
      // Unanswered questions (undefined) won't increment correct count
    });
    return Math.round((correct / questions.length) * 100);
  };

  const submitTest = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setTestSubmitted(true);
    
    // Determine module name (handle full diagnostic case)
    const moduleName = route.params?.isFullDiagnostic ? 'Full Diagnostic' : module;
    
    // Save to session
    session.saveResult(moduleName, finalScore);
  
    setTimeout(() => {
      navigation.navigate('SkillsAnalysisResultsScreen');
    }, 1000);
  };

  // Load questions
  useEffect(() => {
    const loadQuestions = () => {
      try {
        setIsLoading(true);
        const testQuestions = getQuestionsForTest(module, classLevel);
        setQuestions(testQuestions);
      } catch (error) {
        Alert.alert("Error", "Couldn't load questions");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadQuestions();
  }, [module, classLevel]);

  // Timer
  useEffect(() => {
    const timer = timeLeft > 0 && !testSubmitted && setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, testSubmitted]);

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>Preparing your test...</Text>
      </View>
    );
  }

  // Render error state if no questions
  if (questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={50} color="#ff5722" />
        <Text style={styles.errorText}>No questions available for this module.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render results after submission
  if (testSubmitted) {
  return (
    <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.resultContainer}>
      <Text style={styles.resultTitle}>Test Completed!</Text>
      
      {score === 0 ? (
        <ActivityIndicator color="white" size="large" />
      ) : (
        <>
          <Text style={styles.resultScore}>{score}%</Text>
          <Text style={styles.resultFeedback}>
            {score >= 80 ? 'Excellent!' : score >= 60 ? 'Good!' : 'Keep trying!'}
          </Text>
        </>
      )}
    </LinearGradient>
  );
}

  // Main test interface
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      {/* Header with progress and timer */}
      <LinearGradient
        colors={['#6200ea', '#3700b3']}
        style={styles.header}
      >
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Question {currentQuestionIndex + 1}/{questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }
              ]}
            />
          </View>
        </View>
        
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="white" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
      </LinearGradient>

      {/* Question Area */}
      <ScrollView contentContainerStyle={styles.questionContainer}>
        <Text style={styles.moduleTag}>{module} Test</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionType}>{currentQuestion.type || module}</Text>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          {currentQuestion.word && (
            <View style={styles.wordContainer}>
              <Ionicons name="volume-high-outline" size={24} color="#6200ea" />
              <Text style={styles.wordText}>Word: {currentQuestion.word}</Text>
            </View>
          )}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswers[currentQuestionIndex] === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(currentQuestionIndex, index)}
              activeOpacity={0.7}
            >
              <View style={styles.optionIndicator}>
                {selectedAnswers[currentQuestionIndex] === index ? (
                  <Ionicons name="radio-button-on" size={20} color="#6200ea" />
                ) : (
                  <Ionicons name="radio-button-off" size={20} color="#757575" />
                )}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentQuestionIndex === 0 ? "#bdbdbd" : "#6200ea"} />
          <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledButton]}>
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < questions.length - 1 ? (
  <TouchableOpacity
    style={styles.navButton}
    onPress={() => setCurrentQuestionIndex(prev => prev + 1)}
  >
    <Text style={styles.navButtonText}>Next</Text>
    <Ionicons name="chevron-forward" size={24} color="#6200ea" />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={[styles.navButton, styles.submitButton]}
    onPress={submitTest}
  >
    <Text style={[styles.navButtonText, styles.submitButtonText]}>
      Submit Test
    </Text>
  </TouchableOpacity>
)}
      </View>
    </View>
  );
};

// ... (keep your existing styles)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  backButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    padding: 15,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
  questionContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  moduleTag: {
    fontSize: 14,
    color: '#6200ea',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  questionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  questionType: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 5,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  wordText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#6200ea',
    backgroundColor: '#f3e5ff',
  },
  optionIndicator: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  navButtonText: {
    fontSize: 16,
    color: '#6200ea',
    fontWeight: '600',
    marginHorizontal: 5,
  },
  disabledButton: {
    color: '#bdbdbd',
  },
  submitButton: {
    backgroundColor: '#6200ea',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  submitButtonText: {
    color: 'white',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 72,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  resultFeedback: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default SkillsTestScreen;