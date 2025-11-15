// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBzTPwVwjsifFakexbhfsvfOnT-4HCb4KM",
  authDomain: "ssc-forum-b6b4b.firebaseapp.com",
  projectId: "ssc-forum-b6b4b",
  storageBucket: "ssc-forum-b6b4b.firebasestorage.app",
  messagingSenderId: "317949002331",
  appId: "1:317949002331:web:5bce390e22be3bdf89357e",
  measurementId: "G-Z48JMLPE5P"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
