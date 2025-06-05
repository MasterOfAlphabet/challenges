import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  ActivityIndicator, 
  ScrollView, 
  Alert 
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { auth, firestore } from "../../firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import ChallengeDetailModal from './ChallengeDetailModal';

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
LocaleConfig.defaultLocale = 'en';

const ChallengeHeader = ({ challenge }) => {
  if (!challenge) return null;

  const endTime = new Date(challenge.endDate);
  const hoursLeft = Math.max(0, Math.floor((endTime - new Date()) / (1000 * 60 * 60)));

  return (
    <View style={styles.challengeCard}>
      <View style={styles.headerRow}>
        <Text style={styles.challengeTitle}>{challenge.title || "Daily Challenge"}</Text>
        <View style={styles.challengeTypeBadge}>
          <Text style={styles.challengeTypeText}>{challenge.type || "Daily"}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{challenge.questions?.length || 0}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{hoursLeft}</Text>
          <Text style={styles.statLabel}>Hours Left</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{challenge.submissionCount || 0}</Text>
          <Text style={styles.statLabel}>Submissions</Text>
        </View>
      </View>

      <ScrollView style={styles.questionsList}>
        {challenge.questions?.map((question, index) => (
          <View key={index} style={styles.questionItem}>
            <Text style={styles.questionNumber}>Challenge #{index + 1}</Text>
            <View style={styles.questionMeta}>
              <Text style={styles.moduleIcon}>📚</Text>
              <Text style={styles.moduleName}>{question.module}</Text>
              <Text style={styles.questionType}>{question.type}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const DailyChallengesScreen = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      
      setLoading(true);
      try {
        const challengesRef = collection(firestore, "challenges");
        const monthPrefix = `challenge_${year}${month.toString().padStart(2, '0')}`;
        const q = query(
          challengesRef,
          where("id", ">=", monthPrefix),
          where("id", "<=", monthPrefix + "\uf8ff")
        );

        const snapshot = await getDocs(q);
        const dates = {};
        snapshot.forEach(doc => {
          const challengeId = doc.id;
          const dateMatch = challengeId.match(/challenge_(\d{4})(\d{2})(\d{2})/);
          
          if (dateMatch) {
            const [, year, month, day] = dateMatch;
            const dateString = `${year}-${month}-${day}`;
            dates[dateString] = { 
              marked: true, 
              dotColor: '#6200ea',
              selectedColor: '#3700b3'
            };
          }
        });
        setMarkedDates(dates);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        Alert.alert("Error", "Failed to load challenges");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [currentMonth]);

  const handleDateSelect = async (date) => {
    setSelectedDate(date.dateString);
    setLoading(true);
    setModalVisible(true);
    
    try {
      const formattedDate = date.dateString.replace(/-/g, '');
      const challengePrefix = `challenge_${formattedDate}_`;
      
      const challengesRef = collection(firestore, "challenges");
      const q = query(
        challengesRef,
        where("id", ">=", challengePrefix),
        where("id", "<=", challengePrefix + "\uf8ff")
      );
      
      const querySnapshot = await getDocs(q);
      const challengesData = [];
      
      querySnapshot.forEach(doc => {
        challengesData.push({ id: doc.id, ...doc.data() });
      });
      
      setChallenges(challengesData);
    } catch (error) {
      console.error("Error loading challenges:", error);
      Alert.alert("Error", "Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const showChallengeDetails = (challenge) => {
    setSelectedChallenge(challenge);
    setDetailModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Challenges</Text>

      <Calendar
        current={currentMonth.toISOString().split('T')[0]}
        markedDates={markedDates}
        onDayPress={handleDateSelect}
        theme={{
          arrowColor: 'blue',
          todayTextColor: 'blue',
          selectedDayBackgroundColor: 'blue'
        }}
      />

      {/* Challenges List Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Challenges for {selectedDate}</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="blue" />
          ) : challenges.length > 0 ? (
            <ScrollView>
              {challenges.map(challenge => (
                <TouchableOpacity 
                  key={challenge.id}
                  style={styles.challengeCard}
                  onPress={() => showChallengeDetails(challenge)}
                >
                  <Text style={styles.challengeTitle}>
                    {challenge.title || "Untitled Challenge"}
                  </Text>
                  <Text numberOfLines={1} style={styles.challengeSubtitle}>
                    {challenge.questions ? 
                      `${challenge.questions.length} question(s)` : 
                      "No questions"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text>No challenges found for this date</Text>
          )}

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Challenge Detail Modal */}
      <Modal visible={detailModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <ChallengeHeader challenge={selectedChallenge} />
          
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => {
              setDetailModalVisible(false);
              setShowAnswerModal(true);
            }}
          >
            <Text style={styles.answerButtonText}>Answer Challenge</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setDetailModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Answer Challenge Modal */}
      <ChallengeDetailModal
        visible={showAnswerModal}
        challenge={selectedChallenge}
        onClose={() => setShowAnswerModal(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    flex: 1,
  },
  challengeTypeBadge: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  challengeTypeText: {
    color: '#1976D2',
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  questionsList: {
    maxHeight: 200,
    marginTop: 8,
  },
  questionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionNumber: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#444',
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moduleIcon: {
    marginRight: 6,
  },
  moduleName: {
    color: '#555',
    fontSize: 14,
    marginRight: 10,
  },
  questionType: {
    color: '#888',
    fontSize: 12,
    fontStyle: 'italic',
    marginLeft: 'auto',
  },
  answerButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  answerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default DailyChallengesScreen;