/* =========================================================
   navigation.js
   Handles: mobile hamburger menu, theme toggle, active nav link,
   contact form validation, footer year.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- Mobile navigation toggle ---------- */
  const navToggle = document.getElementById("navToggle");
  const primaryNav = document.getElementById("primaryNav");

  function closeNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  function openNav() {
    if (!primaryNav || !navToggle) return;
    primaryNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-open");
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeNav() : openNav();
    });

    // Close on link click (mobile)
    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 767px)").matches) closeNav();
      });
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    // Close on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeNav();
    });
  }

  /* ---------- Theme toggle (dark mode) ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const root = document.documentElement;
  const THEME_KEY = "portfolio-theme";

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "true");
        themeToggle.querySelector(".theme-icon").textContent = "☀️";
      }
    } else if (theme === "light") {
      root.setAttribute("data-theme", "light");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "false");
        themeToggle.querySelector(".theme-icon").textContent = "🌙";
      }
    } else {
      // system
      root.removeAttribute("data-theme");
      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", "false");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        themeToggle.querySelector(".theme-icon").textContent = prefersDark ? "☀️" : "🌙";
      }
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme || "system");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark =
        root.getAttribute("data-theme") === "dark" ||
        (!root.hasAttribute("data-theme") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      const next = isDark ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  /* ---------- Active nav link on scroll (IntersectionObserver) ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach((link) => {
              const isActive = link.getAttribute("href") === `#${id}`;
              link.setAttribute("aria-current", isActive ? "true" : "false");
              link.style.color = isActive ? "var(--color-primary)" : "";
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
  }

  /* ---------- Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const successMsg = document.getElementById("formSuccess");

  if (form) {
    const fields = {
      name: {
        el: form.name,
        error: document.getElementById("name-error"),
        validate: (v) => v.trim().length >= 2 || "Please enter at least 2 characters.",
      },
      email: {
        el: form.email,
        error: document.getElementById("email-error"),
        validate: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
      },
      message: {
        el: form.message,
        error: document.getElementById("message-error"),
        validate: (v) => v.trim().length >= 10 || "Message must be at least 10 characters.",
      },
    };

    function validateField(key) {
      const field = fields[key];
      const result = field.validate(field.el.value);
      if (result === true) {
        field.error.textContent = "";
        field.el.setAttribute("aria-invalid", "false");
        return true;
      }
      field.error.textContent = result;
      field.el.setAttribute("aria-invalid", "true");
      return false;
    }

    // Live validation on blur
    Object.keys(fields).forEach((key) => {
      fields[key].el.addEventListener("blur", () => validateField(key));
      fields[key].el.addEventListener("input", () => {
        if (fields[key].el.getAttribute("aria-invalid") === "true") validateField(key);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = Object.keys(fields).map(validateField).every(Boolean);

      if (!valid) {
        const firstInvalid = Object.values(fields).find(
          (f) => f.el.getAttribute("aria-invalid") === "true"
        );
        firstInvalid?.el.focus();
        return;
      }

      // Simulate submission (replace with real fetch)
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.textContent = "✅ Thanks! Your message has been sent.";
      }
      form.reset();
      Object.values(fields).forEach((f) => f.el.setAttribute("aria-invalid", "false"));
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();