import { auth, db } from "./firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updatePassword 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { doc, setDoc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// --- SIGNUP ---
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user profile with default role = "user"
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "user",
        createdAt: new Date()
      });

      alert("✅ Signup successful! You can now login.");
      window.location.href = "login.html";
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

// --- LOGIN ---
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        console.log("User role:", role);

        if (role === "admin") {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "profile.html"; // redirect to profile
        }
      } else {
        alert("⚠️ User data not found.");
      }

    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

// --- LOGOUT ---
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("👋 Logged out successfully.");
      window.location.href = "login.html";
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  });
}

// --- LISTEN AUTH STATE + GLOBAL NAVBAR UPDATE ---
onAuthStateChanged(auth, async (user) => {
  const navbarUser = document.getElementById("navbarUser");
  const loginNav = document.getElementById("loginNav");
  const signupNav = document.getElementById("signupNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const adminLink = document.getElementById("adminLink");

  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();

      // --- Show profile info (profile.html) ---
      const nameEl = document.getElementById("profileName");
      const emailEl = document.getElementById("profileEmail");
      const roleEl = document.getElementById("profileRole");

      if (nameEl) nameEl.textContent = data.name;
      if (emailEl) emailEl.textContent = data.email;
      if (roleEl) roleEl.textContent = data.role;

      // --- Navbar updates ---
      if (navbarUser) {
        navbarUser.textContent = `👋 Hi, ${data.name}`;
        navbarUser.style.display = "inline-block";
      }
      if (loginNav) loginNav.style.display = "none";
      if (signupNav) signupNav.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";

      if (adminLink) {
        adminLink.style.display = data.role === "admin" ? "inline-block" : "none";
      }

      // --- UPDATE PROFILE (Name + Password) ---
      const profileForm = document.getElementById("profileForm");
      if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          const newName = document.getElementById("newName").value;
          const newPassword = document.getElementById("newPassword").value;

          try {
            // Update Firestore name
            if (newName) {
              await updateDoc(doc(db, "users", user.uid), { name: newName });

              if (nameEl) nameEl.textContent = newName;
              if (navbarUser) navbarUser.textContent = `👋 Hi, ${newName}`;
            }

            // Update password in Firebase Auth
            if (newPassword) {
              await updatePassword(user, newPassword);
              alert("🔑 Password updated successfully!");
            }

            alert("✅ Profile updated!");
          } catch (error) {
            alert("❌ Error updating profile: " + error.message);
          }
        });
      }
    }
  } else {
    // --- Reset navbar when logged out ---
    if (navbarUser) navbarUser.style.display = "none";
    if (loginNav) loginNav.style.display = "inline-block";
    if (signupNav) signupNav.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (adminLink) adminLink.style.display = "none";
  }
});
