import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Unified color system combining Gamification and Module colors
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
    'S.H.A.R.P': '#ff9800'
  }
};

// Sample diagnostic data with unified colors
const diagnosticResults = {
  Spelling: { score: 72, level: 'Racer', weakAreas: ['Silent Letters', 'Homophones'] },
  Reading: { score: 85, level: 'Master', weakAreas: ['Inference'] },
  Grammar: { score: 68, level: 'Racer', weakAreas: ['Tenses', 'Prepositions'] },
  Vocabulary: { score: 91, level: 'Wizard', weakAreas: ['Technical Terms'] },
  Writing: { score: 77, level: 'Master', weakAreas: ['Cohesion'] },
  Listening: { score: 64, level: 'Rookie', weakAreas: ['Accents'] },
  Pronunciation: { score: 80, level: 'Prodigy', weakAreas: ['Intonation'] },
  'S.H.A.R.P': { score: 55, level: 'Rookie', weakAreas: ['Critical Thinking'] }
};

const DiagnosticDashboard = () => {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (module) => {
    setExpandedModules(prev => ({
      ...prev,
      [module]: !prev[module]
    }));
  };

  const getOverallLevel = () => {
    const avgScore = Object.values(diagnosticResults).reduce((sum, {score}) => sum + score, 0) / 8;
    if (avgScore >= 90) return 'Wizard';
    if (avgScore >= 75) return 'Prodigy';
    if (avgScore >= 60) return 'Master';
    if (avgScore >= 45) return 'Racer';
    return 'Rookie';
  };

  const renderModuleCard = (module, data) => {
    const isExpanded = expandedModules[module];
    const levelColors = colors.levels[data.level];
    const moduleColor = colors.modules[module];

    return (
      <TouchableOpacity 
        key={module}
        onPress={() => toggleModule(module)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={levelColors}
          style={[styles.moduleCard, isExpanded && styles.expandedCard]}
        >
          {/* Header Row */}
          <View style={styles.moduleHeader}>
            <View style={[styles.moduleIconContainer, { backgroundColor: moduleColor }]}>
              <Ionicons 
                name={
                  module === 'S.H.A.R.P' ? 'flash-outline' :
                  module.toLowerCase() + '-outline'
                } 
                size={20} 
                color="white" 
              />
            </View>
            
            <View style={styles.moduleTextContainer}>
              <Text style={styles.moduleName}>{module}</Text>
            </View>
            
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{data.level}</Text>
              <Ionicons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="white" 
                style={styles.chevron}
              />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={[styles.progressBarContainer, 
            { marginBottom: isExpanded ? 12 : 0 }]}>
            <View style={[styles.progressBarFill, { 
              width: `${data.score}%`,
              backgroundColor: moduleColor
            }]}>
              <Text style={styles.progressBarText}>{data.score}%</Text>
            </View>
          </View>

          {/* Expanded Content */}
          {isExpanded && (
            <View style={styles.detailsPanel}>
              <View style={styles.section}>
                <Text style={styles.detailTitle}>Weak Areas</Text>
                <View style={styles.weakAreasContainer}>
                  {data.weakAreas.map(area => (
                    <View key={area} style={[styles.weakAreaPill, { backgroundColor: moduleColor }]}>
                      <Text style={styles.weakAreaText}>{area}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.detailTitle}>How to Improve</Text>
                <View style={styles.tipsContainer}>
                  <Text style={styles.tipText}>• Practice {data.weakAreas[0]} exercises daily</Text>
                  <Text style={styles.tipText}>• Complete 3 {module} activities weekly</Text>
                  <Text style={styles.tipText}>• Review incorrect answers</Text>
                </View>
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const overallLevel = getOverallLevel();

  return (
    <ScrollView style={styles.container}>
      {/* Overall Health Card */}
      <LinearGradient
        colors={colors.levels[overallLevel]}
        style={styles.overallCard}
      >
        <View style={styles.overallHeader}>
          <Text style={styles.overallTitle} numberOfLines={1}>
            English Health Report
          </Text>
          
          <View style={styles.levelContainer}>
            <Text style={styles.levelText}>{overallLevel}</Text>
            <View style={styles.levelPill}>
              <Text style={styles.levelPillText}>
                {overallLevel === 'Wizard' ? '🏆 Top 1%' : 
                 overallLevel === 'Prodigy' ? '🌟 Advanced' :
                 overallLevel === 'Master' ? '✨ Proficient' :
                 overallLevel === 'Racer' ? '🚀 Improving' : '🌱 Beginner'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.overallSubtitle} numberOfLines={2}>
            {overallLevel === 'Wizard' ? 'You command English with mastery!' : 
             overallLevel === 'Prodigy' ? 'Your advanced skills are impressive!' :
             overallLevel === 'Master' ? 'You communicate with confidence' :
             overallLevel === 'Racer' ? 'Building strong foundations' : 'Your English journey begins here'}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </View>
          
          <View style={styles.statDivider}/>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(Object.values(diagnosticResults).reduce((sum, {score}) => sum + score, 0) / 8)}
            </Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          
          <View style={styles.statDivider}/>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Object.values(diagnosticResults).filter(({level}) => 
                ['Master', 'Prodigy', 'Wizard'].includes(level)
              ).length}
            </Text>
            <Text style={styles.statLabel}>Strong Areas</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Modules Section */}
      <Text style={styles.sectionTitle}>Module-wise Analysis</Text>
      <View style={styles.modulesGrid}>
        {Object.entries(diagnosticResults).map(([module, data]) => 
          renderModuleCard(module, data)
        )}
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {/* Navigate to practice plan */}}
      >
        <LinearGradient
          colors={['#6200ea', '#3700b3']}
          style={styles.actionButtonGradient}
        >
          <Text style={styles.actionButtonText}>Start Personalized Learning Plan</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 15,
  },
  overallCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 4
  },
  overallHeader: {
    marginBottom: 20
  },
  overallTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: 0.5
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  levelText: {
    fontSize: 28,
    fontWeight: '900',
    color: 'white',
    marginRight: 12,
    textTransform: 'uppercase'
  },
  levelPill: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4
  },
  levelPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white'
  },
  overallSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statItem: {
    alignItems: 'center',
    flex: 1
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginLeft: 5
  },
  modulesGrid: {
    marginBottom: 20
  },
  moduleCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    overflow: 'hidden'
  },
  expandedCard: {
    paddingBottom: 20
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
    flex: 1,
    marginRight: 10
  },
  moduleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 70
  },
  chevron: {
    marginLeft: 4
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
    textAlign: 'right',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1
  },
  detailsPanel: {
    marginTop: 10
  },
  section: {
    marginBottom: 16
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8
  },
  weakAreasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12
  },
  weakAreaPill: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8
  },
  weakAreaText: {
    fontSize: 12,
    color: '#fff'
  },
  tipsContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  tipText: {
    color: 'white',
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18
  },
  actionButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 3,
    marginTop: 10
  },
  actionButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8
  }
});

export default DiagnosticDashboard;