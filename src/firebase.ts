import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkEQ0Pz8Tpp0e-qosBSSZ-rwu0zAo2kyo", 
  authDomain: "globaltalk40-1757b.firebaseapp.com",
  databaseURL: "https://neuralbraille-default-rtdb.europe-west1.firebasedatabase.app", // 🔥 RADAR DB
  projectId: "globaltalk40-1757b",
  storageBucket: "globaltalk40-1757b.appspot.com",
  messagingSenderId: "596406605495",
  appId: "1:596406605495:web:9dcdaed970fa4a70869f32"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 
export const auth = getAuth(app);
export default app;