import { db, auth } from "./firebase.js";
import { ref, push, set, get, update }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const IMGBB_API_KEY = "2d4b8d83cfbc97c237f45fe4bfa35dd0";

const form = document.getElementById("post-form");
const status = document.getElementById("editor-status");
const coverFile = document.getElementById("post-cover-file");
const coverInput = document.getElementById("post-cover");
const coverPreview = document.getElementById("cover-preview");
const editor = document.getElementById("post-content");

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    currentUser = user;
    console.log("✅ Editor ready. Logged in as:", user.email);
  }
});

// ============ ImgBB upload (reusable) ============
async function uploadToImgBB(file) {
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const fd = new FormData();
  fd.append("image", base64);
  fd.append("name", file.name);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: fd
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error?.message || "Upload failed");
  return data.data.url;
}

// ============ Cover preview ============
coverFile.addEventListener("change", () => {
  const file = coverFile.files[0];
  if (file) {
    coverPreview.src = URL.createObjectURL(file);
    coverPreview.style.display = "block";
  }
});
coverInput.addEventListener("input", () => {
  if (coverInput.value) {
    coverPreview.src = coverInput.value;
    coverPreview.style.display = "block";
  }
});

// ============ Editor toolbar ============
document.querySelectorAll(".editor-toolbar button[data-cmd]").forEach(btn => {
  btn.onclick = (e) => {
    e.preventDefault();
    editor.focus();
    const cmd = btn.dataset.cmd;
    const val = btn.dataset.value || null;
    document.execCommand(cmd, false, val);
  };
});

// ============ Insert link ============
document.getElementById("btn-link").onclick = (e) => {
  e.preventDefault();
  const url = prompt("Enter link URL (include https://):");
  if (!url) return;
  editor.focus();
  document.execCommand("createLink", false, url);
};

// ============ Insert image inline ============
const hiddenInput = document.getElementById("hidden-image-input");
document.getElementById("btn-image").onclick = (e) => {
  e.preventDefault();
  hiddenInput.click();
};

hiddenInput.addEventListener("change", async () => {
  const file = hiddenInput.files[0];
  if (!file) return;

  const oldText = status.textContent;
  status.style.color = "#b98263";
  status.textContent = "Uploading inline image...";

  try {
    const url = await uploadToImgBB(file);
    editor.focus();
    document.execCommand(
      "insertHTML",
      false,
      `<img src="${url}" alt="inline image" style="width:100%;border-radius:16px;margin:20px 0;">`
    );
    status.textContent = "Image inserted ✅";
    status.style.color = "green";
  } catch (err) {
    status.textContent = "Image failed: " + err.message;
    status.style.color = "red";
  }

  hiddenInput.value = "";
  setTimeout(() => status.textContent = oldText, 2000);
});

// ============ Load post if editing ============
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

if (editId) {
  document.getElementById("editor-title").textContent = "Edit Post";
  document.getElementById("save-btn").textContent = "Update Post";

  get(ref(db, "posts/" + editId)).then((snap) => {
    if (!snap.exists()) return;
    const p = snap.val();
    document.getElementById("post-id").value = editId;
    document.getElementById("post-title").value = p.title || "";
    document.getElementById("post-category").value = p.category || "";
    document.getElementById("post-description").value = p.description || "";
    document.getElementById("post-cover").value = p.image || "";
    editor.innerHTML = p.content || "<p></p>";
    document.getElementById("post-featured").checked = !!p.featured;
    if (p.image) {
      coverPreview.src = p.image;
      coverPreview.style.display = "block";
    }
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    status.textContent = "Not logged in. Please log in again.";
    status.style.color = "red";
    setTimeout(() => window.location.href = "login.html", 1000);
    return;
  }

  status.textContent = "Saving...";
  status.style.color = "#333";

  try {
    // ... rest of your existing submit code
  } catch (err) {
    console.error("Submit error:", err);
    status.textContent = "Error: " + (err.message || err);
    status.style.color = "red";
  }
});
