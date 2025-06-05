import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";

const moduleOptions = [
  "Spelling", "Reading", "Pronunciation", "Grammar",
  "Writing", "Listening", "Vocabulary", "S.H.A.R.P."
];

const moduleColors = {
  Spelling: "#f44336",
  Reading: "#e91e63",
  Pronunciation: "#9c27b0",
  Grammar: "#673ab7",
  Writing: "#3f51b5",
  Listening: "#2196f3",
  Vocabulary: "#4caf50",
  "S.H.A.R.P.": "#ff9800",
};

const moduleIcons = {
  Spelling: "book-outline",
  Reading: "reader-outline",
  Pronunciation: "mic-outline",
  Grammar: "create-outline",
  Writing: "pencil-outline",
  Listening: "headset-outline",
  Vocabulary: "library-outline",
  "S.H.A.R.P.": "flash-outline",
};

const moduleDescriptions = {
  Spelling: "Spelling is a fundamental skill that helps improve reading, writing, and communication. Learning proper spelling enhances vocabulary, boosts confidence, and reduces confusion in written communication.",
  Reading: "Reading is the key to understanding and learning new information. It strengthens comprehension, enhances focus, and develops imagination. Being a strong reader helps in academics and real-world problem-solving.",
  Pronunciation: "Proper pronunciation is essential for clear communication. It ensures that words are understood correctly and helps in building confidence while speaking.",
  Grammar: "Grammar is the backbone of any language. Understanding grammar rules helps in constructing meaningful sentences and improving communication skills.",
  Writing: "Writing is a powerful tool for expressing thoughts and ideas. It enhances creativity, builds critical thinking, and improves communication skills.",
  Listening: "Listening is an important skill that helps in understanding and interpreting information effectively. Good listening skills improve focus, comprehension, and communication.",
  Vocabulary: "A rich vocabulary enhances both spoken and written communication. It allows for clearer expression of ideas and helps in understanding complex texts.",
  "S.H.A.R.P.": "The S.H.A.R.P. module focuses on Synonyms, Homophones, Antonyms, Root words, and Plural forms. It strengthens vocabulary and improves word relationships.",
};

