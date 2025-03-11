

// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyByNAR8mWYEq9F9hrSqwlLuKSZLGae-R1k",
  authDomain: "master-of-alphabet.firebaseapp.com",
  projectId: "master-of-alphabet",
  storageBucket: "master-of-alphabet.appspot.com",
  messagingSenderId: "620931661204",
  appId: "1:620931661204:web:fb0d6fc0d5bc5324186381"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };