import { db } from "./firebase.js";
import { ref, onValue }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

let allPosts = [];

function stripHTML(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || "";
}

function postCard(p) {
  return `
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
  `;
}

function render(id, list) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = list.length
    ? list.map(postCard).join("")
    : "<p class='empty-state'>No posts yet.</p>";
}

onValue(ref(db, "posts"), (snapshot) => {
  allPosts = [];
  snapshot.forEach(c => allPosts.push({ id: c.key, ...c.val() }));
  allPosts.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  render("featured-posts", allPosts.filter(p => p.featured).slice(0, 3));
  render("recent-posts", allPosts.slice(0, 6));
  render("decor-posts", allPosts.filter(p => p.category === "Home Decor Ideas").slice(0, 3));
  render("selfcare-posts", allPosts.filter(p => p.category === "Self-Care").slice(0, 3));
  render("lifestyle-posts", allPosts.filter(p => p.category === "Glow Up & Lifestyle Tips").slice(0, 3));
});

// ============ SEARCH ============
const searchDrawer = document.querySelector(".search-drawer");
const searchInput = searchDrawer?.querySelector("input");
const searchBtn = searchDrawer?.querySelector(".search-box button");

// Add live results container
if (searchDrawer) {
  const box = searchDrawer.querySelector(".search-box");
  const results = document.createElement("div");
  results.id = "search-results";
  results.className = "search-results";
  box.parentNode.insertBefore(results, box.nextSibling);
}

function runSearch() {
  const q = searchInput.value.trim().toLowerCase();
  const results = document.getElementById("search-results");
  if (!results) return;

  if (!q) {
    results.innerHTML = "";
    return;
  }

  const matches = allPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    (p.description || "").toLowerCase().includes(q) ||
    (p.category || "").toLowerCase().includes(q)
  );

  if (matches.length === 0) {
    results.innerHTML = "<p class='empty-state'>No results found.</p>";
    return;
  }

  results.innerHTML = matches.slice(0, 8).map(p => `
    <a href="post.html?id=${p.id}" class="search-result-item">
      <img src="${p.image}" alt="">
      <div>
        <strong>${p.title}</strong>
        <span>${p.category || ""}</span>
      </div>
    </a>
  `).join("");
}

if (searchInput) {
  searchInput.addEventListener("input", runSearch);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runSearch();
    }
  });
}
if (searchBtn) {
  searchBtn.onclick = (e) => { e.preventDefault(); runSearch(); };
}