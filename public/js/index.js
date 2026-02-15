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

// wishlist section
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".wishlist-heart").forEach((heart) => {
    heart.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const cardId = heart.dataset.id;
      if (!cardId) return;

  
      heart.style.pointerEvents = "none";

      try {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });

        if (res.status === 401) {
          alert("Please login to use wishlist ❤️");
          heart.style.pointerEvents = "auto";
          return; 
        }

        const data = await res.json();

        const allMatchingHearts = document.querySelectorAll(`.wishlist-heart[data-id="${cardId}"]`);

        allMatchingHearts.forEach(matchingHeart => {
          if (data.action === "added") {
            matchingHeart.classList.add("active");
          } 
          else if (data.action === "removed") {
            matchingHeart.classList.remove("active");

            
            const isProfileFavorites = matchingHeart.closest('#favorites');
            if (isProfileFavorites) {
              const cardElement = matchingHeart.closest('a.card');
              if (cardElement) cardElement.remove();
            }
          }
        });

        
        if (data.action === "removed") {
          const grid = document.querySelector('.favorites-grid');
          if (grid && grid.children.length === 0) {
            grid.parentElement.innerHTML = '<p>No favorite destinations yet.</p>';
          }
        }

      } catch (err) {
        console.error("Wishlist error:", err);
      } finally {
       
        heart.style.pointerEvents = "auto";
      }
    });
  });
});

// --- ABOUT PAGE ---
(function() {
    const hbBtn = document.getElementById("hbExploreBtn");

    if (hbBtn) {
        hbBtn.addEventListener("click", function() {
            alert("Welcome to HiddenBihar! Start your journey today 🌄");
        });
    }
})();

// --- FOOTER SECTION ---
document.querySelectorAll(".footer-title").forEach(title => {
  title.addEventListener("click", () => {
    if (window.innerWidth > 480) return; // Matches CSS media query
    title.parentElement.classList.toggle("active");
  });
});