const moduleCategories = {
  Spelling: [
    { 
      title: "Dictation", 
      description: "Dictation helps reinforce spelling by requiring students to listen and write words correctly.", 
      example: "Teacher says 'accommodation', you write 'accommodation'.",
      benefits: [
        "Improves listening-writing coordination",
        "Builds exam readiness (aligns with TSBIE dictation tests)",
        "Enhances phonetic decoding skills"
      ],
      telanganaAdaptation: "Uses local vocabulary (e.g., 'Banjara', 'Golconda')"
    },
    { 
      title: "Unscramble", 
      description: "Rearranging scrambled letters helps recognize letter patterns.", 
      example: "'pplae' → 'apple'.",
      benefits: [
        "Develops problem-solving skills",
        "Teaches common letter clusters (e.g., 'pp', 'le')",
        "Boosts visual processing speed"
      ],
      telanganaAdaptation: "Includes Telugu-origin words (e.g., 'pulihora' → 'p-u-l-i-h-o-r-a')"
    },
    { 
      title: "Missing Letters", 
      description: "Filling in missing letters strengthens spelling recall.", 
      example: "'a_ple' → 'apple'.",
      benefits: [
        "Reinforces word structure memory",
        "Focuses on tricky vowel placements",
        "Adapts difficulty based on performance"
      ],
      telanganaAdaptation: "Highlights local pronunciation traps (e.g., 'village' vs 'willage')"
    },
    { 
      title: "Find the Correctly Spelled Word", 
      description: "Choosing the correct spelling enhances word recognition.", 
      example: "(a) accomodation (b) accommodation (c) acommodation",
      benefits: [
        "Trains error-spotting for exams",
        "Exposes common misspellings",
        "Builds proofreading skills"
      ],
      telanganaAdaptation: "Focuses on Telangana board exam vocabulary"
    },
    { 
      title: "Spell The Pic", 
      description: "Students spell words based on visual cues, enhancing vocabulary retention and letter-pattern recognition.", 
      example: "🖼️ [Image of an apple] → Student types 'a-p-p-l-e'",
      benefits: [
        "Strengthens visual-word association",
        "Improves phonemic awareness (sounds to letters)",
        "Engages visual learners effectively"
      ],
      telanganaAdaptation: "Uses locally relevant images (e.g., Charminar, mango farms)"
    }
  ],
  Reading: [
    {
      title: "Word Attack",
      description: "Master decoding strategies for challenging vocabulary.",
      example: "Breaking down 'un-fa-mil-iar' through syllables",
      benefits: [
        "Builds foundational phonics skills",
        "Essential for NEET/TS EAMCET technical terms",
        "Improves reading speed by 40% (Perfetti, 2017)"
      ],
      telanganaAdaptation: "Focuses on Telangana board exam vocabulary"
    },
    {
      title: "Sentence Sprint", 
      description: "Read and comprehend sentences under time pressure.",
      example: "'The quick brown fox jumps over the lazy dog.' → Answer questions",
      benefits: [
        "Develops rapid processing skills",
        "Prepares for competitive exam time constraints",
        "Enhances grammatical pattern recognition"
      ],
      telanganaAdaptation: "Uses local proverbs (e.g., 'Donga chinna koduku...')"
    },
    {
      title: "Paragraph Detective",
      description: "Identify main ideas and supporting details.",
      example: "Highlight topic sentences in a passage about Kakatiya architecture",
      benefits: [
        "Critical for board exam comprehension",
        "Teaches annotation strategies",
        "Builds summarization skills"
      ],
      telanganaAdaptation: "Texts about Telangana heritage sites"
    },
    {
      title: "Story Lab",
      description: "Interactive fiction with comprehension challenges.",
      example: "Choose-your-own-adventure folktales with Q&A checkpoints",
      benefits: [
        "Boosts inferential thinking",
        "Makes reading enjoyable",
        "Expands cultural knowledge"
      ],
      telanganaAdaptation: "Stories featuring Bonthu Rammurthy (TS mascot)"
    },
    {
      title: "News Navigator",
      description: "Current events adapted to reading levels.",
      example: "Simplified article about Kaleshwaram project with vocabulary support",
      benefits: [
        "Connects learning to real-world",
        "Prepares for GD/PI rounds",
        "Develops critical media literacy"
      ],
      telanganaAdaptation: "Articles from Eenadu/Telangana Today"
    },
    {
      title: "Anchor Academy",
      description: "Practice news reading and public speaking.",
      example: "Read T-News bulletin script with intonation practice",
      benefits: [
        "Builds confidence for elocutions",
        "Improves pronunciation and fluency",
        "Develops professional communication skills"
      ],
      telanganaAdaptation: "Scripts about local achievements"
    },
    {
      title: "Poetry Puzzle",
      description: "Analyze poetic devices in regional literature.",
      example: "Identify metaphors in Kaloji Narayana Rao's poems",
      benefits: [
        "Enhances figurative language understanding",
        "Deepens cultural appreciation",
        "Develops creative thinking"
      ],
      telanganaAdaptation: "Focus on Telangana revolutionary poets"
    },
    {
      title: "Debate Dash",
      description: "Read and rebut argumentative texts.",
      example: "Counter-arguments for 'Online vs Offline Education'",
      benefits: [
        "Sharpens analytical reading",
        "Prepares for debate competitions",
        "Develops persuasive writing skills"
      ],
      telanganaAdaptation: "Topics like 'Telangana IT growth vs Agriculture'"
    }
  ],
  Pronunciation: [
    {
      title: "Phonetic Breakdown",
      description: "Master individual sounds with mouth positioning guides",
      example: "Practice /θ/ vs /ð/ (thin vs this) with video demonstrations",
      benefits: [
        "Corrects fossilized pronunciation errors",
        "Builds awareness of tongue/lip placement",
        "Essential for IELTS/TOEFL speaking tests"
      ],
      telanganaAdaptation: "Focuses on sounds absent in Telugu (e.g., /z/, /f/)"
    },
    {
      title: "Word Stress Gym", 
      description: "Learn syllable stress patterns through interactive exercises",
      example: "Visualize stress in 'TELangana' vs 'HyderaBAD'",
      benefits: [
        "Improves intelligibility by 62% (Derwing & Munro, 2005)",
        "Prepares for professional presentations",
        "Reduces mother tongue influence"
      ],
      telanganaAdaptation: "Uses local place names (e.g., Secunderabad → SEC-un-der-a-bad)"
    },
    {
      title: "Sentence Rhythm",
      description: "Master linking, reductions, and intonation patterns",
      example: "Practice 'wanna' for 'want to' in natural speech",
      benefits: [
        "Develops native-like flow",
        "Critical for call center/job interviews",
        "Teaches punctuation-based pausing"
      ],
      telanganaAdaptation: "Uses movie dialogues from Telugu-dubbed English films"
    },
    {
      title: "Accent Mirror",
      description: "Compare and adjust regional pronunciations",
      example: "Hyderabadi 'water' (vater) vs RP 'water' (waw-tuh)",
      benefits: [
        "Builds code-switching ability",
        "Reduces accent-based discrimination",
        "Develops listening flexibility"
      ],
      telanganaAdaptation: "Compares Warangal/Karimnagar/Hyderabad accents"
    },
    {
      title: "Tongue Twister Arena",
      description: "Build muscle memory through challenging phrases",
      example: "She sells seashells → Records and compares to native speaker",
      benefits: [
        "Improves articulation speed",
        "Fun way to practice problematic sounds",
        "Boosts confidence in public speaking"
      ],
      telanganaAdaptation: "Bilingual twisters (e.g., 'Red lorry, yellow lorry' → 'Rendu rakta, rendu puvvu')"
    },
    {
      title: "Newsreader Challenge",
      description: "Record yourself anchoring news segments",
      example: "Read T-News headlines with professional feedback",
      benefits: [
        "Teaches formal register pronunciation",
        "Prepares for media careers",
        "Develops pacing and emphasis skills"
      ],
      telanganaAdaptation: "Scripts about local events (Kumbh Mela, Bathukamma)"
    },
    {
      title: "Karaoke Lab",
      description: "Sing English songs with real-time pitch analysis",
      example: "Taylor Swift lyrics with vowel elongation practice",
      benefits: [
        "Makes practice enjoyable",
        "Teaches emotional intonation",
        "Improves vowel clarity"
      ],
      telanganaAdaptation: "Telugu film songs translated to English"
    },
    {
      title: "Debate Duel",
      description: "Pronunciation-focused argument games",
      example: "Defend 'Online Education' while focusing on /v/ vs /w/ sounds",
      benefits: [
        "Contextualizes pronunciation in real communication",
        "Develops quick thinking",
        "Reduces anxiety about mistakes"
      ],
      telanganaAdaptation: "Topics like 'Statehood vs Development'"
    }
  ],
  Grammar: [
    {
      title: "Sentence Architects",
      description: "Master sentence structures and word order patterns",
      example: "Transform 'Students Telangana in English struggle with' → 'Students in Telangana struggle with English'",
      benefits: [
        "Eliminates 60% of common writing errors",
        "Essential for board exam essays",
        "Builds foundation for advanced writing"
      ],
      telanganaAdaptation: "Uses local proverbs for sentence rearrangement"
    },
    {
      title: "Tense Titans", 
      description: "Conquer all verb tenses with time-mapping techniques",
      example: "Practice present perfect with 'Since 2014, Telangana ___ (build) 25 new IT hubs'",
      benefits: [
        "Critical for technical writing",
        "Improves storytelling fluency",
        "Eliminates tense-shifting errors"
      ],
      telanganaAdaptation: "Timelines of Telangana's development milestones"
    },
    {
      title: "Punctuation Power",
      description: "Master the silent conductors of meaning in written English",
      example: "Correct: 'Hyderabad, the city of pearls, will host IICT2024; prepare now!'",
      benefits: [
        "Increases writing clarity by 40%",
        "Essential for scoring in board exams",
        "Prepares for professional documentation"
      ],
      telanganaAdaptation: "Practice with speeches by KCR, Kavitha, etc."
    },
    {
      title: "Preposition Pioneers",
      description: "Demystify spatial and temporal relationships",
      example: "Fill in: 'The Kakatiya Rudreshwara Temple is ___ Warangal district'",
      benefits: [
        "Improves descriptive accuracy",
        "Reduces MTI errors (e.g., 'on the tree' → 'in the tree')",
        "Vital for map-based explanations"
      ],
      telanganaAdaptation: "Uses Telangana geography for practice"
    },
    {
      title: "Article Avengers",
      description: "Master the correct usage of articles (a, an, the) and zero article",
      example: "Fill in: '___ Charminar is ___ iconic monument in ___ Hyderabad.'",
      benefits: [
        "Reduces 50% of common article errors",
        "Essential for formal writing & board exams",
        "Improves clarity in descriptions"
      ],
      telanganaAdaptation: "Practice with news headlines about local events"
    },
    {
      title: "Modality Masters",
      description: "Navigate the nuances of auxiliary verbs and their shades of meaning",
      example: "Complete: 'Students in Telangana ___ (should/must) learn about local history.'",
      benefits: [
        "Enhances persuasive communication",
        "Critical for debates & formal requests",
        "Improves politeness in speech"
      ],
      telanganaAdaptation: "Debates on local issues using modal verbs"
    },
    {
      title: "Clause Crusaders",
      description: "Construct and analyze complex sentence structures",
      example: "Combine: 'Telangana is rich in culture. It was formed in 2014.' → 'Telangana, which was formed in 2014, is rich in culture.'",
      benefits: [
        "Improves academic writing skills",
        "Essential for IELTS/TOEFL preparation",
        "Makes sentences more sophisticated"
      ],
      telanganaAdaptation: "Rewrite local folktales using target structures"
    },
    {
      title: "Voice Virtuosos",
      description: "Transform sentences between active and passive voice",
      example: "Convert: 'The government launched Mission Bhagiratha.' → 'Mission Bhagiratha was launched by the government.'",
      benefits: [
        "Key for technical & report writing",
        "Enhances formal communication",
        "Reduces redundancy in sentences"
      ],
      telanganaAdaptation: "Analyze government scheme descriptions as examples"
    },
    {
      title: "Grammar Gamers",
      description: "Compete in fast-paced grammar challenges",
      example: "Error spotting: 'Telangana student are excelling in national exams.' → 'Telangana students are excelling...'",
      benefits: [
        "Boosts quick thinking in grammar rules",
        "Prepares for competitive exams",
        "Makes learning interactive & fun"
      ],
      telanganaAdaptation: "School vs. school grammar olympiads"
    }
  ],
  Writing: [
    {
      title: "Script Sculptors",
      description: "Master clear and fluent English handwriting techniques",
      example: "Practice forming letters with 'Telangana' place names like Warangal, Khammam, Nizamabad",
      benefits: [
        "Improves exam paper presentation",
        "Essential for documentation jobs",
        "Builds muscle memory for fluid writing"
      ],
      telanganaAdaptation: "Trace historical Telangana documents (Qutb Shahi era)"
    },
    {
      title: "Word Weavers",
      description: "Expand vocabulary with contextually appropriate word choices",
      example: "Replace 'good' → 'prosperous' in 'Telangana has good farmland'",
      benefits: [
        "Enhances descriptive writing by 40%",
        "Reduces repetitive word usage",
        "Critical for creative writing"
      ],
      telanganaAdaptation: "Learn through Telangana festivals (Bathukamma, Bonalu)"
    },
    {
      title: "Sentence Architects",
      description: "Construct varied sentence structures for impact",
      example: "Transform 'Hyderabad is hot. It has IT hubs.' → 'Despite the heat, Hyderabad thrives as an IT hub.'",
      benefits: [
        "Eliminates 60% of common writing errors",
        "Essential for board exam scoring",
        "Prepares for professional communication"
      ],
      telanganaAdaptation: "Restructure local proverbs in English"
    },
    {
      title: "Paragraph Pioneers",
      description: "Develop cohesive paragraphs with logical flow",
      example: "Organize points about Kaleshwaram Project: 1) Purpose 2) Benefits 3) Challenges",
      benefits: [
        "Foundation for essay writing",
        "Improves scoring in competitive exams",
        "Teaches systematic idea presentation"
      ],
      telanganaAdaptation: "Analyze newspaper editorials from Eenadu/Telangana Today"
    },
    {
      title: "Story Spinners",
      description: "Craft engaging narratives with proper structure",
      example: "Write a folktale about Golconda Fort with: Introduction → Conflict → Resolution",
      benefits: [
        "Develops imaginative thinking",
        "Improves sequencing skills",
        "Essential for content creation"
      ],
      telanganaAdaptation: "Retell Bonalu legends in English"
    },
    {
      title: "Fact Finders",
      description: "Write precise informational content with evidence",
      example: "Draft a 100-word report on Pochampally ikat weaving process",
      benefits: [
        "Critical for academic writing",
        "Improves research skills",
        "Prepares for journalism"
      ],
      telanganaAdaptation: "Document local crafts/schemes (T-Hub, Mission Kakatiya)"
    },
    {
      title: "Opinion Crafters",
      description: "Present persuasive arguments with supporting points",
      example: "Write for/against: 'Should Hyderabad have more metro routes?'",
      benefits: [
        "Develops critical thinking",
        "Essential for debate preparation",
        "Improves logical reasoning"
      ],
      telanganaAdaptation: "Discuss local issues (crop prices, IT growth)"
    },
    {
      title: "Narrative Navigators",
      description: "Blend description and storytelling techniques",
      example: "Describe a day at Durgam Cheruvu using sensory details",
      benefits: [
        "Enhances descriptive power",
        "Improves travel/feature writing",
        "Useful for content creation"
      ],
      telanganaAdaptation: "Write about Charminar from a tourist's perspective"
    },
    {
      title: "Email Experts",
      description: "Master formal and informal email writing",
      example: "Draft a query to TSPSC about exam dates using proper format",
      benefits: [
        "Essential for job applications",
        "Improves professional communication",
        "Teaches tone adaptation"
      ],
      telanganaAdaptation: "Practice with govt. office scenarios (RTA, MeeSeva)"
    },
    {
      title: "Editing Elites",
      description: "Develop proofreading and rewriting skills",
      example: "Improve: 'Telangana make many IT jobs in cyberabad' → 'Telangana generates numerous IT jobs in Cyberabad.'",
      benefits: [
        "Saves marks in exams",
        "Essential for publishing",
        "Develops attention to detail"
      ],
      telanganaAdaptation: "Edit district tourism brochures"
    }
  ],
  Listening: [
    {
      title: "Word Warriors",
      description: "Discriminate between similar-sounding English words",
      example: "Identify 'ship' vs 'sheep' in minimal pair exercises",
      benefits: [
        "Develops phonemic awareness",
        "Reduces mother tongue interference",
        "Builds foundation for vocabulary acquisition"
      ],
      telanganaAdaptation: "Focuses on Telugu-English sound conflicts (e.g., 'v' vs 'w')",
      activityTypes: [
        "Minimal pair bingo",
        "Sound isolation games",
        "Accent comparison"
      ]
    },
    {
      title: "Sentence Sleuths",
      description: "Understand spoken sentences in different accents",
      example: "Transcribe: 'The festival starts at dawn near Charminar'",
      benefits: [
        "Improves real-time processing speed",
        "Prepares for English-medium instruction",
        "Enhances question-answering skills"
      ],
      telanganaAdaptation: "Uses local landmarks and cultural references",
      activityTypes: [
        "Dictation challenges",
        "Voice modulation exercises",
        "Sentence reconstruction"
      ]
    },
    {
      title: "Paragraph Detectives",
      description: "Extract key information from spoken passages",
      example: "Listen to a weather report and identify affected districts",
      benefits: [
        "Develops note-taking strategies",
        "Improves academic listening skills",
        "Builds concentration stamina"
      ],
      telanganaAdaptation: "Content about Telangana's geography/climate",
      activityTypes: [
        "Information gap activities",
        "Graphic organizer completion",
        "Summary challenges"
      ]
    },
    {
      title: "Comprehension Champions",
      description: "Answer inferential questions about audio content",
      example: "Listen to a debate on Telangana's IT growth and identify main arguments",
      benefits: [
        "Develops critical thinking",
        "Prepares for competitive exams",
        "Enhances prediction skills"
      ],
      telanganaAdaptation: "Uses authentic materials from T-News/Radio Mirchi",
      activityTypes: [
        "Q&A tournaments",
        "Debate listening logs",
        "Perspective analysis"
      ]
    },
    {
      title: "Dialogue Decoders",
      description: "Follow conversations in noisy environments",
      example: "Understand restaurant orders amidst background noise",
      benefits: [
        "Builds real-world listening resilience",
        "Improves pragmatic understanding",
        "Develops turn-taking awareness"
      ],
      telanganaAdaptation: "Uses local market/transport scenarios",
      activityTypes: [
        "Background noise challenges",
        "Role-play comprehension",
        "Social cue identification"
      ]
    },
    {
      title: "Lecture Navigators",
      description: "Process academic-style spoken English",
      example: "Follow a 5-minute lecture on Kakatiya architecture",
      benefits: [
        "Prepares for university studies",
        "Develops organizational listening",
        "Teaches lecture mapping"
      ],
      telanganaAdaptation: "Content from Telangana history/culture",
      activityTypes: [
        "Cornell note-taking drills",
        "Signal word identification",
        "Concept mapping"
      ]
    },
    {
      title: "News Analysts",
      description: "Interpret broadcast journalism language",
      example: "Compare headlines from BBC and T-News on same event",
      benefits: [
        "Develops media literacy",
        "Enhances formal language processing",
        "Builds fact-checking skills"
      ],
      telanganaAdaptation: "Local news clips with global comparisons",
      activityTypes: [
        "Bias detection exercises",
        "Headline matching",
        "Reporter's notebook"
      ]
    },
    {
      title: "Song Sleuths",
      description: "Decode lyrics in musical contexts",
      example: "Identify environmental themes in folk song adaptations",
      benefits: [
        "Makes learning enjoyable",
        "Teaches rhythmic prediction",
        "Develops cultural appreciation"
      ],
      telanganaAdaptation: "Telugu folk songs with English translations",
      activityTypes: [
        "Gap fill karaoke",
        "Mood analysis",
        "Genre comparison"
      ]
    }
  ],
  Vocabulary: [
    {
      title: "Puzzle Pundits",
      description: "Solve rebus puzzles and visual word challenges",
      example: "Rebus: 🚪+🪜+🌊 = 'Door-step-wave' → 'Durgam Cheruvu' (Hyderabad lake)",
      benefits: [
        "Develops lateral thinking",
        "Improves visual-word association",
        "Boosts problem-solving speed"
      ],
      telanganaAdaptation: "Puzzles using Telangana monuments/festivals"
    },
    {
      title: "Riddle Raiders",
      description: "Decrypt word-based riddles and hidden meanings",
      example: "'I'm in Warangal but not in Hyderabad. Start with T, end with M. (Answer: Telangana State Museum)'",
      benefits: [
        "Enhances logical deduction",
        "Expands contextual vocabulary",
        "Prepares for competitive exam puzzles"
      ],
      telanganaAdaptation: "Riddles about local history (Qutb Shahi, Kakatiya)"
    },
    {
      title: "Word Wizards",
      description: "Find hidden words within sentences/themes",
      example: "List all fruits in: 'During Bonalu, we offer bananas, jaggery, and coconuts at the temple'",
      benefits: [
        "Sharpens scanning skills",
        "Improves focus and attention to detail",
        "Useful for editing/proofreading"
      ],
      telanganaAdaptation: "Identify crops in Telangana budget speeches"
    },
    {
      title: "Definition Dynamos",
      description: "Fast-paced word definition challenges",
      example: "Define 'Sericulture' → 'Silk farming (relevant to Pochampally weavers)'",
      benefits: [
        "Builds academic vocabulary",
        "Improves dictionary skills",
        "Essential for viva voce exams"
      ],
      telanganaAdaptation: "Terms from Telangana's industries (IT, handlooms)"
    },
    {
      title: "Anthyakshari Avengers",
      description: "Word chain game with ending/starting letters",
      example: "Telangana → Apple → Elephant → Tank → Kakatiya → Apple...",
      benefits: [
        "Enhances quick recall",
        "Improves pronunciation",
        "Develops spontaneity in speaking"
      ],
      telanganaAdaptation: "Focus on Telangana cities/landmarks (A: Adilabad → B: Bhongir...)"
    },
    {
      title: "Sequential Sensations",
      description: "Alphabetical word sequencing under time pressure",
      example: "A: Apple → B: Biryani → C: Charminar → D: Durgam Cheruvu...",
      benefits: [
        "Expands active vocabulary",
        "Trains alphabetical sorting",
        "Prepares for spelling bees"
      ],
      telanganaAdaptation: "Use only Telangana-related words (K: KCR → L: Laknavaram...)"
    },
    {
      title: "Chain Spellers",
      description: "Collectively build words letter-by-letter under time pressure",
      example: "Student 1: 'B' → Student 2: 'I' → Student 3: 'R' → 'Y' → 'A' → 'N' → 'I'",
      benefits: [
        "Encourages teamwork",
        "Develops quick thinking",
        "Makes spelling practice social"
      ],
      telanganaAdaptation: "Theme-based chains (e.g., only Telangana cities)"
    },
    {
      title: "Context Crushers",
      description: "Guess meanings from surrounding text",
      example: "'The farmer protested against the ryotwari system...' → ryotwari = land revenue system",
      benefits: [
        "Solves unknown words in exams",
        "Improves reading speed",
        "Reduces dictionary dependency"
      ],
      telanganaAdaptation: "Practice with Telangana land reform documents"
    },
    {
      title: "Collocation Champions",
      description: "Learn natural word pairings",
      example: "Heavy rain (not 'strong rain'), Dense population (not 'thick population')",
      benefits: [
        "Eliminates MTI errors",
        "Makes speech sound native-like",
        "Key for professional emails"
      ],
      telanganaAdaptation: "Practice with local phrases ('Cheruvu water levels')"
    },
    {
      title: "Idiom Explorers",
      description: "Understand figurative phrases in context",
      example: "Use 'The KCR government is rolling up its sleeves' to mean preparing for action",
      benefits: [
        "Makes speech more natural",
        "Improves reading comprehension",
        "Key for interview performance"
      ],
      telanganaAdaptation: "Match Telugu idioms to English equivalents"
    },
    {
      title: "Academic Aces",
      description: "Master subject-specific terminology",
      example: "Agriculture terms: 'irrigation', 'monsoon-dependent', 'cash crops (like cotton)'",
      benefits: [
        "Essential for technical writing",
        "Improves textbook comprehension",
        "Prepares for university studies"
      ],
      telanganaAdaptation: "Learn terms from Telangana's IT/Agri sectors"
    },

    {
      title: "Register Detectives",
      description: "Distinguish formal vs. informal word choices",
      example: "Formal: 'The government shall allocate funds' | Informal: 'The govt will give money'",
      benefits: [
        "Improves job interview performance",
        "Essential for official letters",
        "Teaches code-switching"
      ],
      telanganaAdaptation: "Compare political speeches vs. social media posts"
    },
    {
      title: "Etymology Experts",
      description: "Explore word origins and historical shifts",
      example: "'Char Minar' = Four Towers (Persian), 'Nizam' = Administrator (Arabic)",
      benefits: [
        "Boosts retention through stories",
        "Connects to cultural history",
        "Makes learning memorable"
      ],
      telanganaAdaptation: "Study Hyderabad's multilingual word influences"
    }
  ],
  "S.H.A.R.P.": [
    {
      title: "Synonym Safari",
      description: "Expand vocabulary by discovering word alternatives",
      example: "Find 3 synonyms for 'happy' → joyful, content, delighted",
      benefits: [
        "Enhances writing variety and richness",
        "Critical for essay writing in board exams",
        "Improves reading comprehension"
      ],
      telanganaAdaptation: "Focuses on synonyms for Telangana cultural terms (e.g., 'festival' → 'Bathukamma, Bonalu, Sankranti')"
    },
    {
      title: "Homonym Hunt", 
      description: "Master words that sound alike but have different meanings",
      example: "Identify correct usage of 'bear' (animal) vs 'bear' (to carry)",
      benefits: [
        "Reduces confusion in listening comprehension",
        "Essential for competitive exams",
        "Develops contextual understanding"
      ],
      telanganaAdaptation: "Uses local examples (e.g., 'bank' of river Godavari vs 'bank' for money)"
    },
    {
      title: "Antonym Arena",
      description: "Learn word opposites through interactive challenges",
      example: "Match opposites: 'ancient' ↔ 'modern'",
      benefits: [
        "Strengthens conceptual understanding",
        "Improves logical reasoning skills",
        "Expands active vocabulary"
      ],
      telanganaAdaptation: "Contrasts urban/rural terms (e.g., 'metro' vs 'village')"
    },
    {
      title: "Rhyme Time",
      description: "Create rhyming word families and poetic patterns",
      example: "Generate rhymes for 'school' → cool, rule, pool",
      benefits: [
        "Develops phonemic awareness",
        "Makes learning fun and musical",
        "Prepares for poetry analysis"
      ],
      telanganaAdaptation: "Includes bilingual rhymes (English words that rhyme with Telugu)"
    },
    {
      title: "Plural Puzzle",
      description: "Master regular and irregular plural forms",
      example: "Convert 'child' → 'children', 'formula' → 'formulae'",
      benefits: [
        "Eliminates common grammatical errors",
        "Essential for academic writing",
        "Builds foundation for subject-verb agreement"
      ],
      telanganaAdaptation: "Focuses on words borrowed from Telugu (e.g., 'dosa' → 'dosas')"
    },
    {
      title: "SHARP Showdown",
      description: "Competitive games combining all SHARP elements",
      example: "90-second challenge: give synonym, antonym, and rhyme for 'light'",
      benefits: [
        "Reinforces connections between concepts",
        "Develops quick thinking skills",
        "Makes revision engaging"
      ],
      telanganaAdaptation: "Team competitions between schools/districts"
    }
  ]
};

