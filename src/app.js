//logica principal, routing
import { renderHome } from "./views/home.js";
import { renderChatbox } from "./views/chatbox.js";
import { renderAbout } from "./views/about.js";

const app = document.getElementById("app");

const routes = {
  "/home": renderHome,
  "/chat": renderChatbox,
  "/about": renderAbout,
};

function resolvePath(pathname) {
  return routes[pathname] ? pathname : "/home";
}

/**
 * Renderiza la vista correspondiente a una ruta dentro de #app.
 * @param {string} pathname - ej: "/chat"
 * @param {object} params - ej: { emotion: "anger" }
 */
function render(pathname, params = {}) {
  const path = resolvePath(pathname);
  const view = routes[path];

  app.innerHTML = view(params);

  bindLinks();
  window.scrollTo(0, 0);
}

// Delega clicks en cualquier elemento con [data-link] para navegar sin recargar
function bindLinks() {
  app.querySelectorAll("[data-link]").forEach((el) => {
    el.addEventListener("click", (event) => {
      event.preventDefault();
      const href = el.getAttribute("href");
      const emotion = el.dataset.emotion;
      goTo(href, emotion ? { emotion } : {});
    });
  });
}

// Navega a una ruta actualizando la URL (History API) sin recargar la página.

export function goTo(path, params = {}) {
  history.pushState({ path, params }, "", path);
  render(path, params);
}

// botones back/forward 
window.addEventListener("popstate", (event) => {
  render(window.location.pathname, event.state?.params || {});
});

// Render inicial 
const initialPath =
  window.location.pathname === "/" ? "/home" : window.location.pathname;
render(initialPath);
