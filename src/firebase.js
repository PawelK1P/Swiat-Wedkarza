// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "webowka-7c887.firebaseapp.com",
  projectId: "webowka-7c887",
  storageBucket: "webowka-7c887.firebasestorage.app",
  messagingSenderId: "1037766533613",
  appId: "1:1037766533613:web:c9d32553b02ca8d1fe07e4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
