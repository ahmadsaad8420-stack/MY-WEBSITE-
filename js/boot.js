// Runs first (blocking, in <head>) so CSS can tell whether JavaScript is available.
document.documentElement.classList.add("js");
// Apply the saved theme before first paint, otherwise follow the visitor's system theme.
try {
  const t = localStorage.getItem("saad-theme");
  document.documentElement.dataset.theme = t === "light" || t === "dark"
    ? t
    : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
} catch {
  document.documentElement.dataset.theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
// Safety net: if anything in script.js fails, never leave the full-screen loader covering the page.
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => { document.body.classList.remove("is-loading"); document.getElementById("siteLoader")?.classList.add("is-hidden"); }, 4000);
});
