import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnA31AAsREVEaGSKF21_xqliunCR5paaY", 
  authDomain: "neuralbraille.firebaseapp.com",
  databaseURL: "https://neuralbraille-default-rtdb.europe-west1.firebasedatabase.app", // 🔥 RADAR DB BURADA OLMALI
  projectId: "neuralbraille",
  storageBucket: "neuralbraille.firebasestorage.app",
  messagingSenderId: "554273615738",
  appId: "1:554273615738:web:9983d566b34f697a10f0c3"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); 
export const auth = getAuth(app);
export default app;
