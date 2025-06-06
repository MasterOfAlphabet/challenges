import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const winnersData = [
  { id: "1", name: "Alice Johnson", rank: "1st Place" },
  { id: "2", name: "John Doe", rank: "2nd Place" },
  { id: "3", name: "Emma Smith", rank: "3rd Place" },
];

const WinnersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>🏆 Winners List</Text>
      <FlatList
        data={winnersData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.winnerItem}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.rank}>{item.rank}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  winnerItem: {
    backgroundColor: "#FFF",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rank: {
    fontSize: 16,
    color: "#007AFF",
  },
});

export default WinnersScreen;
