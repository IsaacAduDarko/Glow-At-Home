import { db } from "./firebase.js";
import { ref, get, onValue }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  document.getElementById("post-title").textContent = "Post not found";
  throw new Error("No post ID");
}

get(ref(db, "posts/" + id)).then((snap) => {
  if (!snap.exists()) {
    document.getElementById("post-title").textContent = "Post not found";
    return;
  }
  const p = snap.val();

  document.title = p.title + " | Glow At Home";

  // Meta for sharing
  const pageUrl = window.location.href;
  const shareText = encodeURIComponent(p.title + " — Glow At Home");

  document.getElementById("post-title").textContent = p.title;
  document.getElementById("post-cover").src = p.image;
  document.getElementById("post-category").textContent = p.category;
  document.getElementById("post-date").textContent =
    new Date(p.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric"
    });
  document.getElementById("post-description").textContent = p.description || "";
  document.getElementById("post-content").innerHTML = p.content || "";

  // Update meta tags
  document.querySelector('meta[property="og:title"]')?.setAttribute("content", p.title);
  document.querySelector('meta[property="og:description"]')?.setAttribute("content", p.description || "");
  document.querySelector('meta[property="og:image"]')?.setAttribute("content", p.image);
  document.querySelector('meta[property="og:url"]')?.setAttribute("content", pageUrl);
  document.querySelector('meta[name="twitter:card"]')?.setAttribute("content", "summary_large_image");
  document.querySelector('meta[name="twitter:image"]')?.setAttribute("content", p.image);

  // ============ SHARE BUTTONS ============
  const shareWrap = document.getElementById("share-buttons");
  if (shareWrap) {
    shareWrap.innerHTML = `
      <span class="share-label">Share:</span>
      <a class="share-btn whatsapp" target="_blank"
         href="https://wa.me/?text=${shareText}%20${encodeURIComponent(pageUrl)}">
        <i class="fa-brands fa-whatsapp"></i>
      </a>
      <a class="share-btn facebook" target="_blank"
         href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}">
        <i class="fa-brands fa-facebook-f"></i>
      </a>
      <a class="share-btn twitter" target="_blank"
         href="https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(pageUrl)}">
        <i class="fa-brands fa-x-twitter"></i>
      </a>
      <a class="share-btn pinterest" target="_blank"
         href="https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(p.image)}&description=${shareText}">
        <i class="fa-brands fa-pinterest-p"></i>
      </a>
      <button class="share-btn copy" id="copy-link" title="Copy link">
        <i class="fa-solid fa-link"></i>
      </button>
    `;

    document.getElementById("copy-link").onclick = async () => {
      await navigator.clipboard.writeText(pageUrl);
      const b = document.getElementById("copy-link");
      b.innerHTML = '<i class="fa-solid fa-check"></i>';
      setTimeout(() => b.innerHTML = '<i class="fa-solid fa-link"></i>', 1500);
    };

    // Native share if available
    if (navigator.share) {
      const nativeBtn = document.createElement("button");
      nativeBtn.className = "share-btn native";
      nativeBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i>';
      nativeBtn.onclick = () => navigator.share({
        title: p.title,
        text: p.description,
        url: pageUrl
      });
      shareWrap.appendChild(nativeBtn);
    }
  }

  // ============ RELATED POSTS ============
  onValue(ref(db, "posts"), (snapshot) => {
    const related = [];
    snapshot.forEach(c => {
      const v = c.val();
      if (c.key !== id && v.category === p.category) {
        related.push({ id: c.key, ...v });
      }
    });

    const relEl = document.getElementById("related-posts");
    if (!relEl) return;

    if (related.length === 0) {
      relEl.innerHTML = "<p class='empty-state'>No related posts.</p>";
      return;
    }

    relEl.innerHTML = related.slice(0, 3).map(r => `
      <article class="post-card">
        <a href="post.html?id=${r.id}" class="post-card-link">
          <div class="post-thumb">
            <img src="${r.image}" alt="${r.title}" loading="lazy">
            <span class="post-cat-badge">${r.category || ""}</span>
          </div>
          <div class="post-card-body">
            <h3>${r.title}</h3>
            <p>${r.description || ""}</p>
            <span class="read-more">Read More <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </a>
      </article>
    `).join("");
  });
});