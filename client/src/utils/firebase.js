
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "authnotesgenerator-60796.firebaseapp.com",
  projectId: "authnotesgenerator-60796",
  storageBucket: "authnotesgenerator-60796.firebasestorage.app",
  messagingSenderId: "580677373898",
  appId: "1:580677373898:web:3b7f2a71ee609212e24933"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export {auth, provider}