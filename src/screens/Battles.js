// Battles.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { firestore, auth } from "../../firebase";
import { signInAnonymously } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// Import your big allQuestions data
import { allQuestions } from "../data/battleQuestions";

// Enable offline persistence
import { enableIndexedDbPersistence } from "firebase/firestore";
enableIndexedDbPersistence(firestore)
  .then(() => console.log("Offline persistence enabled"))
  .catch((err) => console.error("Offline persistence error:", err));
  

// Define the maximum number of players
const MAX_PLAYERS = 2;

export default function Battles() {

  const calculateProgress = (playerId) => {
    if (!battle || !battle.answeredPlayers) return 0;
    const totalQuestions = battle.questions.length;
    const answeredCount = battle.answeredPlayers.filter((uid) => uid === playerId).length;
    return (answeredCount / totalQuestions) * 100; // Percentage of questions answered
  };

  const [user, setUser] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedBattleGround, setSelectedBattleGround] = useState("Class");

  // Battle doc states
  const [battle, setBattle] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);

  // Timers
  const [matchTimeLeft, setMatchTimeLeft] = useState(0); // 15-min match timer
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15); // 15-sec question timer

  // Quiz states
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [opponentScores, setOpponentScores] = useState({}); // Scores for all opponents
  const [answeredPlayers, setAnsweredPlayers] = useState([]); // Track who answered

  // Available battles
  const [availableBattles, setAvailableBattles] = useState([]);
  // Track used questions
  const [usedQuestions, setUsedQuestions] = useState([]);

  // Name input for joining battles
  const [joinName, setJoinName] = useState("");
  const [hasJoinedBattle, setHasJoinedBattle] = useState(false); // Track if the player has joined

  // Battle history
  const [battleHistory, setBattleHistory] = useState([]);

  // 1) Anonymous Login
  useEffect(() => {
    const login = async () => {
      try {
        const { user } = await signInAnonymously(auth);
        setUser(user);
        console.log("Anon user:", user.uid);
      } catch (err) {
        console.error("Anon login error:", err);
      }
    };
    login();
  }, []);

  // 2) Listen to “waiting” battles
  useEffect(() => {
    const battlesRef = collection(firestore, "battles");
    const q = query(battlesRef, where("status", "==", "waiting"));

    const unsub = onSnapshot(q, (snap) => {
      const battles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvailableBattles(battles);
    });
    return () => unsub();
  }, []);

  // 3) If we have an active battle => real-time listener
  useEffect(() => {
    if (!battle || !battle.id) return;

    const battleRef = doc(firestore, "battles", battle.id);
    const unsub = onSnapshot(battleRef, (snap) => {
      if (!snap.exists()) {
        console.log("Battle doc deleted");
        resetBattle();
        return;
      }
      const data = snap.data();
      setBattle({ id: snap.id, ...data });

      // If the battle just turned ongoing, load questions
      if (data.status === "ongoing") {
        setWaitingForOpponent(false);
        setQuestions(data.questions || []);
      }
      // If ended, show final scores
      if (data.status === "ended") {
        setBattleEnded(true);
        if (data.scores) {
          const playerScores = data.scores;
          setScore(playerScores[user.uid] || 0);
          const opponentScores = {};
          Object.keys(playerScores).forEach((playerId) => {
            if (playerId !== user.uid) {
              opponentScores[playerId] = playerScores[playerId];
            }
          });
          setOpponentScores(opponentScores);
        }
        // Save battle to history (only if it's not already in history)
        setBattleHistory((prev) => {
          const exists = prev.some((b) => b.id === snap.id);
          if (!exists) {
            return [...prev, { id: snap.id, ...data }];
          }
          return prev;
        });
      }

      // Track answered players and map UIDs to usernames
     
    });

    return () => unsub();
  }, [battle]);

  // 4) 15-min match timer
  useEffect(() => {
  if (!battle || !battle.createdAt || battle.status === "ended") return;
    console.log("CreatedAt:", battle.createdAt); // Check if this is a valid Timestamp
  if (!battle.createdAt.toDate) {
    console.error("Invalid createdAt field:", battle.createdAt);
    return;
  }

  const createdMs = battle.createdAt.toDate().getTime();
  //console.log("Created Milliseconds:", createdMs); // Check if this is a valid number
  const matchDeadline = createdMs + 15 * 60 * 1000; // 15 minutes

  const handleMatchTimer = setInterval(() => {
    const now = Date.now();
    const diff = matchDeadline - now;
    console.log("Time Left:", diff); // Check if this updates every second
    if (diff <= 0) {
      setMatchTimeLeft(0);
      if (battle.status === "waiting") {
        cancelBattle(); // no one joined
      } else if (battle.status === "ongoing") {
        endBattle("matchTimeUp");
      }
    } else {
      setMatchTimeLeft(Math.floor(diff / 1000));
    }
  }, 1000);

  return () => clearInterval(handleMatchTimer);
}, [battle]);

  // 5) 15-sec question timer
  useEffect(() => {
    if (!battle || battle.status !== "ongoing" || battleEnded) return;
    if (currentQuestionIndex >= questions.length) return;
  
    // Reset timer when moving to the next question
    if (questionTimeLeft === 15) {
      const questionTimer = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(questionTimer); // Stop the timer
            handleAnswer(null); // Auto-skip if time runs out
            return 15; // Reset for the next question
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(questionTimer);
    }
  }, [questionTimeLeft, battle, battleEnded, currentQuestionIndex, questions]);

  // =============== BATTLE ACTIONS =================

  // 6) Create new battle
  const handleFormSubmit = async () => {
    if (!name || !selectedClass || !selectedModule || !selectedBattleGround) {
      Alert.alert("Please fill all fields.");
      return;
    }
    setShowForm(false);

    const newQuestions = getRandomQuestions(10);
    if (!newQuestions.length) {
      Alert.alert("No questions available for this module/class.");
      resetBattle();
      return;
    }

    const newBattle = {
      players: [{ id: user.uid, name }],
      scores: { [user.uid]: 0 },
      status: "waiting",
      questions: newQuestions,
      createdAt: serverTimestamp(),
      class: selectedClass,
      module: selectedModule,
      place: selectedBattleGround,
      answeredPlayers: [], // Track who answered
    };

    try {
      const ref = await addDoc(collection(firestore, "battles"), newBattle);
      console.log("Battle created:", ref.id);

      // Real-time updates for the newly created doc
      const unsub = onSnapshot(ref, (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setBattle({ id: snap.id, ...data });
        }
      });

      setUsedQuestions((prev) => [...prev, ...newQuestions]);
      setWaitingForOpponent(true);
    } catch (err) {
      console.error("create battle error:", err);
      resetBattle();
    }
  };

  // 7) Join a battle
  const joinBattle = async (battleId, playerName) => {
    if (!user || !playerName) {
      Alert.alert("Please enter your name to join the battle.");
      return;
    }

    try {
      const battleRef = doc(firestore, "battles", battleId);
      const snap = await getDoc(battleRef);
      if (!snap.exists()) {
        console.log("Doc not found after joinBattle");
        return;
      }
      const data = snap.data();

      if (data.players.length >= MAX_PLAYERS) {
        Alert.alert("Battle is full.");
        return;
      }

      await updateDoc(battleRef, {
        players: [...data.players, { id: user.uid, name: playerName }],
        [`scores.${user.uid}`]: 0,
        status: data.players.length + 1 === MAX_PLAYERS ? "ongoing" : "waiting",
      });

      setBattle({ id: snap.id, ...data });
      setShowForm(false);
      setHasJoinedBattle(true); // Update the state to indicate the player has joined
      console.log("Joined battle:", snap.id);
    } catch (err) {
      console.error("joinBattle error:", err);
    }
  };

  // 8) Cancel if still waiting
  const cancelBattle = async () => {
    if (!battle || battle.status !== "waiting") return;
    try {
      await deleteDoc(doc(firestore, "battles", battle.id));
      console.log("Battle canceled.");
      resetBattle();
    } catch (err) {
      console.error("cancelBattle error:", err);
    }
  };

  // 9) End battle => set status=ended, store final scores
  const endBattle = async (reason) => {
    if (!battle || battle.status === "ended") return;
    try {
      const finalScores = { ...battle.scores };
      finalScores[user.uid] = score;

      await updateDoc(doc(firestore, "battles", battle.id), {
        status: "ended",
        scores: finalScores,
      });
      setBattleEnded(true);
      console.log("endBattle reason:", reason);
    } catch (err) {
      console.error("endBattle error:", err);
    }
  };

  // 10) handle user answer
  const handleAnswer = async (optionIndex) => {
    if (!questions[currentQuestionIndex]) return;
    const correct = questions[currentQuestionIndex].correctAnswer;
    let newScore = score;
    if (optionIndex !== null && optionIndex === correct) {
      newScore++;
      setScore(newScore);
    }

    // Move to next
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeLeft(15); // reset
    } else {
      // done
      endBattle("all-answered");
    }

    // partial doc update
    if (battle && battle.id) {
      const newScores = { ...battle.scores };
      newScores[user.uid] = newScore;
      try {
        await updateDoc(doc(firestore, "battles", battle.id), {
          scores: newScores,
          answeredPlayers: [...battle.answeredPlayers, user.uid], // Track who answered
        });
      } catch (err) {
        console.error("partial score update error:", err);
      }
    }
  };

  // 11) get random questions
  const getRandomQuestions = (count) => {
    let pool = [];
    if (selectedModule === "8-in-1") {
      Object.values(allQuestions).forEach((modData) => {
        if (modData[selectedClass]) {
          if (Array.isArray(modData[selectedClass])) {
            pool = [...pool, ...modData[selectedClass]];
          } else {
            Object.values(modData[selectedClass]).forEach((qt) => {
              pool = [...pool, ...qt];
            });
          }
        }
      });
    } else {
      const modData = allQuestions[selectedModule];
      if (modData && modData[selectedClass]) {
        if (Array.isArray(modData[selectedClass])) {
          pool = [...modData[selectedClass]];
        } else {
          Object.values(modData[selectedClass]).forEach((qt) => {
            pool = [...pool, ...qt];
          });
        }
      }
    }
    // filter used
    pool = pool.filter((q) => !usedQuestions.includes(q));
    if (!pool.length) return [];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // 12) Reset everything
  const resetBattle = () => {
    setBattle(null);
    setQuestions([]);
    setShowForm(true);
    setWaitingForOpponent(false);
    setBattleEnded(false);
    setMatchTimeLeft(0);
    setQuestionTimeLeft(15);
    setCurrentQuestionIndex(0);
    setScore(0);
    setOpponentScores({});
    setUsedQuestions([]);
    setJoinName(""); // Reset the join name input
    setHasJoinedBattle(false); // Reset the joined battle state
    setAnsweredPlayers([]); // Reset answered players
  };

  // Renders waiting battles
  const renderAvailableBattles = () => {
    if (!availableBattles.length) {
      return <Text style={styles.noBattlesText}>No battles available.</Text>;
    }
    return availableBattles.map((b) => {
      const isOwner = b.players[0].id === user?.uid; // Check if the current user is the creator
      const cTime = b.createdAt?.toDate?.()?.getTime() || 0; // Safely handle createdAt
      const diff = cTime + 15 * 60 * 1000 - Date.now();
      const localTimeLeft = Math.max(Math.floor(diff / 1000), 0);

      // If battle is older than 15 min => skip
      if (!cTime || localTimeLeft <= 0) return null;

      return (
        <View key={b.id} style={styles.battleCard}>
          <Text style={styles.battleTitle}>Available Battle</Text>
          <Text style={styles.battleDetails}>Players: {b.players.length}/{MAX_PLAYERS}</Text>
          <Text style={styles.battleDetails}>Class: {b.class}</Text>
          <Text style={styles.battleDetails}>Module: {b.module}</Text>
          <Text style={styles.battleDetails}>Place: {b.place}</Text>
          <Text style={styles.timer}>
            Time Left to Join: {Math.floor(localTimeLeft / 60)}:
            {(localTimeLeft % 60).toString().padStart(2, "0")}
          </Text>
          {isOwner ? (
            // Show "Cancel Battle" button for the creator
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => cancelBattle()}
            >
              <Text style={styles.cancelButtonText}>Cancel Battle</Text>
            </TouchableOpacity>
          ) : (
            // Show "Join Battle" button for other players
            !isOwner &&
            localTimeLeft > 0 && (
              <>
                <TextInput
                  style={styles.joinNameInput}
                  placeholder="Enter your name"
                  value={joinName}
                  onChangeText={setJoinName}
                />
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => {
                    if (!joinName) {
                      Alert.alert("Please enter your name to join the battle.");
                      return;
                    }
                    joinBattle(b.id, joinName); // Pass joinName to the function
                    setHasJoinedBattle(true); // Update the state to indicate the player has joined
                  }}
                  disabled={hasJoinedBattle} // Disable the button after joining
                >
                  <Text style={styles.joinButtonText}>
                    {hasJoinedBattle ? "Waiting for other players..." : "Join Battle"}
                  </Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      );
    });
  };

  // Determine the winner
  const determineWinner = () => {
    if (!battle || !battle.scores) return null;

    const scores = battle.scores;
    let winnerId = null;
    let highestScore = -1;

    Object.entries(scores).forEach(([playerId, playerScore]) => {
      if (playerScore > highestScore) {
        highestScore = playerScore;
        winnerId = playerId;
      }
    });

    if (winnerId === user.uid) {
      return "You Won! 🎉";
    } else {
      const winner = battle.players.find((p) => p.id === winnerId);
      return `${winner?.name || "Opponent"} Won! 🎉`;
    }
  };

  // Render battle history
  const renderBattleHistory = () => {
    if (!battleHistory.length) {
      return <Text style={styles.noBattlesText}>No battle history available.</Text>;
    }
  
    return (
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.tableCell]}>Class</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Module</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Place</Text>
          <Text style={[styles.tableHeader, styles.tableCell]}>Winner</Text>
        </View>
  
        {/* Table Rows */}
        {battleHistory.map((b) => (
          <View key={b.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{b.class}</Text>
            <Text style={styles.tableCell}>{b.module}</Text>
            <Text style={styles.tableCell}>{b.place}</Text>
            <Text style={styles.tableCell}>{determineWinner(b)}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Available Battles</Text>
      {renderAvailableBattles()}

      {/* If no active battle => show creation form */}
      {showForm && !battle && (
        <>
          <Text style={styles.header}>Enter Your Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Picker
            selectedValue={selectedClass}
            onValueChange={setSelectedClass}
            style={styles.dropdown}
          >
           {Array.from({ length: 12 }, (_, i) => (
              <Picker.Item
                key={i + 1}
                label={`Class ${i + 1}`}
                value={`${i + 1}`}
              />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedModule}
            onValueChange={setSelectedModule}
            style={styles.dropdown}
          >
            <Picker.Item label="Spelling" value="Spelling" />
            <Picker.Item label="Reading" value="Reading" />
            <Picker.Item label="Pronunciation" value="Pronunciation" />
            <Picker.Item label="Grammar" value="Grammar" />
            <Picker.Item label="Writing" value="Writing" />
            <Picker.Item label="Listening" value="Listening" />
            <Picker.Item label="Vocabulary" value="Vocabulary" />
            <Picker.Item label="SHARP" value="SHARP" />
            <Picker.Item label="8-in-1" value="8-in-1" />
          </Picker>
          <Picker
            selectedValue={selectedBattleGround}
            onValueChange={setSelectedBattleGround}
            style={styles.dropdown}
          >
            <Picker.Item label="Class" value="Class" />
            <Picker.Item label="School" value="School" />
            <Picker.Item label="Neighborhood" value="Neighborhood" />
            <Picker.Item label="City" value="City" />
            <Picker.Item label="District" value="District" />
            <Picker.Item label="State" value="State" />
            <Picker.Item label="Nation" value="Nation" />
            <Picker.Item label="Global" value="Global" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleFormSubmit}>
            <Text style={styles.buttonText}>Start Battle</Text>
          </TouchableOpacity>
        </>
      )}

      {/* If waiting */}
      {battle && battle.status === "waiting" && waitingForOpponent && (
        <View style={styles.battleStatusContainer}>
          <Text style={styles.title}>Waiting for Opponents...</Text>
          <Text style={styles.battleDetails}>Players: {battle.players.length}/{MAX_PLAYERS}</Text>
          <Text style={styles.battleDetails}>Class: {selectedClass}</Text>
          <Text style={styles.battleDetails}>Module: {selectedModule}</Text>
          <Text style={styles.battleDetails}>Place: {selectedBattleGround}</Text>
          <Text style={styles.timer}>
            Match Time Left: {Math.floor(matchTimeLeft / 60)}:
            {(matchTimeLeft % 60).toString().padStart(2, "0")}
          </Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelBattle}>
            <Text style={styles.cancelButtonText}>Cancel Battle</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ongoing => show questions */}
      {battle && battle.status === "ongoing" && !battleEnded && (
        <>
          
{questions.length === 0 ? (
  <Text style={styles.title}>No questions available.</Text>
) : currentQuestionIndex < questions.length ? (
  <View style={styles.questionContainer}>
        {/* Add the progress bar code here */}
        <View style={styles.playerProgressContainer}>
      {battle.players.map((player) => (
        <View style={styles.playerProgressRow}>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${calculateProgress(player.id)}%` },
            ]}
          />
        </View>
        <Text style={styles.progressLabel}>
          {battle.answeredPlayers.filter((uid) => uid === player.id).length}/
          {battle.questions.length}
        </Text>
      </View>
      ))}
    </View>
    {/* Existing question and timer code */}
    <Text style={styles.question}>
      {questions[currentQuestionIndex]?.question}
    </Text>
    <Text style={styles.timer}>
      Question Time Left: {questionTimeLeft}s
    </Text>
    <Text style={styles.timer}>
      Match Time Left: {Math.floor(matchTimeLeft / 60)}:
      {(matchTimeLeft % 60).toString().padStart(2, "0")}
    </Text>

    {/* Existing option buttons */}
    {questions[currentQuestionIndex]?.options.map((opt, idx) => (
      <TouchableOpacity
        key={idx}
        style={styles.optionButton}
        onPress={() => handleAnswer(idx)}
      >
        <Text style={styles.optionText}>{opt}</Text>
      </TouchableOpacity>
    ))}
  </View>
) : (
  <Text style={styles.title}>
    All questions answered! Please wait for the battle to end...
  </Text>
)}
        </>
      )}

      {/* Ended => final scores */}
      {battle && battle.status === "ended" && (
        <View style={styles.endContainer}>
          <Text style={styles.endMessage}>Battle Over!</Text>
          <Text style={styles.score}>Your Score: {score}</Text>
          {Object.entries(opponentScores).map(([playerId, playerScore]) => (
            <Text key={playerId} style={styles.score}>
              {battle.players.find((p) => p.id === playerId)?.name || "Opponent"}'s Score: {playerScore}
            </Text>
          ))}
          <Text style={styles.winnerText}>{determineWinner()}</Text>
          <TouchableOpacity style={styles.button} onPress={resetBattle}>
            <Text style={styles.buttonText}>Back to Battles</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Battle History */}
      <Text style={styles.header}>Battle History</Text>
      {renderBattleHistory()}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
    color: "#333",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noBattlesText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  battleCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  battleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  battleDetails: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  timer: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "bold",
  },
  joinNameInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  joinButton: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  joinButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545", // Red color for cancel button
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  battleStatusContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    padding: 15,
    marginVertical: 15,
  },
  questionContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  endContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 15,
    alignItems: "center",
    elevation: 3,
  },
  endMessage: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#d32f2f",
    marginBottom: 10,
  },
  score: {
    fontSize: 18,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
  },
  winnerText: {
    fontSize: 20,
    color: "#4caf50",
    fontWeight: "bold",
    marginTop: 10,
  },
  table: {
    width: "100%",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    padding: 5,
  },
  playerProgressContainer: {
    marginTop: 10,
  },
  playerProgressRow: {
    marginBottom: 10,
  },
  playerName: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50", // Green color for progress
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});