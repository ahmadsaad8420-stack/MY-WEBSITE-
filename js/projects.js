"use strict";

const projects = [
  {
    title: "Personal Portfolio Website",
    type: "Demo Project",
    category: ["web", "demo"],
    description: "A modern responsive personal portfolio focused on clean UI, accessibility, performance and easy customization.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Responsive layout", "Dark/light theme", "Accessible navigation", "Project filtering"],
    visual: "browser",
    github: "#",
    demo: "#"
  },
  {
    title: "Modern Calculator",
    type: "Demo Project",
    category: ["javascript", "tools", "demo"],
    description: "A focused calculator interface for practicing JavaScript events, arithmetic logic and polished UI states.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Interactive keypad", "Keyboard-ready structure", "Clean display", "Responsive UI"],
    visual: "calculator",
    github: "#",
    demo: "#"
  },
  {
    title: "To-Do List App",
    type: "Demo Project",
    category: ["javascript", "tools", "demo"],
    description: "A simple task-management concept for practicing DOM manipulation, state changes and user interaction.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Add tasks", "Task states", "DOM interaction", "Minimal interface"],
    visual: "list",
    github: "#",
    demo: "#"
  },
  {
    title: "Expense Tracker",
    type: "Demo Project",
    category: ["web", "javascript", "tools", "demo"],
    description: "A learning project concept for tracking income and expenses while practicing JavaScript data handling.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Expense entries", "Category concept", "Summary visual", "Responsive dashboard"],
    visual: "chart",
    github: "#",
    demo: "#"
  },
  {
    title: "Weather App",
    type: "Demo Project",
    category: ["web", "javascript", "demo"],
    description: "A weather-app concept designed to practice API integration patterns, loading states and information hierarchy.",
    technologies: ["HTML", "CSS", "JavaScript", "API-ready"],
    features: ["Weather card", "Location concept", "API-ready structure", "Loading-friendly UI"],
    visual: "weather",
    github: "#",
    demo: "#"
  },
  {
    title: "Simple JavaScript Game",
    type: "Demo Project",
    category: ["javascript", "web", "demo"],
    description: "A lightweight game concept for practicing JavaScript events, timing, state and interactive feedback.",
    technologies: ["HTML", "CSS", "JavaScript"],
    features: ["Game area", "Interactive state", "Score-ready structure", "Lightweight UI"],
    visual: "game",
    github: "#",
    demo: "#"
  }
];

// Add REAL entries only. Sections stay hidden while these lists are empty.
// achievements: { title: "", detail: "", year: "" }
const achievements = [];
// testimonials: { quote: "", name: "", role: "" }
const testimonials = [];
