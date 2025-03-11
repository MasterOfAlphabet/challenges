import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const BattleSelectionScreen = ({ onNext }) => {
  const battleTypes = [
    { id: 'class', name: 'Class Battle' },
    { id: 'city', name: 'City Battle' },
    { id: 'district', name: 'District Battle' },
    { id: 'country', name: 'Country Battle' },
  ];

  const handleBattleTypeSelect = (battleType) => {
    onNext(battleType); // Move to the next step
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Battle Type</Text>
      {battleTypes.map((type) => (
        <TouchableOpacity
          key={type.id}
          style={styles.button}
          onPress={() => handleBattleTypeSelect(type.id)}
        >
          <Text style={styles.buttonText}>{type.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BattleSelectionScreen;