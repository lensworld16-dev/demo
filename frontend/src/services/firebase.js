import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let auth;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Analytics is only supported in browser environments
  isSupported().then(yes => {
    if (yes) analytics = getAnalytics(app);
  });
} catch (err) {
  console.warn('Firebase initialization failed:', err.message);
  // Create a minimal mock so the app doesn't crash
  app = null;
  auth = null;
}

const googleProvider = new GoogleAuthProvider();

export { auth };

export const firebaseAuth = {
  signUp: (email, password) => {
    if (!auth) throw new Error('Firebase not configured. Please set environment variables.');
    return createUserWithEmailAndPassword(auth, email, password);
  },
  signIn: (email, password) => {
    if (!auth) throw new Error('Firebase not configured. Please set environment variables.');
    return signInWithEmailAndPassword(auth, email, password);
  },
  signInWithGoogle: () => {
    if (!auth) throw new Error('Firebase not configured. Please set environment variables.');
    return signInWithPopup(auth, googleProvider);
  },
  signOut: () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  },
  onAuthChange: (callback) => {
    if (!auth) {
      // Immediately call with null user and return no-op unsubscribe
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  },
  updateProfile: (user, data) => {
    if (!auth) throw new Error('Firebase not configured.');
    return updateProfile(user, data);
  },
  resetPassword: (email) => {
    if (!auth) throw new Error('Firebase not configured.');
    return sendPasswordResetEmail(auth, email);
  },
};

export default app;
