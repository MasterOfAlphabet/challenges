import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import session from '../services/session';

import { Alert } from 'react-native';

const SkillsAnalysisResultsScreen = ({ route, navigation }) => {
  // ===== CONSTANTS & HELPER FUNCTIONS =====
  const colors = {
    levels: {
      Rookie: ['#FF6B6B', '#FF3B3B'],
      Racer: ['#FFD93D', '#FFB400'],
      Master: ['#2ECC71', '#27AE60'],
      Prodigy: ['#6A11CB', '#FF61D2'],
      Wizard: ['#8E44AD', '#5E3370']
    },
    modules: {
      Spelling: '#f44336',
      Reading: '#e91e63',
      Pronunciation: '#9c27b0',
      Grammar: '#673ab7',
      Writing: '#3f51b5',
      Listening: '#2196f3',
      Vocabulary: '#4caf50',
      SHARP: '#ff9800',
      'All-in-One': '#6200ee',
      'Skills Analysis': '#00bcd4'  // New color for Skills Analysis
    }
  };

  const moduleIcons = {
    Spelling: 'sparkles-outline',
    Reading: 'book-outline',
    Pronunciation: 'mic-outline',
    Grammar: 'code-slash-outline',
    Writing: 'create-outline',
    Listening: 'ear-outline',
    Vocabulary: 'pricetags-outline',
    SHARP: 'flash-outline',
    'All-in-One': 'analytics-outline',
    'Skills Analysis': 'ribbon-outline'  // New icon
  };

  const getLevelFromScore = (score) => {
    if (score >= 90) return 'Wizard';
    if (score >= 75) return 'Prodigy';
    if (score >= 60) return 'Master';
    if (score >= 45) return 'Racer';
    return 'Rookie';
  };

  // ===== DATA PROCESSING =====
  const allModules = [
    'Spelling', 'Reading', 'Pronunciation',
    'Grammar', 'Writing', 'Listening',
    'Vocabulary', 'SHARP'
  ];

  // State for completed modules
  const [completedModules, setCompletedModules] = useState({});
  
  // Animation refs
  const progressAnim = useRef(new Animated.Value(0)).current; // For overall progress
  const moduleProgressAnims = useRef( // For individual modules
    allModules.reduce((acc, module) => {
      acc[module] = new Animated.Value(0);
      return acc;
    }, {})
  ).current;

  // Load session data and handle new results
  useEffect(() => {
    if (session.isExpired()) {
      session.clearResults();
    }
    setCompletedModules(session.getResults().results);
    
    if (route.params?.module && route.params?.score) {
      const updated = session.saveResult(route.params.module, route.params.score);
      setCompletedModules(updated.results);
    }
  }, [route.params]);

  // Calculate metrics
  const completedCount = Object.keys(completedModules).filter(mod => allModules.includes(mod)).length;
const totalModules = allModules.length;
const progressPercentage = completedCount === totalModules ? 100 : Math.round((completedCount / totalModules) * 100);


  const hasCompletedAny = completedCount > 0;
  const averageScore = hasCompletedAny 
    ? Math.round(Object.values(completedModules).reduce((a, b) => a + b, 0) / completedCount)
    : 0;
  const overallLevel = getLevelFromScore(averageScore);

  // Identify weakest module
  const weakestModule = hasCompletedAny
    ? Object.entries(completedModules).reduce((weakest, [mod, score]) => 
        score < (weakest.score ?? Infinity) ? { mod, score } : weakest, {})
    : null;

  // ===== ANIMATIONS =====
  // Overall progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [progressPercentage]);

  // Module progress animations
  useEffect(() => {
    allModules.forEach(module => {
      if (completedModules[module]) {
        Animated.timing(moduleProgressAnims[module], {
          toValue: completedModules[module],
          duration: 1000,
          useNativeDriver: false
        }).start();
      }
    });
  }, [completedModules]);

  // ===== COMPONENT RENDERERS =====
  const renderModuleCard = (module) => {

    const hasScore = completedModules.hasOwnProperty(module);
    const moduleData = hasScore 
      ? { 
          score: completedModules[module], 
          level: getLevelFromScore(completedModules[module]) 
        }
      : { score: null, level: null };
    
    const levelColors = hasScore 
      ? [`${colors.modules[module]}99`, colors.modules[module]] 
      : ['#CCCCCC', '#999999'];

      return (
        <TouchableOpacity
          key={module}
          activeOpacity={0.9}
          onPress={() => {
            if (!hasScore) {
              Alert.alert(
                `Start ${module} Test`,
                `You need to complete this module first to see detailed analysis.`,
                [
                  { 
                    text: "Start Test", 
                    onPress: () => navigation.navigate('ModuleSelectionScreen', {
                      autoStartModule: module
                    }) 
                  },
                  { text: "Later", style: "cancel" }
                ]
              );
            } else {
              navigation.navigate('ModuleSkillAnalysisDetailsScreen', { 
                module,
                score: completedModules[module]
              });
            }
          }}
          style={!hasScore && styles.incompleteCard}
        >

        <View style={styles.moduleCard}>
          <LinearGradient colors={levelColors} style={styles.moduleGradient}>
            {/* Header Row */}
            <View style={styles.moduleHeader}>
              <View style={[styles.moduleIconContainer, { backgroundColor: colors.modules[module] }]}>
                <Ionicons name={moduleIcons[module]} size={20} color="white" />
              </View>
              
              <View style={styles.moduleTextContainer}>
                <Text style={styles.moduleName}>{module}</Text>
                <Text style={styles.moduleStatus}>
                  {hasScore ? `Score: ${moduleData.score}%` : 'Pending'}
                </Text>
              </View>
              
              {hasScore && (
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>{moduleData.level}</Text>
                </View>
              )}
            </View>

           {/* Progress Bar */}
<View style={styles.progressBarContainer}>
  <Animated.View style={[
    styles.progressBarFill,
    { 
      width: hasScore 
        ? moduleProgressAnims[module].interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%']
          })
        : '0%',
      backgroundColor: colors.modules[module]
    }
  ]}>
    {hasScore && (
      <Text style={styles.progressBarText}>{moduleData.score}%</Text>
    )}
  </Animated.View>
</View>

            {/* Strengths/Improvement */}
            {hasScore && (
              <View style={styles.detailsPanel}>
                <Text style={styles.detailTitle}>
                  {moduleData.score >= 70 ? '✅ Strengths' : '⚠️ Improve'}
                </Text>
              </View>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  // ===== MAIN COMPONENT =====
  return (
    <ScrollView style={styles.container}>
      {/* Overall Progress Card */}
      <LinearGradient colors={['#4c669f', '#3b5998']} style={styles.progressCard}>
        <Text style={styles.progressTitle}>Skills Analysis Progress</Text>
        <Text style={styles.progressPercent}>{progressPercentage}%</Text>
        <Text style={styles.progressSubtitle}>
          {completedCount} of {totalModules} modules completed
        </Text>
        <View style={styles.progressBar}>
          <Animated.View style={[
            styles.progressFill, 
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', `${progressPercentage}%`]
              }) 
            }
          ]} />
        </View>
      </LinearGradient>

      {/* All-in-One Summary */}
      <Text style={styles.sectionTitle}>Overall Summary</Text>
<TouchableOpacity
  onPress={() => {
    if (completedCount === totalModules) {
      navigation.navigate('ModuleSkillAnalysisDetailsScreen', { 
        module: 'All-in-One',
        score: averageScore,
        isAggregate: true
      });
    }
  }}
  activeOpacity={completedCount === totalModules ? 0.7 : 1}
>
  <View style={styles.moduleCard}>
    <LinearGradient 
      colors={hasCompletedAny ? colors.levels[overallLevel] : ['#CCCCCC', '#999999']} 
      style={styles.moduleGradient}
    >
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIconContainer, { backgroundColor: colors.modules['All-in-One'] }]}>
          <Ionicons name="analytics-outline" size={20} color="white" />
        </View>
        <View style={styles.moduleTextContainer}>
          <Text style={styles.moduleName}>All-in-One</Text>
          <Text style={styles.moduleStatus}>
            {hasCompletedAny ? `Average: ${averageScore}%` : 'Complete modules to view'}
            {completedCount === totalModules ? ' (Completed)' : ''}
          </Text>
        </View>
        {hasCompletedAny && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{overallLevel}</Text>
          </View>
        )}
      </View>

      {/* Weakest Module Warning */}
      {weakestModule && (
        <View style={styles.weakestModuleBanner}>
          <Text style={styles.weakestModuleText}>
            Focus on: <Text style={{ fontWeight: 'bold' }}>{weakestModule.mod}</Text> (Lowest: {weakestModule.score}%)
          </Text>
        </View>
      )}
    </LinearGradient>
  </View>
