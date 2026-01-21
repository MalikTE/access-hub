// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0DBVk9Rf6n0gMDyJk1DRGhk04W4T-cyI",
  authDomain: "vaultguard-f0f08.firebaseapp.com",
  projectId: "vaultguard-f0f08",
  storageBucket: "vaultguard-f0f08.firebasestorage.app",
  messagingSenderId: "393297047860",
  appId: "1:393297047860:web:f41f6edbdce28594daf561"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);