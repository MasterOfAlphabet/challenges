

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");
const fs = require("fs");

// 🔹 Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyByNAR8mWYEq9F9hrSqwlLuKSZLGae-R1k",
    authDomain: "master-of-alphabet.firebaseapp.com",
    projectId: "master-of-alphabet",
    storageBucket: "master-of-alphabet.appspot.com",
    messagingSenderId: "620931661204",
    appId: "1:620931661204:web:fb0d6fc0d5bc5324186381"
  };
  

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 List of collections to export
const collectionsToExport = ["users", "challenges", "battles", "battleHistory", "testScores"];

async function exportFirestoreData() {
  console.log("🚀 Exporting Firestore data...");
  const backup = {};

  for (const collectionName of collectionsToExport) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    backup[collectionName] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // 🔹 Save data to JSON file
  fs.writeFileSync("firestore-backup.json", JSON.stringify(backup, null, 2));
  console.log("✅ Firestore data exported to firestore-backup.json");
}

// Run the export function
exportFirestoreData().catch(console.error);

