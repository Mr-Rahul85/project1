const buttons = document.querySelectorAll(".tab-btn");
const tabs = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const fields = document.querySelectorAll("input, textarea");

editBtn?.addEventListener("click", () => {
  fields.forEach(f => f.disabled = false);
  saveBtn.disabled = false;
});
