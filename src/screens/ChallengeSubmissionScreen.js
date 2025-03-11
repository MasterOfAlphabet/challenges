import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { RadioButton, Button } from "react-native-paper";

export default function ChallengeSubmissionScreen({ route, navigation }) {
  const challenge = route.params?.challenge;
  const userRole = route.params?.userRole || "Student"; // Default to "Student" for testing

  console.log("User Role in ChallengeSubmissionScreen:", userRole); // Log the user role

  // If no challenge data, show an error
  if (!challenge) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No challenge data found.</Text>
      </View>
    );
  }

  const [userAnswers, setUserAnswers] = useState(
    challenge.questions?.map(() => "") || []
  );

  const handleSelectOption = (qIndex, selectedValue) => {
    const newAnswers = [...userAnswers];
    newAnswers[qIndex] = selectedValue;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Calculate the score
    let score = 0;
    challenge.questions.forEach((q, qIndex) => {
      if (q.questionType === "Multiple Choice") {
        if (userAnswers[qIndex] === q.correctOption) score++;
      } else if (q.questionType === "Fill in the Blank" || q.questionType === "True or False") {
        if (userAnswers[qIndex] === q.correctAnswer) score++;
      }
    });

    Alert.alert("Submission", `Your answers have been submitted! Score: ${score}/${challenge.questions.length}`);
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Challenge Submission</Text>
      <Text style={styles.subtitle}>
        {challenge.name} ({challenge.type})
      </Text>

      {/* Display challenge details */}
      {challenge.questions?.map((q, qIndex) => (
        <View key={qIndex} style={styles.questionCard}>
          <Text style={styles.questionText}>
            Q{qIndex + 1}: {q.questionText}
          </Text>

          {/* Show options for multiple-choice questions */}
          {q.questionType === "Multiple Choice" && q.options && (
            <View>
              {q.options.map((opt, optIndex) => (
                <Text key={optIndex} style={styles.optionText}>
                  {opt}
                </Text>
              ))}
            </View>
          )}

          {/* Show correct answer for fill-in and true/false questions */}
          {(q.questionType === "Fill in the Blank" || q.questionType === "True or False") && (
            <Text style={styles.correctAnswer}>
           
            </Text>
          )}
        </View>
      ))}

      {/* Only show the submission form for students */}
      {userRole === "Student" && (
        <>
          {challenge.questions?.map((q, qIndex) => (
            <View key={qIndex} style={styles.questionCard}>
              <Text style={styles.questionText}>
                Q{qIndex + 1}: {q.questionText}
              </Text>

              {/* Render question type UI */}
              {q.questionType === "Multiple Choice" && q.options && (
                <RadioButton.Group
                  onValueChange={(value) => handleSelectOption(qIndex, value)}
                  value={userAnswers[qIndex]}
                >
                  {q.options.map((opt, optIndex) => (
                    <View key={optIndex} style={styles.radioOption}>
                      <RadioButton value={String(optIndex)} />
                      <Text style={styles.radioLabel}>{opt}</Text>
                    </View>
                  ))}
                </RadioButton.Group>
              )}

              {q.questionType === "Fill in the Blank" && (
                <TextInput
                  style={styles.fillInput}
                  placeholder="Type your answer"
                  value={userAnswers[qIndex]}
                  onChangeText={(text) => handleSelectOption(qIndex, text)}
                />
              )}

              {q.questionType === "True or False" && (
                <View style={styles.tfContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tfButton,
                      userAnswers[qIndex] === "True" && styles.tfSelected,
                    ]}
                    onPress={() => handleSelectOption(qIndex, "True")}
                  >
                    <Text style={styles.tfButtonText}>True</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tfButton,
                      userAnswers[qIndex] === "False" && styles.tfSelected,
                    ]}
                    onPress={() => handleSelectOption(qIndex, "False")}
                  >
                    <Text style={styles.tfButtonText}>False</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}

          <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
            Submit My Answers
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
    color: "#666",
  },
  questionCard: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  questionText: {
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    color: "#333",
    marginVertical: 4,
  },
  correctAnswer: {
    fontSize: 14,
    color: "#28a745",
    marginTop: 8,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  radioLabel: {
    fontSize: 14,
    color: "#333",
  },
  fillInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#fff",
  },
  tfContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  tfButton: {
    flex: 1,
    marginRight: 5,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: "center",
  },
  tfButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  tfSelected: {
    backgroundColor: "#aed581",
  },
  submitButton: {
    marginTop: 20,
    alignSelf: "center",
    width: "50%",
  },
});