import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chatbox.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// Cada view es responsable de insertarse a sí misma en el DOM (ver views/*.js).
// El router solo decide CUÁL renderizar según la URL actual.
const routes = [
  { pattern: /^\/(?:home)?$/, render: renderHome },
  { pattern: /^\/chat\/(\w+)$/, render: renderChat }, // /chat/joy, /chat/anger, ...
  { pattern: /^\/chat$/, render: renderChat }, // fallback sin emoción -> default "joy"
  { pattern: /^\/about$/, render: renderAbout },
];

export function router() {
  const path = window.location.pathname;

  for (const route of routes) {
    const match = path.match(route.pattern);
    if (match) {
      route.render(match[1] || null);
      updateActiveLink();
      return;
    }
  }

  renderNotFound();
  updateActiveLink();
}

export function navigateTo(path) {
  if (window.location.pathname === path) return;
  history.pushState(null, "", path);
  router();
}

// Resalta con .active el link de navegación que corresponda a la ruta actual
// (queda "inerte" hasta que agregue una navbar persistente con esa clase).
function updateActiveLink() {
  const current = window.location.pathname;
  document.querySelectorAll(".navbar__links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    link.classList.toggle("active", href === current);
  });
}
