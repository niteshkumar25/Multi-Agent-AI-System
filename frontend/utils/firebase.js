// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
console.log("import.meta.env.VITE_FIREBASEAPIKEY", import.meta.env.FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "multi-agent-ai-system-74e01.firebaseapp.com",
  projectId: "multi-agent-ai-system-74e01",
  storageBucket: "multi-agent-ai-system-74e01.firebasestorage.app",
  messagingSenderId: "725489924091",
  appId: "1:725489924091:web:85f0bb17348f0a68ba7d5e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();