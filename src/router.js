import { renderHome } from "./views/home.js";
import { renderChat } from "./views/chatbox.js";
import { renderAbout } from "./views/about.js";
import { renderNotFound } from "./views/notFound.js";

// Cada view es responsable de insertarse a sí misma en el DOM.

const routes = [
  { pattern: /^\/(?:home)?$/, render: renderHome },
  { pattern: /^\/chat\/(\w+)$/, render: renderChat }, // /chat/joy, /chat/anger, ...
  { pattern: /^\/chat$/, render: renderChat }, // fallback sin emoción -> default "joy"
  { pattern: /^\/about$/, render: renderAbout },
];

// para Live Server (y algunos hosts estáticos)
function normalizePath(pathname) {
  const cleaned = pathname.replace(/\/index\.html$/, "/");
  return cleaned === "" ? "/" : cleaned;
}

// Busca qué ruta matchea la URL actual y renderiza esa vista; si ninguna matchea, muestra el 404.
export function router() {
  const path = normalizePath(window.location.pathname);

  for (const route of routes) {  //recore la lista de url
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

// Cambia de URL sin recargar (pushState) y dispara el render de la nueva ruta.
export function navigateTo(path) {
  if (window.location.pathname === path) return;
  history.pushState(null, "", path);
  router();
}

// "/" y "/home" son la misma vista (Home), y cualquier "/chat/algo" cuenta
// como el link "/chat" activo
function isLinkActive(href, currentPath) {
  if (href === "/home") return currentPath === "/" || currentPath === "/home";
  if (href === "/chat") return currentPath.startsWith("/chat");
  return href === currentPath;
}

// Resalta con .active el link de navegación que corresponda a la ruta actual
function updateActiveLink() {
  const current = window.location.pathname;
  document.querySelectorAll(".navbar__links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http")) return;
    link.classList.toggle("active", isLinkActive(href, current));
  });
}
