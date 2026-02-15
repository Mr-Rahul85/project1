const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const form = document.getElementById("profileForm");

editBtn.addEventListener("click", () => {
  const inputs = form.querySelectorAll("input, textarea");

  inputs.forEach((el) => (el.disabled = false));
  saveBtn.disabled = false;
});

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get("update") === "success") {
    showUpdateToast();
  }

  window.history.replaceState(null, "", window.location.pathname);
});

function showUpdateToast() {
  const toast = document.createElement("div");

  toast.innerHTML = `
    <div style="
      position: fixed;
      top: 80px;
      right: 20px;
      background-color: #3B82F6;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: sans-serif;
      z-index: 9999;
      transform: translateX(120%);
      transition: transform 0.5s ease;
    ">
      <h4 style="margin:0;">Profile updated successfully 🎉</h4>
    </div>
  `;

  document.body.appendChild(toast);
  const el = toast.firstElementChild;

  setTimeout(() => (el.style.transform = "translateX(0)"), 100);

  setTimeout(() => {
    el.style.transform = "translateX(120%)";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}
