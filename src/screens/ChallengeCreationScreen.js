import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from "react-native";
import {
  Card,
  TextInput,
  Button,
  Text,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { auth, firestore, serverTimestamp } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const ChallengeCreationScreen = ({ navigation }) => {
  // Challenge metadata - default to Daily
  const [challengeName, setChallengeName] = useState("");
  const [challengeType, setChallengeType] = useState("Daily");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  // Questions state
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    module: "Spelling",
    type: "Multiple Choice",
    text: "",
    options: ["", "", "", ""],
    correctOption: "A",
    correctAnswer: ""
  });

  // UI controls
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Data options
  const moduleOptions = ["Spelling", "Reading", "Pronunciation", "Grammar", "Writing", "Listening", "Vocabulary"];
  const challengeTypes = ["Daily", "Weekly", "Monthly"];
  const questionTypes = ["Multiple Choice", "Fill in the Blank", "True or False"];

  const requiredQuestionCount = {
    Daily: 2,
    Weekly: 5,
    Monthly: 10
  }[challengeType];

  // Set appropriate end date when challenge type changes
  useEffect(() => {
    const newEndDate = new Date(startDate);
    if (challengeType === "Daily") {
      // Same day for daily challenge
      setEndDate(new Date(startDate));
    } else if (challengeType === "Weekly") {
      newEndDate.setDate(newEndDate.getDate() + 7);
      setEndDate(newEndDate);
    } else {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
      setEndDate(newEndDate);
    }
  }, [challengeType, startDate]);

  // Date handlers
  const handleDateChange = (date, setDate, setShowPicker) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (date) setDate(date);
  };

  // Question management
  const handleAddQuestion = () => {
    if (!currentQuestion.text.trim()) {
      Alert.alert("Validation", "Please enter the question text.");
      return;
    }

    const questionData = { ...currentQuestion };
    
    if (questionData.type === "Multiple Choice") {
      if (questionData.options.some(opt => !opt.trim())) {
        Alert.alert("Validation", "Please fill all option fields.");
        return;
      }
    } else if (!questionData.correctAnswer.trim()) {
      Alert.alert("Validation", "Please enter the correct answer.");
      return;
    }

    setQuestions([...questions, questionData]);
    resetQuestionForm();
  };

  const resetQuestionForm = () => {
    setCurrentQuestion({
      module: "Spelling",
      type: "Multiple Choice",
      text: "",
      options: ["", "", "", ""],
      correctOption: "A",
      correctAnswer: ""
    });
  };

  // Firestore submission
  const handleFinalize = async () => {
    if (!challengeName.trim()) {
      Alert.alert("Validation", "Please enter a challenge name.");
      return;
    }

    if (questions.length < requiredQuestionCount) {
      Alert.alert("Validation", `${challengeType} challenge requires ${requiredQuestionCount} questions. Please add ${requiredQuestionCount - questions.length} more.`);
      return;
    }

    setLoading(true);

    try {
      const datePrefix = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const challengeId = `challenge_${datePrefix}_${Math.random().toString(36).substr(2, 6)}`;
      
      const challengeRef = doc(firestore, "challenges", challengeId);

      await setDoc(challengeRef, {
        id: challengeId,
        title: challengeName,
        type: challengeType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        questions,
        status: "active",
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser?.uid,
        participantCount: 0,
        submissionCount: 0
      });

      Alert.alert("Success", "Challenge created successfully!");
      navigation.navigate("Challenges", {
        screen: "ChallengesMain",
        params: { refresh: true }
      });
      
    } catch (error) {
      console.error("Firestore error:", error);
      Alert.alert("Error", error.message.includes("permission") 
        ? "You don't have permission to create challenges" 
        : "Failed to save challenge. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" color="#6200ee" />
        <Text>Saving Challenge...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title 
          title="Create Challenge" 
          titleStyle={styles.title}
          subtitle={`${challengeType} Challenge`} 
        />
        <Card.Content>
          {/* Challenge Info Section */}
          <TextInput
            label="Challenge Name"
            mode="outlined"
            value={challengeName}
            onChangeText={setChallengeName}
            style={styles.input}
            placeholder="e.g. Daily Spelling Challenge"
          />

          <Text style={styles.label}>Challenge Type</Text>
          <Picker
            selectedValue={challengeType}
            onValueChange={(val) => {
              setChallengeType(val);
              setQuestions([]);
            }}
            style={styles.picker}
            dropdownIconColor="#6200ee"
          >
            {challengeTypes.map(type => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>

          <View style={styles.dateRow}>
            <Button
              mode="outlined"
              onPress={() => setShowStartDatePicker(true)}
              icon="calendar"
              style={styles.dateButton}
              labelStyle={styles.buttonText}
            >
              {startDate.toLocaleDateString()}
            </Button>
            {challengeType !== "Daily" && (
              <Button
                mode="outlined"
                onPress={() => setShowEndDatePicker(true)}
                icon="calendar"
                style={styles.dateButton}
                labelStyle={styles.buttonText}
              >
                {endDate.toLocaleDateString()}
              </Button>
            )}
          </View>

          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => handleDateChange(date, setStartDate, setShowStartDatePicker)}
              minimumDate={new Date()} // Can't select past dates
            />
          )}

          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_, date) => handleDateChange(date, setEndDate, setShowEndDatePicker)}
              minimumDate={startDate} // End date can't be before start date
            />
          )}

          <Divider style={styles.divider} />

          {/* Questions Progress */}
          <Text style={styles.progressText}>
            {questions.length}/{requiredQuestionCount} Questions Added
          </Text>

          {/* Question Form */}
          {questions.length < requiredQuestionCount ? (
            <>
              <Text style={styles.sectionTitle}>Question {questions.length + 1}</Text>

              <Text style={styles.label}>Module</Text>
              <Picker
                selectedValue={currentQuestion.module}
                onValueChange={(val) => setCurrentQuestion(prev => ({...prev, module: val}))}
                style={styles.picker}
                dropdownIconColor="#6200ee"
              >
                {moduleOptions.map(mod => (
                  <Picker.Item key={mod} label={mod} value={mod} />
                ))}
              </Picker>

              <Text style={styles.label}>Question Type</Text>
              <Picker
                selectedValue={currentQuestion.type}
                onValueChange={(val) => setCurrentQuestion(prev => ({...prev, type: val}))}
                style={styles.picker}
                dropdownIconColor="#6200ee"
              >
                {questionTypes.map(type => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>

              <TextInput
                label="Question Text"
                mode="outlined"
                value={currentQuestion.text}
                onChangeText={(text) => setCurrentQuestion(prev => ({...prev, text}))}
                multiline
                style={styles.input}
                placeholder="Enter your question here"
              />

              {currentQuestion.type === "Multiple Choice" ? (
                <>
                  {currentQuestion.options.map((option, index) => (
                    <TextInput
                      key={`option-${index}`}
                      label={`Option ${String.fromCharCode(65 + index)}`}
                      mode="outlined"
                      value={option}
                      onChangeText={(text) => {
                        const newOptions = [...currentQuestion.options];
                        newOptions[index] = text;
                        setCurrentQuestion(prev => ({...prev, options: newOptions}));
                      }}
                      style={styles.input}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}

                  <Text style={styles.label}>Correct Answer</Text>
                  <Picker
                    selectedValue={currentQuestion.correctOption}
                    onValueChange={(val) => setCurrentQuestion(prev => ({...prev, correctOption: val}))}
                    style={styles.picker}
                    dropdownIconColor="#6200ee"
                  >
                    {currentQuestion.options.map((_, index) => (
                      <Picker.Item 
                        key={`correct-${index}`} 
                        label={String.fromCharCode(65 + index)} 
                        value={String.fromCharCode(65 + index)} 
                      />
                    ))}
                  </Picker>
                </>
              ) : (
                <TextInput
                  label="Correct Answer"
                  mode="outlined"
                  value={currentQuestion.correctAnswer}
                  onChangeText={(text) => setCurrentQuestion(prev => ({...prev, correctAnswer: text}))}
                  style={styles.input}
                  placeholder={
                    currentQuestion.type === "True or False" 
                      ? "Enter 'True' or 'False'" 
                      : "Enter the correct answer"
                  }
                />
              )}

              <Button
                mode="contained"
                onPress={handleAddQuestion}
                style={styles.addButton}
                labelStyle={styles.buttonText}
                disabled={!currentQuestion.text.trim()}
              >
                Add Question
              </Button>
            </>
          ) : (
            <Button
              mode="contained"
              onPress={handleFinalize}
              style={styles.finalizeButton}
              labelStyle={styles.buttonText}
            >
              Publish Challenge
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  label: {
    marginVertical: 8,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  picker: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    marginHorizontal: 4,
    borderColor: '#6200ee',
  },
  divider: {
    marginVertical: 16,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  progressText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    color: '#6200ee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
    color: '#333',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#6200ee',
  },
  finalizeButton: {
    marginTop: 16,
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

export default ChallengeCreationScreen;