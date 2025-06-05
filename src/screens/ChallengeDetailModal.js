import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Alert
} from 'react-native';
import { auth, firestore } from '../../firebase';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';

const ChallengeDetailModal = ({ challenge, visible, onClose }) => {
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setLoading(false);
          return;
        }

        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        Alert.alert("Error", "Failed to verify user role");
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      checkUser();
      if (challenge?.questions) {
        setAnswers({});
      }
    }
  }, [visible, challenge]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Login Required", "Please login to submit answers");
        return;
      }

      if (userRole !== "Student") {
        Alert.alert("Access Denied", "Only students can submit answers");
        return;
      }

      const unanswered = challenge.questions.filter(
        (_, index) => !answers[index]
      );
      if (unanswered.length > 0) {
        Alert.alert(
          "Incomplete Answers",
          `Please answer all questions (${unanswered.length} remaining)`
        );
        return;
      }

      const submissionData = {
        challengeId: challenge.id,
        userId: user.uid,
        answers,
        submittedAt: serverTimestamp(),
        status: "submitted",
        score: 0,
        userName: user.displayName || "Anonymous",
      };

      const submissionsRef = collection(firestore, "challengeSubmissions");
      await addDoc(submissionsRef, submissionData);

      const challengeRef = doc(firestore, "challenges", challenge.id);
      await updateDoc(challengeRef, {
        submissionCount: increment(1)
      });

      Alert.alert("Success", "Your answers have been submitted!");
      onClose();
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Error", "Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswerChange = (questionIndex, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const renderQuestionInput = (question, index) => {
    if (!question || !question.type) {
      return (
        <Text style={styles.errorText}>Invalid question format</Text>
      );
    }

    switch (question.type) {
      case 'Fill in the Blank':
        return (
          <TextInput
            style={styles.input}
            placeholder="Type your answer here..."
            value={answers[index] || ''}
            onChangeText={(text) => handleAnswerChange(index, text)}
            multiline
          />
        );
      
      case 'True or False':
        return (
          <View style={styles.radioGroup}>
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => handleAnswerChange(index, 'true')}
            >
              <View style={[
                styles.radioCircle,
                answers[index] === 'true' && styles.radioSelected
              ]}/>
              <Text style={styles.radioLabel}>True</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.radioOption}
              onPress={() => handleAnswerChange(index, 'false')}
            >
              <View style={[
                styles.radioCircle,
                answers[index] === 'false' && styles.radioSelected
              ]}/>
              <Text style={styles.radioLabel}>False</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'Multiple Choice':
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, optIndex) => (
              <TouchableOpacity
                key={optIndex}
                style={[
                  styles.optionButton,
                  answers[index] === option && styles.selectedOption
                ]}
                onPress={() => handleAnswerChange(index, option)}
              >
                <Text style={styles.optionText}>
                  {String.fromCharCode(65 + optIndex)}. {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
        
      default:
        return (
          <TextInput
            style={styles.input}
            placeholder={`Answer (${question.type})`}
            value={answers[index] || ''}
            onChangeText={(text) => handleAnswerChange(index, text)}
            multiline
          />
        );
    }
  };

  if (!visible) return null;

  if (loading) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#6200ea" />
          <Text style={styles.loadingText}>Loading challenge...</Text>
        </View>
      </Modal>
    );
  }

  if (!challenge || !challenge.questions) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.detailTitle}>Challenge Not Available</Text>
          <Text style={styles.errorText}>Could not load challenge details.</Text>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <Text style={styles.detailTitle}>
          {challenge.title || "Untitled Challenge"}
        </Text>
        
        {userRole !== "Student" && (
          <View style={styles.accessDeniedContainer}>
            <Text style={styles.accessDeniedText}>
              {userRole ? "Only students can answer challenges" : "Please login to answer challenges"}
            </Text>
          </View>
        )}
        
        <ScrollView style={styles.questionsScroll}>
          {challenge.questions?.map((question, index) => (
            <View key={index} style={styles.questionContainer}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>
                  Question {index + 1}
                </Text>
                <Text style={styles.questionType}>
                  ({question.type?.replace(/_/g, ' ') || 'unknown type'})
                </Text>
              </View>
              
              <Text style={styles.questionText}>
                {question.text || "No question text available"}
              </Text>
              
              {renderQuestionInput(question, index)}
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.submitButton,
              userRole !== "Student" && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={userRole !== "Student" || submitting}
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Answers</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Back to List</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  loadingText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666'
  },
  errorText: {
    textAlign: 'center',
    color: '#f44336',
    marginBottom: 20
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200ea'
  },
  questionsScroll: {
    flex: 1,
    marginBottom: 10
  },
  questionContainer: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  questionNumber: {
    fontWeight: 'bold',
    color: '#6200ea'
  },
  questionType: {
    fontStyle: 'italic',
    color: '#666',
    fontSize: 12
  },
  questionText: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    minHeight: 50,
    textAlignVertical: 'top'
  },
  radioGroup: {
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#6200ea',
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: '#6200ea',
  },
  radioLabel: {
    fontSize: 16,
  },
  optionsContainer: {
    marginTop: 10
  },
  optionButton: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#90caf9'
  },
  optionText: {
    fontSize: 16,
    color: '#333'
  },
  footer: {
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee'
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  closeButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  accessDeniedContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ef9a9a'
  },
  accessDeniedText: {
    color: '#c62828',
    textAlign: 'center',
    fontWeight: '500'
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
    opacity: 0.6
  }
});

export default ChallengeDetailModal;