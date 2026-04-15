// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCK5QmqjeQC_vTNd9t43hEFD0tI7xtV5YA",
  authDomain: "ssc-prep-auth.firebaseapp.com",
  projectId: "ssc-prep-auth",
  storageBucket: "ssc-prep-auth.firebasestorage.app",
  messagingSenderId: "503080012818",
  appId: "1:503080012818:web:78ec370204b2ab362d9ccb",
  measurementId: "G-RZPJ4700Q8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
