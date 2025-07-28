 
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {getAuth,GoogleAuthProvider } from "firebase/auth";

const envType = process.env.NEXT_PUBLIC_ENV || process.env.REACT_APP_ENV; // Get the environment from the environment variable

let firebaseConfig;

// Fallback configuration if environment variables are undefined
const fallbackConfig = {
  apiKey: "BIzaSyBmhG9nRsDWOCo6CYcpgp3j_I6iJPvuZ0I",
  authDomain: "nritya.firebaseapp.com",
  projectId: "nritya.7e5267",
  storageBucket: "nritya.appspot.com",
  messagingSenderId: "847",
  appId: "1:847422777654:web:999",
  measurementId: "G-YSM4JX"
};

switch (envType) {
  case "local":
    console.log("Local environment detected");
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_LOCAL || process.env.REACT_APP_FIREBASE_API_KEY_LOCAL || fallbackConfig.apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_LOCAL || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_LOCAL || fallbackConfig.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_LOCAL || process.env.REACT_APP_FIREBASE_PROJECT_ID_LOCAL || fallbackConfig.projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_LOCAL || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_LOCAL || fallbackConfig.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_LOCAL || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_LOCAL || fallbackConfig.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_LOCAL || process.env.REACT_APP_FIREBASE_APP_ID_LOCAL || fallbackConfig.appId,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_LOCAL || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_LOCAL || fallbackConfig.measurementId,
    };
    break;
  case "production":
    console.log("Production environment detected");
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_PROD || process.env.REACT_APP_FIREBASE_API_KEY_PROD || fallbackConfig.apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_PROD || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_PROD || fallbackConfig.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_PROD || process.env.REACT_APP_FIREBASE_PROJECT_ID_PROD || fallbackConfig.projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_PROD || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_PROD || fallbackConfig.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_PROD || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_PROD || fallbackConfig.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_PROD || process.env.REACT_APP_FIREBASE_APP_ID_PROD || fallbackConfig.appId,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_PROD || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_PROD || fallbackConfig.measurementId,
    };
    break;

  case "staging":
    console.log("Staging environment detected");
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_STAGE || process.env.REACT_APP_FIREBASE_API_KEY_STAGE || fallbackConfig.apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_STAGE || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_STAGE || fallbackConfig.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_STAGE || process.env.REACT_APP_FIREBASE_PROJECT_ID_STAGE || fallbackConfig.projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_STAGE || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_STAGE || fallbackConfig.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_STAGE || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_STAGE || fallbackConfig.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_STAGE || process.env.REACT_APP_FIREBASE_APP_ID_STAGE || fallbackConfig.appId,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_STAGE || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_STAGE || fallbackConfig.measurementId,
    };
    break;

  case "development":
    console.log("Development environment detected");
  default:
    firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_DEV || process.env.REACT_APP_FIREBASE_API_KEY_DEV || fallbackConfig.apiKey,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_DEV || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV || fallbackConfig.authDomain,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_DEV || process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV || fallbackConfig.projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_DEV || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV || fallbackConfig.storageBucket,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_DEV || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV || fallbackConfig.messagingSenderId,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_DEV || process.env.REACT_APP_FIREBASE_APP_ID_DEV || fallbackConfig.appId,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID_DEV || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID_DEV || fallbackConfig.measurementId,
    };
    break;
}

const gMapApiKey ={
  key: process.env.NEXT_PUBLIC_GMAP_API_KEY || process.env.REACT_APP_GMAP_API_KEY || "fallback-gmap-key"
};

// Initialize Firebase only on client side
let app, auth, db, storage, provider;

if (typeof window !== 'undefined') {
  try {
    console.log("Initializing Firebase...");
    console.log("Firebase config:", firebaseConfig);
    console.log("Environment type:", envType);
    
    app = initializeApp(firebaseConfig);
    provider = new GoogleAuthProvider();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log("Firebase initialized successfully");
    console.log("Auth object:", auth);
    console.log("Provider object:", provider);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // Provide fallback objects to prevent crashes
    app = null;
    auth = null;
    db = null;
    storage = null;
    provider = null;
  }
}

export {auth, provider, db, storage, gMapApiKey, firebaseConfig, envType};