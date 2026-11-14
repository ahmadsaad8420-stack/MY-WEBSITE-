"use strict";

// ===============================
// PERSONAL INFORMATION
// Edit the values below
// ===============================
const siteData = {
  name: "Saad Sheikh",
  email: ["ahmad.saad.8420", "gmail.com"].join("@"),
  phone: ["+880", "1622792592"].join(""),
  location: "Faridpur, Bangladesh",
  facebook: "https://www.facebook.com/share/19E8xjMpwa/",
  // Messages are received by Netlify Forms (form name: "contact").
  // If this is set to "" the form opens the visitor's email app instead.
  formEndpoint: "/",
  telegram: "https://t.me/saadahmad9k",
  github: "https://github.com/ahmadsaad8420-stack"
};

// ===============================
// PROJECT DATA
// Replace # with real URLs only when they actually exist.
// ===============================
// Add real contact details here when ready. Keep blank until verified; no contact links are fabricated.



const esc = t => String(t ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const safeUrl = u => (/^https?:\/\//i.test(String(u)) ? esc(u) : "#");

const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const loader = qs("#loader");
const siteHeader = qs("#siteHeader");
const scrollProgress = qs("#scrollProgress");
const backToTop = qs("#backToTop");
const themeToggle = qs("#themeToggle");
const menuToggle = qs("#menuToggle");
const navShell = qs("#primaryMenu");
const typingText = qs("#typingText");
const projectGrid = qs("#projectGrid");
const projectModal = qs("#projectModal");
const modalClose = qs("#modalClose");
const modalTitle = qs("#modalTitle");
const modalDescription = qs("#modalDescription");
const modalTech = qs("#modalTech");
const modalFeatures = qs("#modalFeatures");
const modalVisual = qs("#modalVisual");
const modalDemo = qs("#modalDemo");
const modalGithub = qs("#modalGithub");
const copyEmailButton = qs("#copyEmail");
const contactForm = qs("#contactForm");

let lastFocusedElement = null;
let typingTimer = null;

// focus() silently does nothing while an element is still visibility:hidden (CSS transition),
// so retry on the next frame. Keeps keyboard/screen-reader focus inside dialogs and menus.
function focusSoon(el) {
  if (!el) return;
  el.focus();
  if (document.activeElement !== el) requestAnimationFrame(() => el.focus());
}

function initTheme() {
  // Storage can be unavailable in strict/private browsing contexts; the site should still work.
  let savedTheme = null;
  try { savedTheme = localStorage.getItem("saad-theme"); } catch { /* use system preference */ }
  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : preferredTheme;
  setTheme(theme);
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isLight = theme === "light";
  themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-moon" aria-hidden="true"></i>' : '<i class="fa-solid fa-sun" aria-hidden="true"></i>';
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
  themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
  qs("#themeColorMeta")?.setAttribute("content", isLight ? "#F7F7F5" : "#080B14");
  try { localStorage.setItem("saad-theme", theme); } catch { /* theme still works for this visit */ }
}

themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
});

function updateScrollUI() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;
  siteHeader.classList.toggle("scrolled", scrollTop > 30);
  backToTop.classList.toggle("visible", scrollTop > 600);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

function closeMenu() {
  menuToggle.classList.remove("open");
  navShell.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const open = !navShell.classList.contains("open");
  menuToggle.classList.toggle("open", open);
  navShell.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("menu-open", open);
  if (open) focusSoon(qs(".nav-link", navShell));
});

qsa(".nav-link").forEach(link => link.addEventListener("click", closeMenu));

function setupActiveNavigation() {
  const sections = qsa("main section[id]");
  const navLinks = qsa(".nav-link");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  sections.forEach(section => observer.observe(section));
}

