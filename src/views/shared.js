// Piezas de UI que comparten Home y About: navbar, footer, y el toggle de modo claro/oscuro. 
import { toggleTheme } from "../theme.js";

/* iconos */
export const ICON_SUN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

export const ICON_MOON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

/* Navbar */
export function navbarTemplate(theme) {
  return `
    <nav class="container-navbar">
      <p class="header__movie">Intensamente</p>
      <span class="navbar__links">
        <a class="btn-about" href="/home">Home</a>
        <a class="btn-about" href="/chat">Chat</a>
        <a class="btn-about" href="/about">About</a>
        <button type="button" class="btn-theme" id="btnTheme" aria-label="Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}">
          ${theme === "light" ? ICON_MOON : ICON_SUN}
        </button>
      </span>
    </nav>
  `;
}
/* footer */
export function footerTemplate() {
  return `
    <footer class="footer">
      <span class="footer__links">
        <a class="link-footer" href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">Github</a>
        <a class="link-footer" href="https://www.linkedin.com/in/candelariaferrari" target="_blank" rel="noopener noreferrer">Linkedin</a>
      </span>
      <a href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">© 2026 - Creado por @candeferrari</a>
    </footer>
  `;
}

// containerId es "home" o "About" — el id del div raíz de cada vista, para
// saber a quién actualizarle el data-theme al tocar el botón.
export function attachThemeToggle(containerId) {
  const container = document.getElementById(containerId);
  const btnTheme = document.getElementById("btnTheme");

  btnTheme?.addEventListener("click", () => {
    const newTheme = toggleTheme();
    container.setAttribute("data-theme", newTheme);
    btnTheme.innerHTML = newTheme === "light" ? ICON_MOON : ICON_SUN;
    btnTheme.setAttribute("aria-label", `Cambiar a modo ${newTheme === "light" ? "oscuro" : "claro"}`);
  });
}