</TouchableOpacity>

      {/* Modules Grid */}
      <Text style={styles.sectionTitle}>Module Analysis</Text>
      <View style={styles.modulesGrid}>
        {allModules.map(renderModuleCard)}
      </View>

      {/* Action Button */}
      
      // Replace the existing actionButton TouchableOpacity with this:
<TouchableOpacity 
  style={styles.actionButton}
  onPress={() => {
    if (completedCount === totalModules) {
      navigation.navigate('ModuleSkillAnalysisDetailsScreen', { 
        module: 'All-in-One',
        score: averageScore,
        isAggregate: true
      });
    } else {
      navigation.navigate('ModuleSelectionScreen', { 
        nextModule: allModules.find(mod => !completedModules[mod]) 
      });
    }
  }}
>
  <Text style={styles.actionButtonText}>
    {completedCount === totalModules ? 'View Detailed Report' : 'Continue Skills Analysis'}
  </Text>
</TouchableOpacity>

{/* Add this near your existing action button */}
<TouchableOpacity 
  style={[styles.actionButton, { backgroundColor: '#4CAF50', marginTop: 5 }]}
  onPress={() => navigation.navigate('ModuleSkillAnalysisDetailsScreen', { 
    module: 'All-in-One',
    isAggregate: true,
    score: 85 // Mock average score
  })}
>
  <Text style={styles.actionButtonText}>DEBUG: View All-in-One</Text>
</TouchableOpacity>
    </ScrollView>
  );
};

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5
  },
  progressPercent: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5
  },
  progressSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 15
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4
  },
  moduleCard: {
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden'
  },
  moduleGradient: {
    padding: 16
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  moduleIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  moduleTextContainer: {
    flex: 1
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2
  },
  moduleStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)'
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase'
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8
  },
  progressBarFill: {
    height: '100%',
    justifyContent: 'center',
    paddingRight: 8
  },
  progressBarText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'right'
  },
  detailsPanel: {
    marginTop: 12
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  weakestModuleBanner: {
    backgroundColor: 'rgba(255,107,107,0.2)',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B'
  },
  weakestModuleText: {
    color: '#FF3B3B',
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15
  },
  modulesGrid: {
    marginBottom: 20
  },
  actionButton: {
    backgroundColor: '#6200ea',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    marginTop: 10
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 8,
    position: 'relative' // Add this
  },
  progressBarFill: {
    height: '100%',
    justifyContent: 'center',
    paddingRight: 8,
    position: 'absolute', // Add this
    left: 0, // Add this
    top: 0 // Add this
  },
  incompleteCard: {
    opacity: 0.8
  }
});

export default SkillsAnalysisResultsScreen;