function setupReveal() {
  const items = qsa(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(item => item.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(item => observer.observe(item));
}

function createMockVisual(type) {
  if (type === "calculator") {
    return `<div class="project-visual" aria-hidden="true"><div class="mock-calculator"><div class="mock-display">12 + 08</div><div class="mock-buttons">${["7","8","9","÷","4","5","6","×","1","2","3","−","0",".","=","+"] .map(x => `<span>${x}</span>`).join("")}</div></div></div>`;
  }
  if (type === "list") {
    return `<div class="project-visual" aria-hidden="true"><div class="mock-list"><span></span><span></span><span></span><span></span><span></span></div></div>`;
  }
  if (type === "chart") {
    const heights = [35, 60, 45, 82, 52, 72, 91, 57];
    return `<div class="project-visual" aria-hidden="true"><div class="mock-chart">${heights.map(h => `<span data-h="${h}"></span>`).join("")}</div></div>`;
  }
  if (type === "weather") {
    return `<div class="project-visual" aria-hidden="true"><div class="mock-weather"><span>FARIDPUR · TODAY</span><strong>28°</strong><span>Clear learning skies</span></div></div>`;
  }
  if (type === "game") {
    return `<div class="project-visual" aria-hidden="true"><div class="mock-game"></div></div>`;
  }
  return `<div class="project-visual" aria-hidden="true"><div class="mock-browser"><div class="mock-bar"><i></i><i></i><i></i></div><div class="mock-content"><div class="mock-line"></div><div class="mock-line short"></div><div class="mock-grid"><span></span><span></span><span></span></div><div class="mock-grid"><span></span><span></span><span></span></div></div></div></div>`;
}

// CSP-friendly: set CSS variables through the CSSOM instead of style="" attributes.
function applyChartHeights(root) {
  qsa(".mock-chart span[data-h]", root).forEach(bar => bar.style.setProperty("--h", `${Number(bar.dataset.h) || 0}%`));
}

function projectCard(project, index) {
  const categories = esc(project.category.join(" "));
  const tech = project.technologies.map(item => `<span>${esc(item)}</span>`).join("");
  return `<article class="project-card reveal" data-categories="${categories}" data-index="${index}">
    ${createMockVisual(project.visual)}
    <div class="project-body">
      <div class="project-top"><span class="project-badge">DEMO PROJECT</span><span class="project-category">${esc(project.category[0])}</span></div>
      <h3>${esc(project.title)}</h3>
      <p>${esc(project.description)}</p>
      <div class="tech-list">${tech}</div>
      <div class="project-actions">
        ${project.github && project.github !== "#" ? `<a href="${safeUrl(project.github)}" target="_blank" aria-label="GitHub for ${esc(project.title)}" rel="noopener noreferrer"><i class="fa-brands fa-github" aria-hidden="true"></i> GitHub</a>` : ""}
        ${project.demo && project.demo !== "#" ? `<a href="${safeUrl(project.demo)}" target="_blank" aria-label="Live demo for ${esc(project.title)}" rel="noopener noreferrer"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> Live</a>` : ""}
        <button type="button" data-project-details="${index}" aria-label="View details for ${esc(project.title)}"><i class="fa-regular fa-eye" aria-hidden="true"></i> Details</button>
      </div>
    </div>
  </article>`;
}

function renderProjects(filter = "all") {
  const filtered = projects.filter(project => filter === "all" || project.category.includes(filter));
  projectGrid.innerHTML = filtered.map((project) => projectCard(project, projects.indexOf(project))).join("");
  applyChartHeights(projectGrid);
  qsa(".project-card", projectGrid).forEach(card => card.classList.add("revealed"));
  qsa("[data-project-details]", projectGrid).forEach(button => button.addEventListener("click", () => openProjectModal(Number(button.dataset.projectDetails))));
}

let statusTimeout;
function showTemporaryStatus(message) {
  clearTimeout(statusTimeout);
  let status = qs("#projectStatus");
  if (!status) {
    status = document.createElement("div");
    status.id = "projectStatus";
    status.className = "toast";
    status.setAttribute("role", "status");
    document.body.appendChild(status);
  }
  status.textContent = message;
  statusTimeout = setTimeout(() => status.remove(), 3000);
}

function setBackgroundInert(on) {
  qsa("#main-content, .site-header, .footer, .floating-contact, .back-to-top").forEach(el => { if (on) el.setAttribute("inert", ""); else el.removeAttribute("inert"); });
}

function openProjectModal(index) {
  const project = projects[index];
  if (!project) return;
  lastFocusedElement = document.activeElement;
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description;
  modalTech.innerHTML = project.technologies.map(item => `<span>${esc(item)}</span>`).join("");
  modalFeatures.innerHTML = project.features.map(item => `<div><i class="fa-solid fa-check" aria-hidden="true"></i>${esc(item)}</div>`).join("");
  modalVisual.innerHTML = createMockVisual(project.visual);
  applyChartHeights(modalVisual);
  [[modalDemo, project.demo], [modalGithub, project.github]].forEach(([link, url]) => {
    const real = Boolean(url) && url !== "#";
    link.hidden = !real;
    link.style.display = real ? "" : "none";
    if (real) { link.href = /^https?:\/\//i.test(url) ? url : "#"; link.target = "_blank"; link.rel = "noopener noreferrer"; }
  });
  setBackgroundInert(true);
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
  focusSoon(modalClose);
}

function closeProjectModal() {
  setBackgroundInert(false);
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
  lastFocusedElement?.focus?.();
}

modalClose.addEventListener("click", closeProjectModal);
qsa("[data-modal-close]").forEach(item => item.addEventListener("click", closeProjectModal));

function trapModalFocus(event) {
  if (!projectModal.classList.contains("open") || event.key !== "Tab") return;
  const focusables = qsa("button, a[href], input, textarea", projectModal).filter(el => !el.disabled && el.offsetParent !== null);
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (projectModal.classList.contains("open")) closeProjectModal();
    else if (navShell.classList.contains("open")) closeMenu();
  }
  trapModalFocus(event);
});

qsa(".filter-button").forEach(button => button.addEventListener("click", () => {
  qsa(".filter-button").forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  renderProjects(button.dataset.filter);
}));

async function copyEmail() {
  const email = siteData.email;
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(email);
    else throw new Error("Clipboard API unavailable");
    showCopyFeedback();
  } catch {
    const helper = document.createElement("textarea");
    helper.value = email;
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    try { document.execCommand("copy"); showCopyFeedback(); }
    catch { showTemporaryStatus(`Copy failed. Email: ${email}`); }
    helper.remove();
  }
}

