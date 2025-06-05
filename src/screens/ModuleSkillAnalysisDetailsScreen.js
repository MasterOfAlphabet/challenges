import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, BarChart } from 'react-native-chart-kit';

// Module data moved outside component
const MODULE_DATA = {
  Spelling: {
    score: 82,
    color: '#f44336',
    icon: 'sparkles-outline',
    subtopics: [
      { name: 'Common Words', score: 90, questions: 20, mistakes: 2 },
      { name: 'Silent Letters', score: 75, questions: 15, mistakes: 4 },
      { name: 'Homophones', score: 65, questions: 18, mistakes: 7 },
      { name: 'Compound Words', score: 88, questions: 12, mistakes: 2 }
    ],
    commonErrors: [
      {
        type: 'Silent letters confusion',
        examples: [
          'Misspelled "knight" as "night" (3 times)',
          'Omitted "b" in "subtle"'
        ],
        tip: 'Create flashcards for silent letter words'
      }
    ],
    historicalScores: [72, 78, 82]
  },

  Reading: {
    score: 78,
    color: '#e91e63',
    icon: 'book-outline',
    subtopics: [
      { name: 'Comprehension', score: 85, questions: 25, mistakes: 4 },
      { name: 'Context Clues', score: 70, questions: 20, mistakes: 6 },
      { name: 'Speed', score: 65, questions: 15, mistakes: 6 },
      { name: 'Retention', score: 82, questions: 18, mistakes: 4 }
    ],
    commonErrors: [
      {
        type: 'Inference questions',
        examples: [
          'Missed implied meaning in 2 passages',
          'Incorrect conclusion about character motivation'
        ],
        tip: 'Practice identifying key supporting details'
      }
    ],
    historicalScores: [70, 74, 78]
  },

  Pronunciation: {
    score: 65,
    color: '#9c27b0',
    icon: 'mic-outline',
    subtopics: [
      { name: 'Vowel Sounds', score: 60, questions: 15, mistakes: 6 },
      { name: 'Consonant Clusters', score: 50, questions: 12, mistakes: 7 },
      { name: 'Word Stress', score: 75, questions: 18, mistakes: 5 },
      { name: 'Intonation', score: 70, questions: 16, mistakes: 5 }
    ],
    commonErrors: [
      {
        type: 'TH sounds',
        examples: [
          'Pronounced "think" as "sink"',
          'Confused "this" with "dis"'
        ],
        tip: 'Practice tongue placement with a mirror'
      }
    ],
    historicalScores: [58, 62, 65]
  },

  Grammar: {
    score: 72,
    color: '#673ab7',
    icon: 'code-slash-outline',
    subtopics: [
      { name: 'Tenses', score: 68, questions: 22, mistakes: 8 },
      { name: 'Articles', score: 75, questions: 15, mistakes: 4 },
      { name: 'Prepositions', score: 60, questions: 18, mistakes: 8 },
      { name: 'Sentence Structure', score: 80, questions: 20, mistakes: 4 }
    ],
    commonErrors: [
      {
        type: 'Present perfect tense',
        examples: [
          'Used simple past instead (4 errors)',
          'Forgotten auxiliary "have"'
        ],
        tip: 'Remember: present perfect connects past to present'
      }
    ],
    historicalScores: [65, 68, 72]
  },

  Writing: {
    score: 85,
    color: '#3f51b5',
    icon: 'create-outline',
    subtopics: [
      { name: 'Coherence', score: 88, questions: 15, mistakes: 2 },
      { name: 'Vocabulary', score: 82, questions: 20, mistakes: 4 },
      { name: 'Grammar', score: 80, questions: 18, mistakes: 4 },
      { name: 'Creativity', score: 90, questions: 12, mistakes: 2 }
    ],
    commonErrors: [
      {
        type: 'Transition phrases',
        examples: [
          'Abrupt topic changes in 2 essays',
          'Overused "and then"'
        ],
        tip: 'Learn 5 new transition phrases this week'
      }
    ],
    historicalScores: [78, 82, 85]
  },

  Listening: {
    score: 70,
    color: '#2196f3',
    icon: 'ear-outline',
    subtopics: [
      { name: 'Main Idea', score: 75, questions: 18, mistakes: 5 },
      { name: 'Details', score: 65, questions: 22, mistakes: 8 },
      { name: 'Inference', score: 68, questions: 20, mistakes: 7 },
      { name: 'Accent Adaptation', score: 72, questions: 15, mistakes: 5 }
    ],
    commonErrors: [
      {
        type: 'Fast speech',
        examples: [
          'Missed contractions in 3 clips',
          'Confused numbers: 15 vs 50'
        ],
        tip: 'Practice with 1.25x speed recordings'
      }
    ],
    historicalScores: [62, 66, 70]
  },

  Vocabulary: {
    score: 88,
    color: '#4caf50',
    icon: 'pricetags-outline',
    subtopics: [
      { name: 'Synonyms', score: 92, questions: 15, mistakes: 2 },
      { name: 'Antonyms', score: 85, questions: 12, mistakes: 2 },
      { name: 'Context Usage', score: 82, questions: 20, mistakes: 4 },
      { name: 'Word Forms', score: 90, questions: 18, mistakes: 2 }
    ],
    commonErrors: [
      {
        type: 'Formal vs informal',
        examples: [
          'Used "kids" in formal context',
          'Overused "very" instead of precise adjectives'
        ],
        tip: 'Study academic word list'
      }
    ],
    historicalScores: [82, 85, 88]
  },

  SHARP: {
    score: 68,
    color: '#ff9800',
    icon: 'flash-outline',
    subtopics: [
      { name: 'Speed', score: 70, questions: 15, mistakes: 5 },
      { name: 'Handwriting', score: 65, questions: 12, mistakes: 5 },
      { name: 'Accuracy', score: 60, questions: 20, mistakes: 8 },
      { name: 'Recall', score: 75, questions: 18, mistakes: 5 }
    ],
    commonErrors: [
      {
        type: 'Note-taking efficiency',
        examples: [
          'Wrote full sentences instead of keywords',
          'Missed 2 key points in lecture'
        ],
        tip: 'Practice Cornell note-taking method'
      }
    ],
    historicalScores: [60, 64, 68]
  },

  // ===== AGGREGATE MODULE =====
  'All-in-One': {
    score: 88,
    color: '#6200ee',
    icon: 'analytics-outline',
    isAggregate: true,
    moduleBreakdown: {
      Spelling: {
        score: 91,
        icon: 'sparkles-outline',
        color: '#f44336'
      },
      Reading: {
        score: 92,
        icon: 'book-outline',
        color: '#e91e63'
      },
      Pronunciation: {
        score: 75,
        icon: 'mic-outline',
        color: '#9c27b0'
      },
      Grammar: {
        score: 82,
        icon: 'code-slash-outline',
        color: '#673ab7'
      },
      Writing: {
        score: 85,
        icon: 'create-outline',
        color: '#3f51b5'
      },
      Listening: {
        score: 70,
        icon: 'ear-outline',
        color: '#2196f3'
      },
      Vocabulary: {
        score: 88,
        icon: 'pricetags-outline',
        color: '#4caf50'
      },
      SHARP: {
        score: 91,
        icon: 'flash-outline',
        color: '#ff9800'
      }
    },
    historicalScores: [78, 82, 96],
    recommendations: [
      'Focus on Pronunciation (your lowest module)',
      'Reinforce Grammar and writing fundamentals',
      'Work harder on Listening Skills'
    ]
  },
   // ===== AGGREGATE MODULE =====
   'Skills Analysis': {
    score: 82,
    color: '#6200ee',
    icon: 'analytics-outline',
    isAggregate: false,
    moduleBreakdown: {
      Spelling: {
        score: 91,
        icon: 'sparkles-outline',
        color: '#f44336'
      },
      Reading: {
        score: 92,
        icon: 'book-outline',
        color: '#e91e63'
      },
      Pronunciation: {
        score: 75,
        icon: 'mic-outline',
        color: '#9c27b0'
      },
      Grammar: {
        score: 82,
        icon: 'code-slash-outline',
        color: '#673ab7'
      },
      Writing: {
        score: 85,
        icon: 'create-outline',
        color: '#3f51b5'
      },
      Listening: {
        score: 70,
        icon: 'ear-outline',
        color: '#2196f3'
      },
      Vocabulary: {
        score: 88,
        icon: 'pricetags-outline',
        color: '#4caf50'
      },
      SHARP: {
        score: 91,
        icon: 'flash-outline',
        color: '#ff9800'
      }
    },
    historicalScores: [68, 72, 76],
    recommendations: [
      'Focus on Pronunciation (your lowest module)',
      'Reinforce Grammar fundamentals',
      'Capitalize on Vocabulary strength'
    ]
  }
};