export default function LearningScreen() {
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const categories = moduleCategories[selectedModule] || [];

  return (
    <ScrollView style={styles.container}>
      {/* Module Header with Icon and Color */}
      <View style={[styles.header, { backgroundColor: moduleColors[selectedModule] }]}>
        <Ionicons name={moduleIcons[selectedModule]} size={30} color="#fff" style={styles.headerIcon} />
        <Text style={styles.headerText}>{selectedModule} Learning</Text>
      </View>
      
      {/* Module Description */}
      <Text style={styles.moduleDescription}>{moduleDescriptions[selectedModule]}</Text>

      {/* Dropdown to Select Module */}
      <Picker
        selectedValue={selectedModule}
        onValueChange={(itemValue) => setSelectedModule(itemValue)}
      >
        {moduleOptions.map((module) => (
          <Picker.Item key={module} label={module} value={module} />
        ))}
      </Picker>

      {/* Accordion-Style Category Cards with Different Colors */}
      {categories.map((category, index) => (
        <View key={index} style={[styles.card, { backgroundColor: moduleColors[selectedModule] }]}>
          <TouchableOpacity
            onPress={() => setExpandedCategory(expandedCategory === index ? null : index)}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>{category.title}</Text>
          </TouchableOpacity>

          {expandedCategory === index && (
            <View style={styles.cardContent}>
              <Text style={styles.cardDescription}>{category.description}</Text>
              <Text style={styles.cardExample}>Example: {category.example}</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", padding: 15, borderRadius: 8, marginBottom: 15 },
  headerIcon: { marginRight: 10 },
  headerText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  moduleDescription: { fontSize: 16, color: "#666", marginBottom: 20, textAlign: "center" },
  card: { marginBottom: 10, borderRadius: 8, elevation: 2, padding: 15 },
  cardHeader: { paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  cardContent: { paddingTop: 10 },
  cardDescription: { fontSize: 16, color: "#fff", marginBottom: 5 },
  cardExample: { fontSize: 14, fontStyle: "italic", color: "#eee" },
});