function showCopyFeedback() {
  const original = copyEmailButton.innerHTML;
  copyEmailButton.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
  copyEmailButton.setAttribute("aria-label", "Email copied");
  showTemporaryStatus("Email copied!");
  setTimeout(() => { copyEmailButton.innerHTML = original; copyEmailButton.setAttribute("aria-label", "Copy email address"); }, 1600);
}

copyEmailButton.addEventListener("click", copyEmail);

function validateField(input, errorElement, message) {
  const value = input.value.trim();
  let error = "";
  if (!value) error = "This field is required.";
  else if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Enter a valid email address.";
  else if (input.minLength > 0 && value.length < input.minLength) error = `Please enter at least ${input.minLength} characters.`;
  input.closest(".form-field")?.classList.toggle("invalid", Boolean(error));
  errorElement.textContent = error || message || "";
  return !error;
}

const formOpenedAt = Date.now();
let lastSubmitAt = 0;

function setFormStatus(el, message, kind) {
  el.textContent = message;
  el.classList.toggle("is-error", kind === "error");
  el.classList.toggle("is-ok", kind === "ok");
  el.setAttribute("role", kind === "error" ? "alert" : "status");
}

contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const validName = validateField(qs("#name"), qs("#nameError"));
  const validEmail = validateField(qs("#email"), qs("#emailError"));
  const validSubject = validateField(qs("#subject"), qs("#subjectError"));
  const validMessage = validateField(qs("#message"), qs("#messageError"));
  const formStatus = qs("#formStatus");
  if (validName && validEmail && validSubject && validMessage) {
    const senderName = qs("#name").value.trim();
    const senderEmail = qs("#email").value.trim();
    const subject = qs("#subject").value.trim();
    const message = qs("#message").value.trim();
    const submitButton = qs("button[type=submit]", contactForm);
    if (siteData.formEndpoint) {
      // Spam traps: filled honeypot, or a form "filled" in under 3 seconds (bots).
      if (qs("#gotcha")?.value) { contactForm.reset(); setFormStatus(formStatus, "Thank you! Your message has been sent.", "ok"); return; }
      // Too fast to be a person: ask to retry instead of silently dropping a real message.
      if (Date.now() - formOpenedAt < 3000) { setFormStatus(formStatus, "Please wait a moment and press Send again.", "error"); return; }
      // Simple client-side cooldown against double/rapid submits.
      if (Date.now() - lastSubmitAt < 30000) { setFormStatus(formStatus, "Please wait a few seconds before sending another message.", "error"); return; }
      lastSubmitAt = Date.now();
      setFormStatus(formStatus, "Sending your message...", "");
      submitButton.disabled = true;
      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 12000);
      fetch(siteData.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ "form-name": "contact", name: senderName, email: senderEmail, subject, message, "bot-field": "" }).toString(),
        signal: controller.signal
      })
        .then(response => {
          if (!response.ok) throw new Error("Send failed");
          contactForm.reset();
          setFormStatus(formStatus, "Thank you! Your message has been sent. I will reply soon.", "ok");
        })
        .catch(() => {
          lastSubmitAt = 0;
          setFormStatus(formStatus, "Sorry, the message could not be sent. Please try again, or use the email link above.", "error");
        })
        .finally(() => { clearTimeout(abortTimer); submitButton.disabled = false; });
    } else {
      const body = `From: ${senderName}\nReply email: ${senderEmail}\n\n${message}`;
      setFormStatus(formStatus, "Your email app should open with your message prepared. Please send it there to complete delivery.", "ok");
      window.location.href = `mailto:${siteData.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  } else {
    setFormStatus(formStatus, "Please correct the highlighted fields and try again.", "error");
  }
});

qsa("#contactForm input, #contactForm textarea").forEach(input => {
  input.addEventListener("blur", () => {
    const error = qs(`#${input.id}Error`);
    if (error) validateField(input, error);
  });
});

