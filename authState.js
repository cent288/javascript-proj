// authState.js
import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const navbarUser = document.getElementById("navbarUser");
const logoutBtn = document.getElementById("logoutBtn");
const loginNav = document.getElementById("loginNav");
const signupNav = document.getElementById("signupNav");
const adminLink = document.getElementById("adminLink");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    let name = user.email; // fallback if no name
    let role = "user";

    if (userDoc.exists()) {
      name = userDoc.data().name || user.email;
      role = userDoc.data().role || "user";
    }

    // Update navbar
    if (navbarUser) {
      navbarUser.textContent = `👋 Hi, ${name}`;
      navbarUser.parentElement.style.display = "inline-block"; // show <li>
    }
    if (logoutBtn) logoutBtn.parentElement.style.display = "inline-block"; // show <li>
    if (loginNav) loginNav.style.display = "none";
    if (signupNav) signupNav.style.display = "none";

    // Show admin link only if role is admin
    if (role === "admin" && adminLink) {
      adminLink.style.display = "inline-block";
    }
  } else {
    // Not logged in
    if (navbarUser) navbarUser.parentElement.style.display = "none";
    if (logoutBtn) logoutBtn.parentElement.style.display = "none";
    if (loginNav) loginNav.style.display = "inline-block";
    if (signupNav) signupNav.style.display = "inline-block";
    if (adminLink) adminLink.style.display = "none";
  }
});

// Logout button
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "index.html"; // redirect home after logout
  });
}
