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
} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";


const customTheme = {
  roundness: 8,
  colors: {
    primary: "#6200ee",
    accent: "#03dac4",
    background: "#f5f5f5",
    surface: "#fff",
    text: "#333",
    placeholder: "#888",
  },
};

/** 
 * A small helper that returns how many questions 
 * are required for the selected challenge type. 
 * E.g. 2 for daily, 5 for weekly, 10 for monthly, etc.
 */
function getQuestionCountForType(challengeType) {
  switch (challengeType) {
    case "Daily":
      return 2;
    case "Weekly":
      return 5;
    case "Monthly":
      return 10;
    default:
      // fallback or "Special"
      return 3;
  }
}

export default function ChallengeCreationScreen({ navigation, route }) {
  // Basic Challenge Info
  const [challengeName, setChallengeName] = useState("");
  const [challengeType, setChallengeType] = useState("Daily"); // single-select
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // For each question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]); // store all question objects

  // For the single question form
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [questionType, setQuestionType] = useState("Multiple Choice");
  const [questionText, setQuestionText] = useState("");

  // For multiple choice
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctMCAnswer, setCorrectMCAnswer] = useState("A");

  // For fill-in / T-F
  const [correctAnswer, setCorrectAnswer] = useState("");

  // Toggles for date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Data sets for pickers
  const classOptions = [
    "Class I",
    "Class II",
    "Class III",
    "Class IV",
    "Class V",
    "Class VI",
    "Class VII",
    "Class VIII",
    "Class IX",
    "Class X",
  ];
  const moduleOptions = [
    "Spelling",
    "Reading",
    "Pronunciation",
    "Grammar",
    "Writing",
    "Listening",
    "Vocabulary",
    "S.H.A.R.P",
    "8-in-1",
  ];
  const challengeTypes = ["Daily", "Weekly", "Monthly", "Special"];
  const questionTypes = ["Multiple Choice", "Fill in the Blank", "True or False"];

  // Computed: how many total questions are required
  const requiredQuestionCount = getQuestionCountForType(challengeType);

  // Start/End Date pickers
  const onStartDateChange = (event, date) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (date) setStartDate(date);
  };
  const onEndDateChange = (event, date) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (date) setEndDate(date);
  };

  /** 
   * Add the current question form data into "questions" array
   * and proceed to next question (if any).
   */
  const handleAddQuestion = () => {
    if (!questionText) {
      Alert.alert("Validation", "Please enter the question text.");
      return;
    }

    // Build question object
    let questionData = { 
      questionText, 
      module: selectedModule,
      questionType 
    };

    if (questionType === "Multiple Choice") {
      // MC
      if (!optionA || !optionB || !optionC || !optionD) {
        Alert.alert("Validation", "Please fill out all MC options.");
        return;
      }
      questionData.options = [optionA, optionB, optionC, optionD];
      questionData.correctOption = correctMCAnswer; 
    } else {
      // Fill-in or T-F
      if (!correctAnswer) {
        Alert.alert("Validation", "Please enter the correct answer.");
        return;
      }
      questionData.correctAnswer = correctAnswer;
    }

    // Add question to the array
    setQuestions((prev) => [...prev, questionData]);

    // Clear question form for next question
    setQuestionText("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectMCAnswer("A");
    setCorrectAnswer("");

    // Move index
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  /**
   * If user finishes the required number of questions, we can finalize the challenge.
   */
  const handleFinalize = () => {
    // Basic checks
    if (!challengeName) {
      Alert.alert("Validation", "Please enter a challenge name.");
      return;
    }

    if (questions.length < requiredQuestionCount) {
      Alert.alert(
        "Validation",
        `You must add exactly ${requiredQuestionCount} questions.`
      );
      return;
    }

    // Build the final object
    const newChallenge = {
      id: Date.now().toString(), // or random
      name: challengeName,
      type: challengeType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      module: "Mixed", // or we can store an array if each question might have a different module
      questionCount: questions.length,
      questionType: "Mixed", // because each question can have different type
      questions,
    };

    // Navigate back to e.g. "ChallengesScreen" with new challenge
    navigation.navigate("Challenges", {
        screen: "ChallengesScreen",
        params: {
          newChallenge: newChallenge,
        },
    });
  };

  // If we haven't reached the requiredQuestionCount, we keep showing the question form
  const stillNeedQuestions = questions.length < requiredQuestionCount;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Title
          title="Create a New Challenge"
          subtitle="Organize daily/weekly/monthly tasks"
          titleStyle={styles.heading}
        />
        <Card.Content>
          {/* Basic Info */}
          <Text style={styles.label}>Challenge Name</Text>
          <TextInput
            mode="outlined"
            value={challengeName}
            onChangeText={setChallengeName}
            style={styles.input}
            placeholder="e.g. Spelling Bee"
          />

          <Text style={styles.label}>Challenge Type</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={challengeType}
              style={styles.picker}
              onValueChange={(val) => {
                setChallengeType(val);
                // reset questions
                setQuestions([]);
                setCurrentQuestionIndex(0);
              }}
            >
              {challengeTypes.map((ct) => (
                <Picker.Item key={ct} label={ct} value={ct} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Start Date</Text>
          <Button
            mode="outlined"
            onPress={() => setShowStartDatePicker(true)}
            icon="calendar"
            style={styles.dateButton}
          >
            {startDate.toDateString()}
          </Button>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={onStartDateChange}
            />
          )}

          <Text style={[styles.label, { marginTop: 10 }]}>End Date</Text>
          <Button
            mode="outlined"
            onPress={() => setShowEndDatePicker(true)}
            icon="calendar"
            style={styles.dateButton}
          >
            {endDate.toDateString()}
          </Button>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={onEndDateChange}
            />
          )}

          <Divider style={styles.divider} />

          {/* Show how many questions we need */}
          <Text style={styles.label}>
            You need to create exactly {requiredQuestionCount} questions. 
          </Text>
          <Text style={{ marginBottom: 10 }}>
            Currently created: {questions.length}/{requiredQuestionCount}
          </Text>

          {/* If we still need questions, show question form */}
          {stillNeedQuestions && (
            <>
              <Text style={styles.label}>Question #{questions.length + 1}</Text>

              {/* Module for this question (optional, if each question can be from a different module) */}
              <Text style={styles.label}>Module</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedModule}
                  style={styles.picker}
                  onValueChange={(val) => setSelectedModule(val)}
                >
                  {moduleOptions.map((mod) => (
                    <Picker.Item key={mod} label={mod} value={mod} />
                  ))}
                </Picker>
              </View>

              {/* Question Type */}
              <Text style={styles.label}>Question Type</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={questionType}
                  style={styles.picker}
                  onValueChange={(val) => setQuestionType(val)}
                >
                  {questionTypes.map((qt) => (
                    <Picker.Item key={qt} label={qt} value={qt} />
                  ))}
                </Picker>
              </View>

              {/* Question Text */}
              <Text style={styles.label}>Question Text</Text>
              <TextInput
                mode="outlined"
                value={questionText}
                onChangeText={setQuestionText}
                style={styles.input}
                multiline
                placeholder="Type the question"
              />

              {/* If MC, show 4 options */}
              {questionType === "Multiple Choice" && (
                <>
                  <TextInput
                    mode="outlined"
                    label="Option A"
                    value={optionA}
                    onChangeText={setOptionA}
                    style={styles.input}
                  />
                  <TextInput
                    mode="outlined"
                    label="Option B"
                    value={optionB}
                    onChangeText={setOptionB}
                    style={styles.input}
                  />
                  <TextInput
                    mode="outlined"
                    label="Option C"
                    value={optionC}
                    onChangeText={setOptionC}
                    style={styles.input}
                  />
                  <TextInput
                    mode="outlined"
                    label="Option D"
                    value={optionD}
                    onChangeText={setOptionD}
                    style={styles.input}
                  />

                  <Text style={styles.label}>Correct Option</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={correctMCAnswer}
                      style={styles.picker}
                      onValueChange={(val) => setCorrectMCAnswer(val)}
                    >
                      <Picker.Item label="A" value="A" />
                      <Picker.Item label="B" value="B" />
                      <Picker.Item label="C" value="C" />
                      <Picker.Item label="D" value="D" />
                    </Picker>
                  </View>
                </>
              )}

              {/* If fill or T-F, show correct answer text input */}
              {questionType !== "Multiple Choice" && (
                <>
                  <Text style={styles.label}>Correct Answer</Text>
                  <TextInput
                    mode="outlined"
                    value={correctAnswer}
                    onChangeText={setCorrectAnswer}
                    style={styles.input}
                    placeholder={
                      questionType === "True or False" ? "True or False" : "Fill in answer"
                    }
                  />
                </>
              )}

              <Button
                mode="contained"
                onPress={handleAddQuestion}
                style={{ marginTop: 10 }}
              >
                Add Question
              </Button>
            </>
          )}

          <Divider style={styles.divider} />

          {/* If user has created enough questions, show a finalize button */}
          {questions.length === requiredQuestionCount && (
            <Button
              mode="contained"
              onPress={handleFinalize}
              style={{ marginTop: 10 }}
            >
              Finalize Challenge
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 12,
  },
  dateButton: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

