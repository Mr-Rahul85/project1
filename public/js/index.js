const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});
//for wishlist section
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".wishlist-heart").forEach((heart) => {
    heart.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      console.log("❤️ Heart clicked"); // DEBUG

      const cardId = heart.dataset.id;
      console.log("Card ID:", cardId); // DEBUG
      if (!cardId) return;

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });

        if (res.status === 401) {
          alert("Please login to use wishlist ❤️");
          return; // ❌ NO UI CHANGE
        }

        const data = await res.json();

        if (data.action === "added") {
          heart.classList.add("active"); // ❤️ only when stored
        }

        if (data.action === "removed") {
          heart.classList.remove("active");
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
});
//about page
(function() {
    const hbBtn = document.getElementById("hbExploreBtn");

    if (hbBtn) {
        hbBtn.addEventListener("click", function() {
            alert("Welcome to HiddenBihar! Start your journey today 🌄");
        });
    }
})();
//footer section
document.querySelectorAll(".footer-title").forEach(title => {
  title.addEventListener("click", () => {
    if (window.innerWidth > 480) return; // ✅ MATCH CSS
    title.parentElement.classList.toggle("active");
  });
});
