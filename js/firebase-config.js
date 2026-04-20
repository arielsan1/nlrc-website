// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy, limit, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzigFwH9AKZqSMEs3fMBSRvYczOE0kePc",
  authDomain: "nlrc-kinetic-admin.firebaseapp.com",
  projectId: "nlrc-kinetic-admin",
  storageBucket: "nlrc-kinetic-admin.firebasestorage.app",
  messagingSenderId: "850314796934",
  appId: "1:850314796934:web:6706bb41ca886549111607",
  measurementId: "G-BM61CQBRB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);

export { 
    db, collection, addDoc, getDocs, onSnapshot, query, orderBy, limit, setDoc, doc, getDoc,
    auth, provider, signInWithPopup, onAuthStateChanged, signOut,
    analytics 
};
