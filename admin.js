import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { collection, getDocs, doc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const userTableBody = document.getElementById("userTableBody");
const threadTableBody = document.getElementById("threadTableBody");
const logoutBtn = document.getElementById("logoutBtn");

// Protect Admin Page
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const role = userDoc.data().role;
      if (role !== "admin") {
        alert("⛔ Access denied. Admins only.");
        window.location.href = "index.html";
      } else {
        document.getElementById("adminWelcome").textContent = "👑 Welcome, Admin!";
        loadUsers();
        loadThreads();
      }
    }
  } else {
    window.location.href = "login.html";
  }
});

// Load users with admin-first sorting
async function loadUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  let users = [];
  snapshot.forEach(docSnap => {
    users.push({ id: docSnap.id, ...docSnap.data() });
  });

  // Sort: admins first
  users.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return a.name.localeCompare(b.name);
  });

  userTableBody.innerHTML = "";
  users.forEach(user => {
    userTableBody.innerHTML += `
      <tr>
        <td class="${user.role === "admin" ? "admin" : ""}">${user.name || "N/A"}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
      </tr>
    `;
  });
}

// Load threads
async function loadThreads() {
  const snapshot = await getDocs(collection(db, "threads"));
  let threads = [];
  snapshot.forEach(docSnap => {
    threads.push({ id: docSnap.id, ...docSnap.data() });
  });

  // Sort: admins' posts first
  threads.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return (b.date || 0) - (a.date || 0);
  });

  threadTableBody.innerHTML = "";
  threads.forEach(thread => {
    threadTableBody.innerHTML += `
      <tr>
        <td class="${thread.role === "admin" ? "admin" : ""}">${thread.author || "Unknown"}</td>
        <td>${thread.content || ""}</td>
        <td>${thread.date ? new Date(thread.date).toLocaleString() : ""}</td>
        <td><button class="delete-btn" data-id="${thread.id}">Delete</button></td>
      </tr>
    `;
  });

  // Add delete listeners
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this post?")) {
        await deleteDoc(doc(db, "threads", id));
        loadThreads();
      }
    });
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}
