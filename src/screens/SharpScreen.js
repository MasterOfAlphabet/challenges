import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from "react-native";

// S.H.A.R.P data for each category & level
const sharpData = {
  Synonyms: {
    Rookie: [
      { word: "happy", answer: "joyful" },
      { word: "big", answer: "large" },
    ],
    Racer: [
      { word: "fast", answer: "quick" },
      { word: "smart", answer: "intelligent" },
    ],
    Master: [
      { word: "difficult", answer: "challenging" },
      { word: "brave", answer: "courageous" },
    ],
    Prodigy: [
      { word: "meticulous", answer: "thorough" },
      { word: "exquisite", answer: "elegant" },
    ],
    Wizard: [
      { word: "serendipity", answer: "fortunate discovery" },
      { word: "ephemeral", answer: "short-lived" },
    ],
  },
  Homonyms: {
    Rookie: [
      { word: "bat", answer: "bat (animal) / bat (sports)" },
      { word: "bank", answer: "bank (river) / bank (finance)" },
    ],
    Racer: [
      { word: "light", answer: "light (illumination) / light (not heavy)" },
      { word: "row", answer: "row (argument) / row (line of seats)" },
    ],
    Master: [
      { word: "lead", answer: "lead (metal) / lead (guide)" },
      { word: "bow", answer: "bow (bend) / bow (archery)" },
    ],
    Prodigy: [
      { word: "refuse", answer: "refuse (trash) / refuse (deny)" },
      { word: "present", answer: "present (gift) / present (now)" },
    ],
    Wizard: [
      { word: "cleave", answer: "cleave (split) / cleave (stick)" },
      { word: "sanction", answer: "sanction (approve) / sanction (penalty)" },
    ],
  },
  Antonyms: {
    Rookie: [
      { word: "hot", answer: "cold" },
      { word: "up", answer: "down" },
    ],
    Racer: [
      { word: "fast", answer: "slow" },
      { word: "happy", answer: "sad" },
    ],
    Master: [
      { word: "include", answer: "exclude" },
      { word: "accept", answer: "reject" },
    ],
    Prodigy: [
      { word: "abundant", answer: "scarce" },
      { word: "optimistic", answer: "pessimistic" },
    ],
    Wizard: [
      { word: "benevolent", answer: "malevolent" },
      { word: "complex", answer: "simple" },
    ],
  },
  Rhyming: {
    Rookie: [
      { word: "cat", answer: "hat" },
      { word: "sun", answer: "fun" },
    ],
    Racer: [
      { word: "dog", answer: "log" },
      { word: "tree", answer: "bee" },
    ],
    Master: [
      { word: "light", answer: "fight" },
      { word: "phone", answer: "bone" },
    ],
    Prodigy: [
      { word: "shimmer", answer: "glimmer" },
      { word: "struggle", answer: "juggle" },
    ],
    Wizard: [
      { word: "plight", answer: "knight" },
      { word: "rhythm", answer: "algorithm" }, // approximate rhyme
    ],
  },
  Plurals: {
    Rookie: [
      { word: "child", answer: "children" },
      { word: "mouse", answer: "mice" },
    ],
    Racer: [
      { word: "goose", answer: "geese" },
      { word: "leaf", answer: "leaves" },
    ],
    Master: [
      { word: "cactus", answer: "cacti" },
      { word: "focus", answer: "foci" },
    ],
    Prodigy: [
      { word: "datum", answer: "data" },
      { word: "analysis", answer: "analyses" },
    ],
    Wizard: [
      { word: "phenomenon", answer: "phenomena" },
      { word: "criterion", answer: "criteria" },
    ],
  },
};

// Time limits for each level
const timeLimits = {
  Rookie: 15,
  Racer: 10,
  Master: 8,
  Prodigy: 6,
  Wizard: 4,
};

