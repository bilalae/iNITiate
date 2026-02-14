// 1. Import getFirestore
import { getFirestore } from "firebase/firestore"; 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMmkEAWPMnAnNNGe0kRJq7xO9tbeMyCHc",
  authDomain: "initiate-web.firebaseapp.com",
  projectId: "initiate-web",
  storageBucket: "initiate-web.firebasestorage.app",
  messagingSenderId: "736183931023",
  appId: "1:736183931023:web:3c439034ea37347f9620fa",
  measurementId: "G-QRECVJSQT9"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 2. Initialize and EXPORT the database
export const db = getFirestore(app);
export const storage = getStorage(app);