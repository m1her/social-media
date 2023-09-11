import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNyPGvz9wi2wsVzhE922DFM7DMcC8xEIw",
  authDomain: "trainingwebproject-81110.firebaseapp.com",
  databaseURL:
    "https://trainingwebproject-81110-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "trainingwebproject-81110",
  storageBucket: "trainingwebproject-81110.appspot.com",
  messagingSenderId: "47871984348",
  appId: "1:47871984348:web:2bddcc6d35617f47aaaa19",
  measurementId: "G-1MX3T4MMQN",
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
