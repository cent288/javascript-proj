// Import needed functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";

// 🔹 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBzTPwVwjsifFakexbhfsvfOnT-4HCb4KM",
  authDomain: "ssc-forum-b6b4b.firebaseapp.com",
  projectId: "ssc-forum-b6b4b",
  storageBucket: "ssc-forum-b6b4b.firebasestorage.app",
  messagingSenderId: "317949002331",
  appId: "1:317949002331:web:5bce390e22be3bdf89357e",
  measurementId: "G-Z48JMLPE5P"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// Signup form handling
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user details in Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      email: email,
      role: "user",   // default role
      createdAt: new Date()
    });

    alert(`Signup successful! Welcome, ${name}`);
    console.log("User created:", user);

    // Redirect to login
    window.location.href = "login.html";
  } catch (error) {
    console.error("Signup error:", error);
    alert(error.message);
  }
});
