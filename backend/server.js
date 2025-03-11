const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Enable CORS for frontend requests
app.use(cors());

// Spelling words categorized by difficulty
const spellingWords = {
  rookie: [
    { id: 1, word: "cat", audio: "https://cdn.example.com/audio/cat.mp3", definition: "A small domesticated mammal." },
    { id: 2, word: "dog", audio: "https://cdn.example.com/audio/dog.mp3", definition: "A domesticated animal, often kept as a pet." },
  ],
  racer: [
    { id: 1, word: "happy", audio: "https://cdn.example.com/audio/happy.mp3", definition: "Feeling or showing pleasure." },
    { id: 2, word: "jungle", audio: "https://cdn.example.com/audio/jungle.mp3", definition: "A dense forest area." },
  ],
  master: [
    { id: 1, word: "architecture", audio: "https://cdn.example.com/audio/architecture.mp3", definition: "The design of buildings." },
    { id: 2, word: "hypothesis", audio: "https://cdn.example.com/audio/hypothesis.mp3", definition: "A proposed explanation." },
  ],
  prodigy: [
    { id: 1, word: "xenophobia", audio: "https://cdn.example.com/audio/xenophobia.mp3", definition: "Fear of foreigners." },
    { id: 2, word: "juxtaposition", audio: "https://cdn.example.com/audio/juxtaposition.mp3", definition: "Contrasting things close together." },
  ],
  wizard: [
    { id: 1, word: "onomatopoeia", audio: "https://cdn.example.com/audio/onomatopoeia.mp3", definition: "Words that imitate sounds." },
    { id: 2, word: "antidisestablishmentarianism", audio: "https://cdn.example.com/audio/antidisestablishmentarianism.mp3", definition: "Opposition to disestablishment of a state church." },
  ]
};

// API endpoint to fetch spelling words based on difficulty level
app.get("/api/spelling-words", (req, res) => {
  const level = req.query.level?.toLowerCase();

  if (!level || !spellingWords[level]) {
    return res.status(400).json({ error: "Invalid level. Choose from: rookie, racer, master, prodigy, wizard." });
  }

  res.json({
    difficulty: level.charAt(0).toUpperCase() + level.slice(1),
    words: spellingWords[level]
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://192.168.29.84:${PORT}`);
});
