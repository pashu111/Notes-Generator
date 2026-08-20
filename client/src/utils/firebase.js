
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "authnotesgenerator-60796.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "authnotesgenerator-60796",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "authnotesgenerator-60796.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "580677373898",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:580677373898:web:3b7f2a71ee609212e24933"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}