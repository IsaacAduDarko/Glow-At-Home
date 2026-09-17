// Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  status.textContent = "Saving...";
  status.style.color = "#333";

  try {
    let imageUrl = coverInput.value.trim();

    if (coverFile.files[0]) {
      status.textContent = "Uploading cover...";
      imageUrl = await uploadToImgBB(coverFile.files[0]);
      coverInput.value = imageUrl;
    }

    if (!imageUrl) throw new Error("Please provide a cover image");

    const contentHTML = editor.innerHTML.trim();
    if (!contentHTML || contentHTML === "<p><br></p>") {
      throw new Error("Content cannot be empty");
    }

    const postData = {
      title: document.getElementById("post-title").value.trim(),
      category: document.getElementById("post-category").value,
      description: document.getElementById("post-description").value.trim(),
      content: contentHTML,
      image: imageUrl,
      featured: document.getElementById("post-featured").checked,
      author: currentUser.email,
      updatedAt: Date.now()
    };

    const id = document.getElementById("post-id").value;

    if (id) {
      // EDIT EXISTING
      await update(ref(db, "posts/" + id), postData);
      status.textContent = "Post updated ✅";
    } else {
      // ✅ CREATE NEW — clean top-level push
      postData.createdAt = Date.now();
      const newRef = push(ref(db, "posts"));
      await set(newRef, postData);
      status.textContent = "Post published ✅";
      console.log("✅ Saved post at:", newRef.key);
    }

    status.style.color = "green";
    setTimeout(() => window.location.href = "dashboard.html", 800);

  } catch (err) {
    status.textContent = "Error: " + err.message;
    status.style.color = "red";
  }
});
