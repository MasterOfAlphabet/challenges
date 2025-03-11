const challenges = [
  {
    id: 1,
    text: "Spell the word 'Elephant'.",
    audio: require("../../assets/elephant.mp3"),
    answer: "Elephant", // Add the correct answer
  },
  {
    id: 2,
    text: "What is the past tense of 'run'?",
    image: require("../../assets/run.jpg"),
    answer: "Ran", // Add the correct answer
  },
  {
    id: 3,
    text: "Pronounce the word 'Chrysanthemum'.",
    audio: require("../../assets/chrysanthemum.mp3"),
    answer: "Chrysanthemum", // Add the correct answer
  },
];

export const getRandomChallenge = () => {
  const randomIndex = Math.floor(Math.random() * challenges.length);
  return challenges[randomIndex];
};