import { db, auth } from "./firebase.js";
import { ref, onValue, remove }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { onAuthStateChanged, signOut }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) window.location.href = "login.html";
});

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

// New post button
const newPostBtn = document.getElementById("new-post-btn");
if (newPostBtn) newPostBtn.onclick = () => window.location.href = "editor.html";
const createBtn = document.getElementById("create-post");
if (createBtn) createBtn.onclick = () => window.location.href = "editor.html";

// Load posts
const table = document.getElementById("posts-table");
const totalEl = document.getElementById("total-posts");
const featuredEl = document.getElementById("featured-posts");

onValue(ref(db, "posts"), (snapshot) => {
  const posts = [];
  snapshot.forEach((child) => {
    posts.push({ id: child.key, ...child.val() });
  });

  posts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  totalEl.textContent = posts.length;
  featuredEl.textContent = posts.filter(p => p.featured).length;

  if (posts.length === 0) {
    table.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;">No posts yet. Click "New Post" to start.</td></tr>`;
    return;
  }

  table.innerHTML = posts.map(p => `
    <tr>
      <td><img src="${p.image}" alt=""></td>
      <td>${p.title}</td>
      <td>${p.category}</td>
      <td>${new Date(p.createdAt || 0).toLocaleDateString()}</td>
      <td>
        <button class="action-btn edit-btn" data-id="${p.id}">Edit</button>
        <button class="action-btn delete-btn" data-id="${p.id}">Delete</button>
      </td>
    </tr>
  `).join("");

  // Edit / Delete
  table.querySelectorAll(".edit-btn").forEach(btn => {
    btn.onclick = () => window.location.href = "editor.html?id=" + btn.dataset.id;
  });
  table.querySelectorAll(".delete-btn").forEach(btn => {
    btn.onclick = async () => {
      if (confirm("Delete this post?")) {
        await remove(ref(db, "posts/" + btn.dataset.id));
      }
    };
  });
});