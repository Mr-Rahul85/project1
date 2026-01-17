const form = document.getElementById("uploadForm");
const progressContainer = document.querySelector(".progress-container");
const progressBar = document.getElementById("progressBar");
const toast = document.getElementById("toast");
const fileInput = document.getElementById("file");
const fileNameText = document.getElementById("fileName");
const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login";
}
let submitRoute = "/api/upload";
fileInput.addEventListener("change", function () {
  if (this.files.length > 0) {
    fileNameText.textContent = this.files[0].name;
  }
});

// Detect which button was clicked
document.querySelectorAll("button[type='submit']").forEach((button) => {
  button.addEventListener("click", function () {
    submitRoute = this.getAttribute("data-route");
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const xhr = new XMLHttpRequest();

  xhr.open("POST", submitRoute);
  xhr.setRequestHeader("Authorization", `Bearer ${token}`);
  // Show progress bar
  progressContainer.style.display = "block";

  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      const percent = (e.loaded / e.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = function () {
    progressBar.style.width = "100%";

    if (xhr.status >= 200 && xhr.status < 300) {
      let response = {};
      try {
        response = JSON.parse(xhr.responseText);
      } catch {
        showToast("Invalid server response ❌", true);
        return;
      }

      if (response.success) {
        showToast("File uploaded successfully 🎉");
        form.reset();
      } else {
        showToast(response.message || "Upload failed ❌", true);
      }
    } else {
      showToast("Upload failed ❌", true);
    }

    setTimeout(() => {
      progressContainer.style.display = "none";
      progressBar.style.width = "0%";
    }, 1000);
  };

  xhr.onerror = function () {
    showToast("Upload error ❌", true);
  };

  xhr.send(formData);
});

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.classList.remove("error");
  toast.classList.add("show");

  if (isError) toast.classList.add("error");

  setTimeout(() => {
    toast.classList.remove("show", "error");
  }, 3000);
}