function setupTyping() {
  const phrases = ["Creative Learner", "Web Enthusiast", "Future Developer", "Digital Creator"];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    typingText.textContent = phrases[0];
    return;
  }
  const tick = () => {
    const phrase = phrases[phraseIndex];
    let delay;
    if (!deleting) {
      charIndex++;
      typingText.textContent = phrase.slice(0, charIndex);
      delay = 85;
      if (charIndex === phrase.length) { deleting = true; delay = 1250; }
    } else {
      charIndex--;
      typingText.textContent = phrase.slice(0, charIndex);
      delay = 45;
      if (charIndex === 0) { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = 300; }
    }
    typingTimer = setTimeout(tick, delay);
  };
  tick();
}

function setupMagneticButtons() {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!supportsHover || reduced) return;
  qsa(".magnetic").forEach(button => {
    button.addEventListener("pointermove", event => {
      const rect = button.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 8;
      button.style.transform = `translate(${x}px, ${y}px)`;
    });
    button.addEventListener("pointerleave", () => { button.style.transform = ""; });
  });
}

function setCurrentYear() {
  qs("#currentYear").textContent = new Date().getFullYear();
}

function setupImageFallbacks() {
  qsa("img").forEach(img => {
    img.addEventListener("error", () => {
      img.alt = `${siteData.name} profile image unavailable`;
    });
  });
}