export default function SharpScreen() {
  // Category & Level
  const [currentCategory, setCurrentCategory] = useState("Synonyms");
  const [gamificationLevel, setGamificationLevel] = useState("Rookie");

  // Flashcard Index
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Flip Animation
  const flipValue = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  // Timed Mode
  const [timedMode, setTimedMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Retrieve the flashcards for the chosen category & level
  const flashcards = sharpData[currentCategory][gamificationLevel] || [];
  const currentCard = flashcards[currentCardIndex];

  // Whenever category or level changes, reset the card & timer
  useEffect(() => {
    setCurrentCardIndex(0);
    resetFlip();
    resetTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCategory, gamificationLevel]);

  // Flip the card
  const flipCard = () => {
    Animated.timing(flipValue, {
      toValue: isFlipped ? 0 : 180,
      duration: 500,
      useNativeDriver: true, // If blank on web, set to false
    }).start(() => setIsFlipped(!isFlipped));
  };

  // Next card
  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
      resetFlip();
      resetTimer();
    }
  };

  // Previous card
  const previousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex((prev) => prev - 1);
      resetFlip();
      resetTimer();
    }
  };

  // Reset the flip to front
  const resetFlip = () => {
    setIsFlipped(false);
    flipValue.setValue(0);
  };

  // Reset timer
  const resetTimer = () => {
    if (timedMode) {
      setTimeLeft(timeLimits[gamificationLevel]);
    } else {
      setTimeLeft(0);
    }
  };

  // Timed Mode countdown
  useEffect(() => {
    if (!timedMode) return;
    if (timeLeft <= 0) {
      // If time's up, move to next card
      if (currentCard) nextCard();
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, timedMode]);

  // Interpolate front/back rotation
  const frontInterpolate = flipValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>S.H.A.R.P Practice</Text>

      {/* Category Selection */}
      <View style={styles.categoryButtons}>
        {Object.keys(sharpData).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              currentCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setCurrentCategory(category)}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timed Mode + Level Selection */}
      <View style={styles.timedModeContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, timedMode && styles.toggleButtonActive]}
          onPress={() => {
            setTimedMode(!timedMode);
            resetTimer();
          }}
        >
          <Text style={styles.toggleButtonText}>
            {timedMode ? "Timed: ON" : "Timed: OFF"}
          </Text>
        </TouchableOpacity>

        <View style={styles.levelButtons}>
          {Object.keys(timeLimits).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.levelButton,
                gamificationLevel === level && styles.activeLevelButton,
              ]}
              onPress={() => setGamificationLevel(level)}
            >
              <Text style={styles.levelButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Timer */}
      {timedMode && <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>}

      {/* Flashcard */}
      <View style={styles.flashcardContainer}>
        {!currentCard ? (
          <Text style={styles.flashcardText}>No cards available.</Text>
        ) : (
          <>
            {/* Front Side */}
            <Animated.View
              style={[
                styles.flashcard,
                styles.flashcardFront,
                frontAnimatedStyle,
              ]}
            >
              <Text style={styles.flashcardText}>{currentCard.word}</Text>
            </Animated.View>

            {/* Back Side */}
            <Animated.View
              style={[
                styles.flashcard,
                styles.flashcardBack,
                backAnimatedStyle,
              ]}
            >
              <Text style={styles.flashcardText}>{currentCard.answer}</Text>
            </Animated.View>
          </>
        )}
      </View>

      {/* Flip & Navigation */}
      {currentCard && (
        <>
          <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
            <Text style={styles.flipButtonText}>Flip Card</Text>
          </TouchableOpacity>
          <View style={styles.navButtons}>
            <TouchableOpacity onPress={previousCard} style={styles.navButton}>
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextCard} style={styles.navButton}>
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  categoryButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 15,
  },
  categoryButton: {
    padding: 8,
    margin: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  activeCategoryButton: {
    backgroundColor: "#007bff",
  },
  categoryButtonText: {
    fontSize: 16,
    color: "#000",
  },
  timedModeContainer: {
    marginBottom: 10,
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  toggleButtonActive: {
    backgroundColor: "#28a745",
  },
  toggleButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  levelButtons: {
    flexDirection: "row",
    marginTop: 5,
  },
  levelButton: {
    backgroundColor: "#ddd",
    padding: 8,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeLevelButton: {
    backgroundColor: "#ff9900",
  },
  levelButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e74c3c",
  },
  flashcardContainer: {
    width: 300,
    height: 200,
    marginBottom: 20,
    position: "relative",
  },
  flashcard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  flashcardFront: {
    backgroundColor: "#007bff",
    zIndex: 2,
  },
  flashcardBack: {
    backgroundColor: "#ffcc00",
    zIndex: 1,
    transform: [{ rotateY: "180deg" }],
  },
  flashcardText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 10,
  },
  flipButton: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  flipButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 10,
  },
  navButton: {
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 5,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