const AggregateModuleView = ({ data, navigation }) => {
  const chartData = Object.entries(data.moduleBreakdown).map(([module, moduleData]) => ({
    module,
    ...moduleData,
    color: MODULE_DATA[module].color,
    icon: MODULE_DATA[module].icon
  }));

  return (
    <View style={styles.aggregateContainer}>
      {/* Radial Progress Circle with Icons */}
      <View style={styles.radialProgressContainer}>
        <View style={styles.centerScore}>
          <Text style={styles.overallScore}>{data.score}%</Text>
          <Text style={styles.overallLabel}>Composite Score</Text>
        </View>
        
        {chartData.map((item, index) => (
          <View 
            key={index}
            style={[
              styles.radialSegment,
              { 
                backgroundColor: `${item.color}30`,
                borderColor: item.color,
                transform: [
                  { rotate: `${(index * 45)}deg` },
                  { translateX: 80 }
                ]
              }
            ]}
          >
            <View style={[styles.iconWrapper, { transform: [{ rotate: `-${(index * 45)}deg` }] }]}>
              <Ionicons 
                name={item.icon} 
                size={16} 
                color={item.color} 
                style={styles.radialIcon}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Module Grid Below */}
      <View style={styles.moduleGrid}>
        {chartData.map((item, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.modulePill, { backgroundColor: `${item.color}20` }]}
            onPress={() => navigation.navigate('ModuleSkillAnalysisDetailsScreen', { module: item.module })}
          >
            <View style={[styles.moduleIconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={16} color="white" />
            </View>
            <Text style={styles.moduleName}>{item.module}</Text>
            <Text style={[styles.moduleScore, { color: item.color }]}>{item.score}%</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recommendationsBox}>
        <Text style={styles.recommendationsTitle}>Recommended Actions</Text>
        {data.recommendations.map((item, index) => (
          <View key={index} style={styles.recommendationItem}>
            <Ionicons name="chevron-forward" size={16} color="#6200ee" />
            <Text style={styles.recommendationText}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};


const ModuleSkillAnalysisDetailsScreen = ({ route, navigation }) => {
  const { module, score, isAggregate } = route.params;
  const moduleData = isAggregate ? {
    ...MODULE_DATA['All-in-One'],
    score: score || MODULE_DATA['All-in-One'].score
  } : MODULE_DATA[module];
  
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Add this useEffect to verify data
  useEffect(() => {
    if (!moduleData) {
      console.log('Missing module data:', { module, score, isAggregate });
      navigation.goBack();
    }
  }, [moduleData]);

  const getLevelFromScore = (score) => {
    if (score >= 90) return 'Wizard';
    if (score >= 75) return 'Prodigy';
    if (score >= 60) return 'Master';
    if (score >= 45) return 'Racer';
    return 'Rookie';
  };

  const level = getLevelFromScore(moduleData.score);
  const nextLevelThreshold = level === 'Rookie' ? 45 : 
                         level === 'Racer' ? 60 : 
                         level === 'Master' ? 75 : 
                         level === 'Prodigy' ? 90 : 100;
  const progressToNextLevel = moduleData.score >= 90 ? 100 : 
                         Math.max(0, moduleData.score - (nextLevelThreshold - 15)) / 15 * 100;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressToNextLevel,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, []);

  if (moduleData.isAggregate) {
    return (
      <ScrollView style={styles.container}>
        <AggregateModuleView data={moduleData} navigation={navigation} />
      </ScrollView>
    );
  }

  const strengths = moduleData.subtopics?.filter(t => t.score >= 70) || [];
  const weaknesses = moduleData.subtopics?.filter(t => t.score < 70) || [];

  const pieChartData = moduleData.subtopics?.map(topic => ({
    name: topic.name,
    score: topic.score,
    color: topic.score >= 70 ? '#4CAF50' : '#F44336',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12
  })) || [];

  const barChartData = {
    labels: moduleData.subtopics?.map(t => t.name) || [],
    datasets: [{
      data: moduleData.subtopics?.map(t => t.score) || []
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient 
        colors={[`${moduleData.color}99`, moduleData.color]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.moduleTitle}>{module}</Text>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>{moduleData.score}%</Text>
            <Text style={styles.levelText}>{level}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress to {getLevelFromScore(nextLevelThreshold)}</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View 
              style={[
                styles.progressFill,
                { 
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: moduleData.color
                }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.max(0, nextLevelThreshold - moduleData.score)}% to go
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Strengths & Weaknesses</Text>
        <View style={styles.strengthsWeaknessesContainer}>
          <View style={styles.swColumn}>
            <Text style={styles.swTitle}>✅ Strengths</Text>
            {strengths.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicScore}>{topic.score}%</Text>
              </View>
            ))}
          </View>
          <View style={styles.swColumn}>
            <Text style={styles.swTitle}>❗ Weaknesses</Text>
            {weaknesses.map((topic, index) => (
              <View key={index} style={styles.topicItem}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicScore}>{topic.score}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Topic Breakdown</Text>
        <View style={styles.chartContainer}>
          <PieChart
            data={pieChartData}
            width={Dimensions.get('window').width - 40}
            height={180}
            chartConfig={{
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2
            }}
            accessor="score"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        <View style={styles.chartContainer}>
          <BarChart
            data={barChartData}
            width={Dimensions.get('window').width - 40}
            height={220}
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: '#f8f9fa',
              backgroundGradientFrom: '#f8f9fa',
              backgroundGradientTo: '#f8f9fa',
              decimalPlaces: 0,
              color: (opacity = 1) => moduleData.color,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: moduleData.color
              }
            }}
            style={{ marginVertical: 8, borderRadius: 16 }}
          />
        </View>
      </View>

      {moduleData.commonErrors?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Common Errors</Text>
          {moduleData.commonErrors.map((error, index) => (
            <View key={index} style={styles.errorItem}>
              <Text style={styles.errorType}>{error.type}</Text>
              {error.examples.map((example, i) => (
                <View key={i} style={styles.exampleItem}>
                  <Text style={styles.exampleText}>• {example}</Text>
                </View>
              ))}
              {error.tip && <Text style={styles.tipText}>💡 {error.tip}</Text>}
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: moduleData.color }]}
          onPress={() => navigation.navigate('LearnPrepareTestScreen', { 
            module, 
            focusAreas: weaknesses.map(w => w.name) 
          })}
        >
          <Text style={styles.buttonText}>Practice Weak Areas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#6200ea' }]}
          onPress={() => navigation.navigate('SkillsTestScreen', { module })}
        >
          <Text style={styles.buttonText}>Retake Full Test</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles remain the same as in your original file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    marginBottom: 20
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  backButton: {
    padding: 5
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10
  },
  scoreContainer: {
    alignItems: 'center'
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white'
  },
  levelText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12
  },
  progressContainer: {
    marginTop: 10
  },
  progressBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 5
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
    textAlign: 'right'
  },
  strengthsWeaknessesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  swColumn: {
    width: '48%'
  },
  swTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  topicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  topicName: {
    fontSize: 14,
    color: '#555'
  },
  topicScore: {
    fontSize: 14,
    fontWeight: '600'
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10
  },
  errorItem: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  errorType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8
  },
  exampleItem: {
    marginLeft: 10,
    marginBottom: 5
  },
  exampleText: {
    fontSize: 14,
    color: '#666'
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginBottom: 30
  },
  button: {
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 12
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  aggregateContainer: {
    padding: 20,
  },
  radialProgressContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative'
  },
  radialSegment: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  overallScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  overallLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  modulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: '48%'
  },
  moduleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  moduleName: {
    flex: 1,
    fontSize: 12
  },
  moduleScore: {
    fontWeight: 'bold',
    fontSize: 12
  },
  recommendationsBox: {
    backgroundColor: '#f3e5ff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10
  },
  recommendationsTitle: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  recommendationText: {
    marginLeft: 5,
    fontSize: 14
  },
  tipText: {
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 5
  },
  aggregateContainer: {
    padding: 20,
  },
  radialProgressContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative'
  },
  radialSegment: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  overallScore: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee'
  },
  overallLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 15
  },
  modulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
    width: '48%'
  },
  moduleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  moduleName: {
    flex: 1,
    fontSize: 12
  },
  moduleScore: {
    fontWeight: 'bold',
    fontSize: 12
  },
  recommendationsBox: {
    backgroundColor: '#f3e5ff',
    borderRadius: 12,
    padding: 15,
    marginTop: 10
  },
  recommendationsTitle: {
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 10
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  recommendationText: {
    marginLeft: 5,
    fontSize: 14
  },
  modulePill: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  moduleIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  moduleName: {
    flex: 1,
    fontSize: 14,
    color: '#333'
  },
  moduleScore: {
    fontWeight: 'bold',
    fontSize: 14
  },
  radialProgressContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative'
  },
  centerScore: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2
  },
  radialSegment: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  radialIcon: {
    textAlign: 'center'
  }
});

export default ModuleSkillAnalysisDetailsScreen;