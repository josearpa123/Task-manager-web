import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBnngXU6HtNcRbatZmYFTh3XW83gZ4dIes",
    authDomain: "talentotech-c0dd5.firebaseapp.com",
    projectId: "talentotech-c0dd5",
    storageBucket: "talentotech-c0dd5.firebasestorage.app",
    messagingSenderId: "193698523787",
    appId: "1:193698523787:web:c0d6b41058bfcf0d8cc28e"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
