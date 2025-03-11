// TestSkillsHistoryScreen.js
import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { db } from "../../firebase"; // Firestore import
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../../App";

export default function TestSkillsHistoryScreen() {
  const { loggedInUser } = useContext(AuthContext);
  const [scoreHistory, setScoreHistory] = useState([]);

  // Fetch score history from Firestore
  useEffect(() => {
    const fetchScoreHistory = async () => {
      try {
        const q = query(
          collection(db, "testScores"),
          where("userId", "==", loggedInUser?.uid)
        );
        const querySnapshot = await getDocs(q);
        const history = [];
        querySnapshot.forEach((doc) => {
          history.push({ id: doc.id, ...doc.data() });
        });
        setScoreHistory(history);
      } catch (error) {
        console.error("Error fetching score history:", error);
      }
    };

    if (loggedInUser?.uid) {
      fetchScoreHistory();
    }
  }, [loggedInUser]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Test Skills Score History</Text>

      {/* If no data yet */}
      {scoreHistory.length === 0 ? (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No score history found.</Text>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Date</Text>
            <Text style={[styles.cell, styles.headerCell]}>Class</Text>
            <Text style={[styles.cell, styles.headerCell]}>Module</Text>
            <Text style={[styles.cell, styles.headerCell]}>Category</Text>
            <Text style={[styles.cell, styles.headerCell]}>Score</Text>
          </View>

          {/* Table Rows */}
          {scoreHistory.map((score, index) => {
            const isEvenRow = index % 2 === 0;
            return (
              <View
                key={score.id}
                style={[
                  styles.row,
                  isEvenRow ? styles.evenRow : styles.oddRow,
                ]}
              >
                <Text style={styles.cell}>
                  {new Date(score.date).toLocaleDateString()}
                </Text>
                <Text style={styles.cell}>{score.class}</Text>
                <Text style={styles.cell}>{score.module}</Text>
                <Text style={styles.cell}>{score.category}</Text>
                <Text style={styles.cell}>
                  {score.score} / {score.totalQuestions}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  noDataContainer: {
    marginTop: 50,
    alignItems: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  headerRow: {
    backgroundColor: "#3498db",
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f2f2f2",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    color: "#333",
  },
  headerCell: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
});
