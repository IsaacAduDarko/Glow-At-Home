import { db } from "./firebase.js";
import { ref, onValue }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const title = document.getElementById("category-title");
const container = document.getElementById("category-post-container");

const params = new URLSearchParams(window.location.search);
const category = params.get("category");

if (category) title.textContent = category;

onValue(ref(db, "posts"), (snapshot) => {
  const posts = [];
  snapshot.forEach(c => posts.push({ id: c.key, ...c.val() }));

  const filtered = category
    ? posts.filter(p => p.category === category)
    : posts;

  filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  if (filtered.length === 0) {
    container.innerHTML = "<p class='empty-state'>No posts in this category yet.</p>";
    return;
  }

  container.innerHTML = filtered.map(p => `
    <article class="post-card">
      <a href="post.html?id=${p.id}" class="post-card-link">
        <div class="post-thumb">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <span class="post-cat-badge">${p.category || ""}</span>
        </div>
        <div class="post-card-body">
          <h3>${p.title}</h3>
          <p>${p.description || ""}</p>
          <span class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>
    </article>
  `).join("");
});