// Hide the loader on load, but never let it block the page for more than 1.8s
// (slow font/CDN, blocked requests, etc.).
const hideLoader = () => loader.classList.add("is-hidden");
window.addEventListener("load", () => setTimeout(hideLoader, 120));
setTimeout(hideLoader, 1800);

// Contact details are written by JS (not hard-coded in the HTML) so simple
// scrapers that only read raw HTML do not harvest the email/phone.
function fillContactDetails() {
  const phoneDigits = siteData.phone.replace(/\D/g, "");
  const targets = {
    email: { href: `mailto:${siteData.email}`, text: siteData.email },
    phone: { href: `tel:${siteData.phone}`, text: siteData.phone },
    whatsapp: { href: `https://wa.me/${phoneDigits}`, text: siteData.phone },
    telegram: { href: siteData.telegram, text: "@" + siteData.telegram.split("/").pop() },
    facebook: { href: siteData.facebook, text: "" },
    github: { href: siteData.github, text: "" }
  };
  qsa("[data-contact]").forEach(el => {
    const t = targets[el.dataset.contact];
    if (!t) return;
    el.setAttribute("href", t.href);
    if (el.hasAttribute("data-fill-text")) el.textContent = t.text;
  });
  qsa("[data-contact-text]").forEach(el => {
    const t = targets[el.dataset.contactText];
    if (t) el.textContent = t.text;
  });
}

initTheme();
fillContactDetails();
updateScrollUI();
setupActiveNavigation();
setupReveal();
setupTyping();
setupMagneticButtons();
setCurrentYear();
setupImageFallbacks();
renderProjects();

