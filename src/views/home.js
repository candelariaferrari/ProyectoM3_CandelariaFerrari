// Vista de bienvenida: galería de emociones

import { hasSavedConversation } from "../storage.js";
import { getTheme } from "../theme.js";
import { navbarTemplate, footerTemplate, attachThemeToggle } from "./shared.js";
import { EMOTIONS, EMOTION_ORDER } from "../emotions.js";
/* icon */
const ICON_CHAT = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;

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
  const cards = EMOTION_ORDER.map((key) => cardTemplate({ key, ...EMOTIONS[key] })).join("");
  const theme = getTheme();

  app.innerHTML = `
    <div id="home" data-theme="${theme}">
      ${navbarTemplate(theme)}
      <div class="container-header">
        <h1 class="header__title">Chat con tus <span>EMOCIONES</span></h1>
        <p class="header__subtitle">¿Con cuál querés hablar hoy?</p>
      </div>

      <div class="container-cards">
        ${cards}
      </div>

      ${btnChatTemplate(selectedKey)}

    ${footerTemplate()}
    </div>
  `;

  attachCardSelection();
  attachThemeToggle("home");
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
