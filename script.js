// MOTION PREFS
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// COMMON ELEMENTS
const body = document.body;
const loader = document.querySelector(".page-loader");
const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".site-menu");
const siteHeader = document.querySelector(".site-header");

window.addEventListener("load", () => {
  body.classList.add("loaded");

  if (!loader) return;
  loader.style.display = "none";
});

// FIX BACK/FORWARD CACHE ISSUES
window.addEventListener("pageshow", (event) => {
  body.classList.remove("page-leave");
  body.classList.remove("menu-open");
  body.classList.add("loaded");

  if (menu) {
    menu.classList.remove("open");
  }

  if (toggle) {
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (loader) {
    loader.style.display = "none";
  }

  // If restored from bfcache, force visible state cleanup
  if (event.persisted) {
    requestAnimationFrame(() => {
      body.classList.remove("page-leave");
    });
  }
});

// MOBILE MENU
if (toggle && menu) {
  const closeMenu = () => {
    menu.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  const openMenu = () => {
    menu.classList.add("open");
    toggle.classList.add("open");
    toggle.setAttribute("aria-expanded", "true");
    body.classList.add("menu-open");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.contains("open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = toggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

// HEADER SCROLLED STATE
if (siteHeader) {
  const updateHeaderState = () => {
    if (window.scrollY > 8) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

// CLOSE MENU WHEN NAVIGATING
document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function () {
    if (menu && toggle) {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      body.classList.remove("menu-open");
    }
  });
});

// SIMPLE LAZY IMAGE HANDLER
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
    item.style.transitionDelay = `${Math.min(index * 40, 200)}ms`;
  });

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  faders.forEach((fader) => appearOnScroll.observe(fader));
});

// HOVER LIFT
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
