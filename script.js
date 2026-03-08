// Theme handling (dark / light)
(function () {
  const root = document.documentElement;
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  const iconSpan = document.getElementById("theme-toggle-icon");

  const THEME_KEY = "tp-portfolio-theme";

  function setIcon(mode) {
    if (!iconSpan) return;
    if (mode === "dark") {
      iconSpan.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="21"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="3" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="21" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } else {
      iconSpan.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z"/></svg>';
    }
  }

  function applyTheme(mode) {
    if (mode === "dark") {
      root.classList.add("dark");
      body.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body.classList.remove("dark");
    }
    setIcon(mode);
  }

  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const current = root.classList.contains("dark") ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }
})();

// Mobile navigation toggle
(function () {
  const btn = document.getElementById("mobile-menu-toggle");
  const nav = document.getElementById("mobile-nav");
  if (!btn || !nav) return;

  const hamburger = btn.querySelector(".hamburger");

  btn.addEventListener("click", () => {
    const expanded = nav.style.maxHeight && nav.style.maxHeight !== "0px";
    if (expanded) {
      nav.style.maxHeight = "0px";
      hamburger && hamburger.classList.remove("hamburger-active");
    } else {
      nav.style.maxHeight = nav.scrollHeight + "px";
      hamburger && hamburger.classList.add("hamburger-active");
    }
  });

  // Close on link click
  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) {
      nav.style.maxHeight = "0px";
      hamburger && hamburger.classList.remove("hamburger-active");
    }
  });
})();

// Typing animation
(function () {
  const typingEl = document.getElementById("typing-text");
  if (!typingEl) return;

  const skills = [
    "UX / UI",
    "Java",
    "Spring Boot",
    "MySQL",
    "MongoDB",
    "JavaScript",
    "Tailwind CSS",
    "Microservices",
    "Spring MVC",
    "HTML",
    "CSS",
    "Docker",
    "Postman",
    "GitHub",
    "Git",
  ];

  let index = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = skills[index];
    const speed = isDeleting ? 60 : 110;

    if (isDeleting) {
      charIndex--;
      typingEl.textContent = current.substring(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        index = (index + 1) % skills.length;
      }
    } else {
      charIndex++;
      typingEl.textContent = current.substring(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 900);
        return;
      }
    }

    setTimeout(type, speed);
  }

  type();
})();

// Scroll-triggered animations
(function () {
  const animated = Array.from(document.querySelectorAll(".animate-on-scroll"));

  if (!("IntersectionObserver" in window)) {
    animated.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.classList.add("in-view");
          observer.unobserve(el);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  animated.forEach((el) => observer.observe(el));
})();

// Project carousels (horizontal scroll with arrows)
(function () {
  const carousels = document.querySelectorAll("[data-carousel]");
  if (!carousels.length) return;

  function scrollCarousel(id, direction) {
    const carousel = document.querySelector(
      '[data-carousel="' + id + '"]'
    );
    if (!carousel) return;

    const scrollAmount = carousel.clientWidth * 0.8;
    const delta = direction === "next" ? scrollAmount : -scrollAmount;
    carousel.scrollBy({ left: delta, behavior: "smooth" });
  }

  document.querySelectorAll("[data-carousel-control]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-carousel-control");
      const dir = btn.getAttribute("data-direction") || "next";
      if (!id) return;
      scrollCarousel(id, dir);
    });
  });
})();

// Smooth scroll fix for header offset (only for browsers without CSS scroll-margin-top support)
(function () {
  const header = document.querySelector("header");
  const links = document.querySelectorAll('a[href^="#"]:not([href="#"])');
  if (!header || !links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.getBoundingClientRect().height;
      const rect = target.getBoundingClientRect();
      const offset = rect.top + window.scrollY - headerHeight - 8;

      window.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    });
  });
})();

// Footer year
(function () {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear().toString();
})();

