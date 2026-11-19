"use strict";
// Small script for the sub-pages (About, Contact, legal pages, 404). Same theme and menu behaviour as the home page.
(() => {
  const qs = s => document.querySelector(s);
  const toggle = qs("#themeToggle"), menuBtn = qs("#menuToggle"), menu = qs("#primaryMenu");
  let themeWasChosen = false;

  function setTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    const light = theme === "light";
    if (toggle) {
      toggle.innerHTML = light ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>' : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
      const label = light ? "Switch to dark mode" : "Switch to light mode";
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
    qs("#themeColorMeta")?.setAttribute("content", light ? "#F7FAFF" : "#141414");
    if (persist) {
      themeWasChosen = true;
      try { localStorage.setItem("saad-theme", theme); } catch { /* still works for this visit */ }
    }
  }

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem("saad-theme");
    themeWasChosen = savedTheme === "light" || savedTheme === "dark";
  } catch { /* follow the already-applied system preference */ }
  setTheme(themeWasChosen ? savedTheme : document.documentElement.dataset.theme, false);
  toggle?.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light", true));
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  systemTheme.addEventListener?.("change", event => {
    if (!themeWasChosen) setTheme(event.matches ? "dark" : "light", false);
  });

  function setMenu(open) {
    menuBtn.classList.toggle("open", open);
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
    document.body.classList.toggle("menu-open", open);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
    menu.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
  }

  // Contact buttons (same details as the home page; written by JS, not hard-coded in the HTML).
  const email = ["ahmad.saad.8420", "gmail.com"].join("@");
  const phone = ["+880", "1622792592"].join("");
  const targets = {
    email: `mailto:${email}`,
    phone: `tel:${phone}`,
    whatsapp: `https://wa.me/${phone.replace(/\D/g, "")}`,
    telegram: "https://t.me/saadahmad9k",
    messenger: "https://m.me/s4admp4"
  };
  document.querySelectorAll("[data-contact]").forEach(el => {
    const href = targets[el.dataset.contact];
    if (!href) return;
    el.setAttribute("href", href);
    if (href.startsWith("https:")) { el.setAttribute("target", "_blank"); el.setAttribute("rel", "noopener noreferrer"); }
  });

  const year = qs("#currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Install the same PWA shell even when a visitor lands on an inner page first.
})();
