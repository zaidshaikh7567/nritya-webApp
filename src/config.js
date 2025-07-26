 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth,GoogleAuthProvider } from "firebase/auth";

const envType = process.env.REACT_APP_ENV; // Get the environment from the environment variable

let firebaseConfig;

switch (envType) {
  case "production":
    firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_PROD,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_PROD,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_PROD,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PROD,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_PROD,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_PROD,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_PROD,
    };
    break;

  case "staging":
    firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_STAGE,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_STAGE,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_STAGE,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_STAGE,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_STAGE,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_STAGE,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_STAGE,
    };
    break;

  case "development":
  default:
    firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
      appId: process.env.REACT_APP_FIREBASE_APP_ID_DEV,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_DEV,
    };
    break;
}

const gMapApiKey ={
  key: process.env.REACT_APP_GMAP_API_KEY
};

// Initialize Firebase only on client side
let app, auth, db, storage, provider;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    provider = new GoogleAuthProvider();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    // Provide fallback objects to prevent crashes
    app = null;
    auth = null;
    db = null;
    storage = null;
    provider = null;
  }
}

export {auth, provider, db, storage, gMapApiKey, firebaseConfig, envType};