// MOTION PREFS
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// PAGE LOADER
window.addEventListener("load", () => {
  document.body.classList.add("loaded");

  const loader = document.querySelector(".page-loader");
  if (!loader) return;

  if (prefersReducedMotion) {
    loader.style.display = "none";
    return;
  }

  setTimeout(() => {
    loader.style.display = "none";
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
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    document.body.classList.toggle("menu-open", isOpen);
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

// HEADER SCROLLED STATE
const siteHeader = document.querySelector(".site-header, .topbar");

if (siteHeader) {
  const updateHeaderState = () => {
    if (window.scrollY > 16) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

// SMART PAGE TRANSITIONS
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    if (!href) return;
    if (href.startsWith("#")) return;
    if (this.hasAttribute("download")) return;
    if (this.target === "_blank") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (this.origin !== window.location.origin) return;
    if (href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;

    e.preventDefault();

    if (prefersReducedMotion) {
      window.location.href = this.href;
      return;
    }

    document.body.classList.add("page-leave");

    setTimeout(() => {
      window.location.href = this.href;
    }, 320);
  });
});

// LAZY LOAD IMAGES
document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;

      if (img.dataset.srcset) {
        img.srcset = img.dataset.srcset;
      }

      img.removeAttribute("data-src");
      img.removeAttribute("data-srcset");
      img.classList.add("is-loaded");
      observer.unobserve(img);
    });
  }, {
    rootMargin: "200px 0px"
  });

  lazyImages.forEach((img) => imageObserver.observe(img));
});

// SCROLL ANIMATIONS
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");

  if (!faders.length) return;

  if (prefersReducedMotion) {
    faders.forEach((item) => item.classList.add("visible"));
    return;
  }

  faders.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 40, 240)}ms`;
  });

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -60px 0px"
  });

  faders.forEach((fader) => appearOnScroll.observe(fader));
});

// SUBTLE PARALLAX FOR HERO / GALLERY IMAGES
if (!prefersReducedMotion && window.innerWidth > 991) {
  const parallaxItems = document.querySelectorAll(".page-intro, .utility-gallery img");

  const updateParallax = () => {
    const scrollY = window.scrollY;

    parallaxItems.forEach((item, index) => {
      const speed = item.matches("img") ? 0.03 : 0.015;
      const offset = scrollY * speed;
      item.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener("scroll", updateParallax, { passive: true });
}

// PREMIUM HOVER LIFT
if (!prefersReducedMotion) {
  const interactiveCards = document.querySelectorAll(".service-box, .feature-list > div, .contact-callout");

  interactiveCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });
}
