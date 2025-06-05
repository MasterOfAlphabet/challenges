import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import session from '../services/session';

const ModuleSelectionScreen = ({ navigation, route }) => { // Add route to props
  const [selectedOption, setSelectedOption] = useState(null);
  const [completedModules, setCompletedModules] = useState([]);
  
  // Your module colors and icons
  const MODULE_COLORS = {
    Spelling: '#f44336',
    Reading: '#e91e63',
    Pronunciation: '#9c27b0',
    Grammar: '#673ab7',
    Writing: '#3f51b5',
    Listening: '#2196f3',
    Vocabulary: '#4caf50',
    SHARP: '#ff9800'
  };

  const moduleIcons = {
    Spelling: 'sparkles-outline',
    Reading: 'book-outline',
    Pronunciation: 'mic-outline',
    Grammar: 'code-slash-outline',
    Writing: 'create-outline',
    Listening: 'ear-outline',
    Vocabulary: 'pricetags-outline',
    SHARP: 'flash-outline'
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Refresh completed modules when screen comes into focus
      setCompletedModules(session.getCompletedModules());
    });
  
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Load completed modules
    setCompletedModules(session.getCompletedModules());
    
    // Handle auto-start if coming from results screen
    if (route.params?.autoStartModule) {
      handleModulePress(route.params.autoStartModule);
    }
  }, [route.params]);

  const handleModulePress = (module) => {
    const currentCompleted = session.getCompletedModules();
    
    if (currentCompleted.includes(module)) {
      navigation.navigate('ModuleSkillAnalysisDetails', { 
        module,
        score: session.getResults().results[module]
      });
    } else {
      navigation.navigate('SkillsTestScreen', { module });
    }
  };

  const handleStartTest = () => {
    if (!selectedOption) return;
    navigation.navigate('SkillsTestScreen', { 
      module: selectedOption,
      isFullDiagnostic: selectedOption === 'all'
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>How would you like to test?</Text>
      
      {/* Full Diagnostic Option */}
      <TouchableOpacity 
        style={[
          styles.optionCard,
          selectedOption === 'all' && styles.selectedOption
        ]}
        onPress={() => setSelectedOption('all')}
      >
        <LinearGradient 
          colors={['#8E44AD', '#6A11CB']} 
          style={[styles.gradient, { justifyContent: 'center' }]}
        >
          <Ionicons name="apps" size={24} color="white" style={styles.optionIcon}/>
          <Text style={styles.optionText}>Complete Skills Analysis</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>All 8 Modules</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Or test individual skills:</Text>
      
      {/* Module Buttons */}
      {Object.keys(MODULE_COLORS).map((module) => {
  const isCompleted = completedModules.includes(module);
  
  return (
    <TouchableOpacity
      key={module}
      style={[
        styles.optionCard,
        selectedOption === module && styles.selectedOption,
        isCompleted && styles.completedOption,
        { borderLeftColor: MODULE_COLORS[module] }
      ]}
      onPress={() => setSelectedOption(module)}
    >
      <LinearGradient 
        colors={[lightenColor(MODULE_COLORS[module]), MODULE_COLORS[module]]}
        style={styles.gradient}
      >
        <Ionicons 
          name={isCompleted ? 'checkmark-circle' : moduleIcons[module]}
          size={24} 
          color="white" 
          style={styles.optionIcon}
        />
        <Text style={styles.optionText}>{module}</Text>
        {isCompleted && (
          <Text style={styles.completedText}>Done</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
})}

      {/* Start Button */}
      <TouchableOpacity
        style={[
          styles.startButton,
          !selectedOption && styles.disabledButton
        ]}
        onPress={handleStartTest}
        disabled={!selectedOption}
      >
        <Text style={styles.startButtonText}>
          {selectedOption === 'all' ? 'Begin Full Test' : selectedOption ? `Start ${selectedOption} Test` : 'Select Option'}
        </Text>
        {selectedOption && (
          <Ionicons name="arrow-forward" size={20} color="white" style={styles.startIcon}/>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

// Helper functions
const lightenColor = (hex, percent = 20) => {
  // Implement your color lightening logic
  return hex;
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 15,
    textAlign: 'center',
    color: '#666',
    fontWeight: '600'
  },
  optionCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    borderLeftWidth: 6,
    borderLeftColor: '#ccc' // Default, overridden per module
  },
  selectedOption: {
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center'
  },
  optionIcon: {
    marginRight: 15
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    flex: 1
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  },
  startButton: {
    backgroundColor: '#6200ea',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  disabledButton: {
    backgroundColor: '#b3b3b3'
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  startIcon: {
    marginLeft: 10
  },
  completedOption: {
    opacity: 0.8,
    borderLeftWidth: 6,
    borderLeftColor: '#4CAF50'
  },
  completedText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14
  }
});

export default ModuleSelectionScreen;