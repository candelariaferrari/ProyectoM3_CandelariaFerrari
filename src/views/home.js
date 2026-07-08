// Vista de bienvenida: galería de emociones

import { hasSavedConversation } from "../storage.js";
import { getTheme, toggleTheme } from "../theme.js";

const ICON_SUN = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;

const ICON_MOON = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

const ICON_CHAT = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;

const EMOTIONS = [
  { key: "joy", name: "Alegría", desc: "Encuentro un motivo para sonreír." },
  { key: "anger", name: "Furia", desc: "A veces hace falta hacerse escuchar." },
  { key: "anxiety", name: "Ansiedad", desc: "Imagino todos los escenarios posibles." },
  { key: "sadness", name: "Tristeza", desc: "No hace falta estar bien todo el tiempo." },
];


// Arranca sin ninguna emoción seleccionada: el usuario tiene que elegir una tarjeta antes de poder chatear.
let selectedKey = null;

// Arma el HTML de una tarjeta de emoción para la galería de Home.
function cardTemplate({ key, name, desc }) {
  const isActive = key === selectedKey;
  // Indicador visual de que ya existe una charla guardada con este personaje (persistida en localStorage,).
  const savedBadge = hasSavedConversation(key)
    ? `<span class="card__saved-badge">${ICON_CHAT}Continuar</span>`
    : "";
  return `
    <button
      type="button"
      class="card ${key} ${isActive ? "active" : ""}"
      data-emotion="${key}"
      aria-pressed="${isActive}"
    >
      ${savedBadge}
      <div class="card__media">
        <img src="/assets/img/${key}.png" alt="${name}" />
      </div>
      <div class="card__info">
        <h3>${name}</h3>
        <p>${desc}</p>
      </div>
    </button>
  `;
}

// El botón "Charlemos" arranca deshabilitado, se activa recién cuando se elige una tarjeta. 
function btnChatTemplate(key) {
  if (!key) {
    return `<a class="btn-chat btn-chat--disabled" id="btnChat" aria-disabled="true">Elegí una emoción para charlar</a>`;
  }
  return `<a class="btn-chat" id="btnChat" href="/chat/${key}">Charlemos</a>`;
}

// Pinta toda la vista de Home y conecta sus listeners (selección de tarjeta y toggle de tema).
export function renderHome() {
  const app = document.getElementById("app");
  const cards = EMOTIONS.map(cardTemplate).join("");
  const theme = getTheme();

  app.innerHTML = `
    <div id="home" data-theme="${theme}">
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
      <div class="container-header">
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">¿Con cuál querés hablar hoy?</p>
      </div>

      <div class="container-cards">
        ${cards}
      </div>

      ${btnChatTemplate(selectedKey)}

     <footer class="footer">
       <span class="footer__links">
        <a class="link-footer" href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">Github</a>
        <a class="link-footer" href="https://www.linkedin.com/in/TU-USUARIO-AQUI" target="_blank" rel="noopener noreferrer">Linkedin</a>
      </span>
        <a href="https://github.com/candelariaferrari?tab=repositories" target="_blank" rel="noopener noreferrer">© 2026 - Creado por @candeferrari</a>
      </footer>
    </div>
  `;

  attachCardSelection();
  attachThemeToggle();
}

// Cambia el atributo data-theme directamente en el DOM para no perder la tarjeta seleccionada. 

function attachThemeToggle() {
  const homeEl = document.getElementById("home");
  const btnTheme = document.getElementById("btnTheme");

  btnTheme?.addEventListener("click", () => {
    const newTheme = toggleTheme();
    homeEl.setAttribute("data-theme", newTheme);
    btnTheme.innerHTML = newTheme === "light" ? ICON_MOON : ICON_SUN;
    btnTheme.setAttribute("aria-label", `Cambiar a modo ${newTheme === "light" ? "oscuro" : "claro"}`);
  });
}

// Escucha el click en cada tarjeta para marcarla como activa y habilitar el botón "Charlemos".
function attachCardSelection() {
  const cards = document.querySelectorAll(".container-cards .card");
  const btnChat = document.getElementById("btnChat");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      selectedKey = card.dataset.emotion;

      cards.forEach((c) => {
        const isActive = c === card;
        c.classList.toggle("active", isActive);
        c.setAttribute("aria-pressed", String(isActive));
      });

      // Primer click: el botón pasa de deshabilitado a habilitado.
      btnChat.classList.remove("btn-chat--disabled");
      btnChat.removeAttribute("aria-disabled");
      btnChat.textContent = "Charlemos";
      btnChat.setAttribute("href", `/chat/${selectedKey}`);
    });
  });
}
