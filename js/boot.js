// Runs first (blocking, in <head>) so CSS can tell whether JavaScript is available.
document.documentElement.classList.add("js");
// Apply the saved (or system) theme before first paint, on every page.
try {
  const t = localStorage.getItem("saad-theme");
  document.documentElement.dataset.theme = t === "light" || t === "dark" ? t : (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
} catch { /* default dark theme */ }
