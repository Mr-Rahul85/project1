const loginForm = document.getElementById("loginForm");
  const spinner = document.getElementById("spinner");
  const errorMsg = document.getElementById("errorMsg");
function slideToRegister() {
  const slider = document.getElementById("sliderWrapper");
  slider.classList.add("slide-register");
}

function slideToLogin() {
  const slider = document.getElementById("sliderWrapper");
  slider.classList.remove("slide-register");
}
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault(); // 🔴 stop normal form submit

    errorMsg.innerText = "";
    spinner.style.display = "block";

    const data = {
      username: document.getElementById("loginUsername").value,
      password: document.getElementById("loginPassword").value,
    };

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        errorMsg.innerText = result.message; // ✅ show backend error
      } else {
        window.location.href = "/"; // ✅ success redirect
      }
    } catch (err) {
      errorMsg.innerText = "Server error. Please try again.";
    } finally {
      spinner.style.display = "none";
    }
  });