// ===== GitHub stats (public API, no keys) =====
function setupGithub() {
  const box = qs("#githubStats");
  if (!box) return;
  const user = siteData.github.split("/").filter(Boolean).pop();
  const cacheKey = "saad-gh-cache";
  const ttl = 6 * 60 * 60 * 1000; // 6 hours: avoids burning GitHub's 60 req/hour/IP anonymous limit (many mobile users share one IP)
  let cached = null, stale = null;
  try {
    const raw = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (raw && Array.isArray(raw.d) && raw.d[0] && typeof raw.d[0] === "object" && Array.isArray(raw.d[1])) {
      stale = raw.d; // old data is still better than hiding the box when GitHub rate-limits us
      if (Date.now() - raw.t < ttl) cached = raw.d;
    }
  } catch { /* ignore */ }
  const load = cached ? Promise.resolve(cached) : Promise.all([
    fetch(`https://api.github.com/users/${user}`).then(r => { if (!r.ok) throw 0; return r.json(); }),
    fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=4`).then(r => { if (!r.ok) throw 0; return r.json(); })
  ]).then(data => { try { localStorage.setItem(cacheKey, JSON.stringify({ t: Date.now(), d: data })); } catch { /* ignore */ } return data; }).catch(err => { if (stale) return stale; throw err; });
  load.then(([profile, repos]) => {
    const stats = [["Public repos", profile.public_repos], ["Followers", profile.followers], ["Following", profile.following]]
      .map(([k, v]) => `<div><strong>${Number(v) || 0}</strong><span>${k}</span></div>`).join("");
    const list = repos.filter(r => !r.fork).map(r => `<a href="${safeUrl(r.html_url)}" target="_blank" rel="noopener noreferrer"><strong>${esc(r.name)}</strong><span>${esc(r.description || r.language || "Repository")}</span></a>`).join("");
    box.innerHTML = `<div class="gh-stats">${stats}</div>${list ? `<div class="gh-repos">${list}</div>` : ""}`;
    box.hidden = false;
  }).catch(() => { box.hidden = true; });
}

// ===== Optional sections: only shown when real data exists =====
function setupOptionalSections() {
  const achGrid = qs("#achievementGrid"), tesGrid = qs("#testimonialGrid");
    if (achGrid && Array.isArray(achievements) && achievements.length) {
    achGrid.innerHTML = achievements.map(a => `<article class="info-card"><div class="info-card__icon"><i class="fa-solid fa-award" aria-hidden="true"></i></div><span>${esc(a.year)}</span><strong>${esc(a.title)}</strong><small>${esc(a.detail)}</small></article>`).join("");
    qs("#achievements").hidden = false;
  }
  if (tesGrid && Array.isArray(testimonials) && testimonials.length) {
    tesGrid.innerHTML = testimonials.map(t => `<figure class="info-card"><blockquote>“${esc(t.quote)}”</blockquote><figcaption><strong>${esc(t.name)}</strong><small>${esc(t.role)}</small></figcaption></figure>`).join("");
    qs("#testimonials").hidden = false;
  }
}

// ===== Command menu (Ctrl/Cmd + K) =====
function setupCommandMenu() {
  const menu = qs("#commandMenu"), input = qs("#commandInput"), list = qs("#commandList");
  if (!menu) return;
  const go = id => () => qs(id)?.scrollIntoView({ behavior: "smooth" });
  const commands = [
    ["Go to Home", go("#home")], ["Go to About", go("#about")], ["Go to Skills", go("#skills")], ["Go to Projects", go("#projects")], ["Go to FAQ", go("#faq")], ["Go to Contact", go("#contact")],
    ["Toggle dark / light theme", () => setTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light")],
    ["Download CV", () => { window.location.href = "assets/cv/Saad-Sheikh-CV.pdf"; }],
    ["Open GitHub", () => window.open(siteData.github, "_blank", "noopener")],
    ["Open Facebook", () => window.open(siteData.facebook, "_blank", "noopener")],
    ["Send email", () => { window.location.href = `mailto:${siteData.email}`; }]
  ];
  let shown = commands, active = 0, lastFocus = null;
  const render = () => {
    list.innerHTML = shown.map((c, i) => `<li role="option" id="cmd-${i}" aria-selected="${i === active}" class="${i === active ? "active" : ""}" data-i="${i}">${esc(c[0])}</li>`).join("") || '<li class="empty">No results</li>';
    input.setAttribute("aria-activedescendant", shown.length ? `cmd-${active}` : "");
  };
  const inertTargets = "#main-content, .site-header, .footer, .floating-contact, .back-to-top";
  const setInert = on => qsa(inertTargets).forEach(el => on ? el.setAttribute("inert", "") : el.removeAttribute("inert"));
  const open = () => { lastFocus = document.activeElement; setInert(true); input.setAttribute("aria-expanded", "true"); menu.classList.add("open"); menu.setAttribute("aria-hidden", "false"); input.value = ""; shown = commands; active = 0; render(); focusSoon(input); };
  const close = () => { setInert(false); input.setAttribute("aria-expanded", "false"); menu.classList.remove("open"); menu.setAttribute("aria-hidden", "true"); lastFocus?.focus?.(); };
  const run = i => { const c = shown[i]; if (!c) return; close(); setTimeout(c[1], 80); };
  input.addEventListener("input", () => { const q = input.value.trim().toLowerCase(); shown = commands.filter(c => c[0].toLowerCase().includes(q)); active = 0; render(); });
  list.addEventListener("click", e => { const li = e.target.closest("li[data-i]"); if (li) run(Number(li.dataset.i)); });
  menu.addEventListener("click", e => { if (e.target.matches("[data-cmd-close]")) close(); });
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); menu.classList.contains("open") ? close() : open(); return; }
    if (!menu.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") { e.preventDefault(); active = (active + 1) % Math.max(shown.length, 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); active = (active - 1 + shown.length) % Math.max(shown.length, 1); render(); }
    else if (e.key === "Enter") { e.preventDefault(); run(active); }
    else if (e.key === "Tab") { e.preventDefault(); input.focus(); }
  });
  qs("#commandButton")?.addEventListener("click", open);
}

setupGithub();
setupOptionalSections();
setupCommandMenu();

// ===== Offline support (only on https/localhost, never from file://) =====
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { /* optional feature */ }));
}
