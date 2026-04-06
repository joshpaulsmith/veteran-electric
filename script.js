// PAGE LOADER
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
  setTimeout(() => {
    const loader = document.querySelector(".page-loader");
    if (loader) loader.style.display = "none";
  }, 450);
});

// MOBILE MENU
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".site-menu");

if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);
    if (!clickedInsideMenu && !clickedToggle) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

// PAGE TRANSITIONS
document.querySelectorAll("a").forEach(link => {
  if (link.hostname === window.location.hostname) {
    link.addEventListener("click", function (e) {
      if (this.getAttribute("href").startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(() => {
        window.location = this.href;
      }, 300);
    });
  }
});

// LAZY LOAD IMAGES
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          observer.disconnect();
        }
      });
    });

    io.observe(target);
  };

  lazyImages.forEach(lazyLoad);
});

// SCROLL ANIMATIONS
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.2,
  rootMargin: "0px 0px -40px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("appear");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});
