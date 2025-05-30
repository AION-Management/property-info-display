/**
 * Firebase Configuration and Initialization
 * 
 * This file sets up the Firebase connection for the Property Info Display application.
 * It configures Firebase Realtime Database for storing and retrieving property data.
 * 
 * Components:
 * - Firebase app initialization with project-specific config
 * - Realtime Database instance for property data storage
 * - Exported database reference for use throughout the application
 * 
 * Note: In production, sensitive config values should be stored in environment variables
 * for security best practices.
 */

// Import the functions we need from Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase project configuration object
// Contains all necessary keys and URLs for connecting to the specific Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyAPFBU9suppNC4F-1J1whP7iGIcKsB4C9c",
  authDomain: "property-info-1900.firebaseapp.com",
  databaseURL: "https://property-info-1900-default-rtdb.firebaseio.com", // Realtime Database URL
  projectId: "property-info-1900",
  storageBucket: "property-info-1900.firebasestorage.app",
  messagingSenderId: "34681854379",
  appId: "1:34681854379:web:b701e9221ebe9694399aee"
};

// Initialize Firebase app with the configuration
// This creates the connection to the Firebase project
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to it
// This database instance will be used for all property data operations
const database = getDatabase(app);

// Export both the app and database for use in other parts of the application
export { app, database }; 