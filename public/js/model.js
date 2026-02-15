const loginWrapper = document.getElementById("loginForm");
const signupWrapper = document.getElementById("signupForm");
const forgotWrapper = document.getElementById("forgotForm");

// Forms (Tags) - Used for submission
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const forgotPassForm = document.getElementById("forgotPassForm");

// UI Elements
const spinner = document.getElementById("spinner");
const errorMsg = document.getElementById("errorMsg");
const errorMsg1 = document.getElementById("errorMsg1");
// 2. VIEW SWITCHING LOGIC
function hideAll() {
  loginWrapper.classList.add("hidden-form");
  signupWrapper.classList.add("hidden-form");
  forgotWrapper.classList.add("hidden-form");
}

document.querySelectorAll(".switch-to-signup").forEach((btn) => {
  btn.addEventListener("click", () => {
    hideAll();
    signupWrapper.classList.remove("hidden-form");
  });
});

document.querySelectorAll(".switch-to-login").forEach((btn) => {
  btn.addEventListener("click", () => {
    hideAll();
    loginWrapper.classList.remove("hidden-form");
  });
});

document.querySelectorAll(".switch-to-forgot").forEach((btn) => {
  btn.addEventListener("click", () => {
    hideAll();
    forgotWrapper.classList.remove("hidden-form");
  });
});

// 3. PASSWORD VISIBILITY LOGIC
document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const passwordInput = document.getElementById(targetId);

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.classList.remove("fa-eye");
      this.classList.add("fa-eye-slash");
    } else {
      passwordInput.type = "password";
      this.classList.remove("fa-eye-slash");
      this.classList.add("fa-eye");
    }
  });
});

const formsToPrevent = [signInForm, signUpForm, forgotPassForm].filter(Boolean);

formsToPrevent.forEach((form) => {
  form.addEventListener("submit", (e) => e.preventDefault());
});
// LOGIN FORM SUBMISSION
if (signInForm) {
  signInForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (errorMsg) errorMsg.innerText = "";
    if (spinner) spinner.style.display = "block";

    const emailInput = signInForm.querySelector('input[type="email"]');
    const passwordInput = document.getElementById("loginPass");

    const data = {
      username: emailInput ? emailInput.value : "",
      password: passwordInput ? passwordInput.value : "",
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
        if (errorMsg) errorMsg.innerText = result.message;

        if (!errorMsg)
          alert("Login Failed: " + (result.message || "Unknown error"));
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      console.error(err);
      if (errorMsg) {
        errorMsg.innerText = "Server error. Please try again.";
      } else {
        alert("Server error. Please check console.");
      }
    } finally {
      if (spinner) spinner.style.display = "none";
    }
  });
}

// --- SIGN UP LOGIC ---

if (signUpForm) {
  signUpForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (errorMsg1) {
      errorMsg1.innerText = "";
      errorMsg1.style.color = "red";
    }

    const nameInput = signUpForm.querySelector('input[type="text"]');
    const emailInput = signUpForm.querySelector('input[type="email"]');
    const passInput = document.getElementById("signupPass");

    const formData = {
      username: nameInput.value,
      email: emailInput.value,
      password: passInput.value,
    };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 201) {
        alert(result.message || "User registered successfully!");

        signUpForm.reset();

        if (
          typeof hideAll === "function" &&
          typeof loginWrapper !== "undefined"
        ) {
          hideAll();
          loginWrapper.classList.remove("hidden-form");
        }
      } else {
        if (errorMsg1) {
          errorMsg1.innerText = result.message || "Registration failed";
        }
      }
    } catch (error) {
      console.error("Error:", error);

      if (errorMsg1) {
        errorMsg1.innerText = "Something went wrong. Please try again.";
      }
    }
  });
}

if (forgotPassForm) {
  forgotPassForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailInput = forgotPassForm.querySelector('input[type="email"]');
    const submitBtn = forgotPassForm.querySelector('button[type="submit"]');

    const originalBtnText = submitBtn ? submitBtn.innerText : "Reset Password";
    if (submitBtn) {
      submitBtn.innerText = "Sending...";
      submitBtn.disabled = true;
    }

    const formData = {
      email: emailInput ? emailInput.value : "",
    };

    try {
      const response = await fetch("/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok || result.success) {
        showToast(
          result.message ||
            "A password reset link has been sent to your email!",
          "success",
        );

        forgotPassForm.reset();

        if (
          typeof hideAll === "function" &&
          typeof loginWrapper !== "undefined"
        ) {
          hideAll();
          loginWrapper.classList.remove("hidden-form");
        }
      } else {
        showToast(result.message || "Failed to send reset email.", "error");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      showToast("Something went wrong. Please try again later.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
      }
    }
  });
}
//toast popup animation
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");

  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transform transition-all duration-300 opacity-0 translate-y-2";

  const typeClasses =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-gray-800";

  toast.className = `${baseClasses} ${typeClasses}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="ml-auto text-white/80 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("opacity-0", "translate-y-2");
  }, 10);

  const removeToast = () => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  };

  setTimeout(removeToast, 3000);

  toast.querySelector("button").addEventListener("click", removeToast);
}
