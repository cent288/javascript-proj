import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const logoutBtn = document.getElementById("logoutBtn");
const postThreadBtn = document.getElementById("postThreadBtn");
const threadInput = document.getElementById("threadInput");
const threadsList = document.getElementById("threadsList");

let currentUser = null;

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loadThreads();
  } else {
    window.location.href = "login.html";
  }
});

// Post new thread
if (postThreadBtn) {
  postThreadBtn.addEventListener("click", async () => {
    const text = threadInput.value.trim();
    if (!text) return alert("Please write something before posting.");

    try {
      await addDoc(collection(db, "threads"), {
        text,
        author: currentUser.email,
        createdAt: serverTimestamp()
      });
      threadInput.value = "";
      loadThreads();
    } catch (err) {
      console.error("Error posting thread:", err);
      alert("Error posting thread.");
    }
  });
}

// Load threads
async function loadThreads() {
  try {
    const q = query(collection(db, "threads"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    threadsList.innerHTML = "";
    if (querySnapshot.empty) {
      threadsList.innerHTML = "<p style='text-align:center;color:#777;'>No threads yet. Be the first!</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const t = docSnap.data();
      const threadDiv = document.createElement("div");
      threadDiv.className = "thread";

      threadDiv.innerHTML = `
        <div class="meta">Posted by <b>${t.author}</b> • ${t.createdAt?.toDate().toLocaleString() || "just now"}</div>
        <div class="content">${t.text}</div>
      `;
      threadsList.appendChild(threadDiv);
    });
  } catch (err) {
    console.error("Error loading threads:", err);
    threadsList.innerHTML = "<p style='text-align:center;color:red;'>Error loading threads.</p>";
  }
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully.");
      window.location.href = "login.html";
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
}
