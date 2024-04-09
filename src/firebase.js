// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy8lWU576n3VHexwlzQAlTrvqaGLjgCWc",
  authDomain: "iam1-e3294.firebaseapp.com",
  projectId: "iam1-e3294",
  storageBucket: "iam1-e3294.appspot.com",
  messagingSenderId: "464096630786",
  appId: "1:464096630786:web:dcffd69265c3286b04af1b",
  measurementId: "G-6ZB2W0W0K8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app); // Get the auth instance
const db = getFirestore(app); // Get the Firestore instance

export { app, auth, db };
