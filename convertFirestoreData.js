const fs = require("fs");

const data = JSON.parse(fs.readFileSync("firestore-backup.json", "utf-8"));
const metadata = { version: "1.0.0", firestore: { version: "1.0.0" } };

// 🔹 Create a directory for the emulator backup
const backupDir = "firestore-backup";
fs.mkdirSync(backupDir, { recursive: true });

// 🔹 Save metadata file
fs.writeFileSync(`${backupDir}/firebase-export-metadata.json`, JSON.stringify(metadata, null, 2));

// 🔹 Save Firestore data in emulator format
fs.writeFileSync(`${backupDir}/firestore_export.json`, JSON.stringify(data, null, 2));

console.log("✅ Firestore data converted for Emulator import.");
