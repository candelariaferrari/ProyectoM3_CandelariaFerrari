// Vista de chat, una por emoción.
// La emoción llega como parámetro de la URL (/chat/:emotion), capturado por el router.

import { initChat } from "../chat.js";

export const EMOTIONS = {
  joy: {
    name: "Alegría",
    status: "En línea · lista para alegrarte el día",
    tagline: "Siempre encuentro un motivo para sonreír.",
    helps: [
      "Encontrar lo positivo",
      "Recuperar el ánimo",
      "Celebrar tus logros",
      "Motivarte"
    ],
    greeting: "¡Hola! ✨ Me alegra muchísimo verte. ¿Qué hacemos hoy?",
    phrase: "Hasta los días grises esconden un rayito de sol. ☀️"
  },

  anger: {
    name: "Furia",
    status: "En línea · sin vueltas",
    tagline: "A veces hace falta hacerse escuchar.",
    helps: [
      "Poner límites",
      "Expresar lo que sentís",
      "Resolver conflictos",
      "Defender tu postura"
    ],
    greeting: "Bueno... decime qué pasó. 🔥",
    phrase: "Quedarse callado no siempre es la mejor opción."
  },

  sadness: {
    name: "Tristeza",
    status: "En línea · acá para acompañarte",
    tagline: "No hace falta estar bien todo el tiempo.",
    helps: [
      "Hablar de lo que sentís",
      "Encontrar contención",
      "Procesar emociones",
      "Tomarte un respiro"
    ],
    greeting: "Hola... 💙 Estoy acá para escucharte.",
    phrase: "A veces, sentir también es una forma de avanzar."
  },

  anxiety: {
    name: "Ansiedad",
    status: "En línea · pensando un paso adelante",
    tagline: "Siempre imagino todos los escenarios posibles.",
    helps: [
      "Organizar ideas",
      "Prepararte para desafíos",
      "Reducir la incertidumbre",
      "Ordenar tus pendientes"
    ],
    greeting: "¡Esperá! 😰 Contame bien qué está pasando.",
    phrase: "Respiremos primero... después resolvemos lo demás."
  }
};

const ORDER = ["joy", "anger", "sadness", "anxiety"];

const ICON_CLOSE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const ICON_SEND = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>`;

const ICON_RESET = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>`;

function dotsTemplate(activeKey) {
  // El personaje activo va primero, el resto mantiene el orden de siempre.
  const orderedKeys = [activeKey, ...ORDER.filter((key) => key !== activeKey)];

  return orderedKeys.map((key) => {
    const isActive = key === activeKey ? "is-active" : "";
    return `
      <a class="emotion-dot ${key} ${isActive}" href="/chat/${key}" aria-label="Chatear con ${EMOTIONS[key].name}">
        <img src="/assets/img/${key}.png" alt="" />
      </a>
    `;
  }).join("");
}

/**
 * @param {string|null} emotionParam - capturado de la URL /chat/:emotion por el router
 */
export function renderChat(emotionParam) {
  const key = ORDER.includes(emotionParam) ? emotionParam : "joy";
  const data = EMOTIONS[key];
  const helps = data.helps.map((h) => `<li>${h}</li>`).join("");
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="chatbox__topbar">
      <h1 class="chatbox__title">Chat con tus <span>EMOCIONES</span></h1>
      <span class="content__dots">
        <p class="chatbox__subtitle">En el cuartel general: ${data.name} está al mando </p>
        <div class="chatbox__dots">${dotsTemplate(key)}</div>
      </span>
    </div>

    <div id="chatbox" class="${key}">
      <div class="chatbox__body">
        <aside class="chat-sidebar">
          <img class="chat-sidebar__avatar" src="/assets/img/${key}.png" alt="${data.name}" />
          <h2 class="chat-sidebar__name">${data.name}</h2>
          <p class="chat-sidebar__tagline">${data.tagline}</p>
          <p class="chat-sidebar__label">Puedo ayudarte con:</p>
          <ul class="chat-sidebar__list">${helps}</ul>
          <p class="chat-sidebar__phrase"> ${data.phrase}</p>
        </aside>

        <section class="chat-main">
          <header class="chat-header">
            <img class="chat-header__avatar" src="/assets/img/${key}.png" alt="${data.name}" />
            <div class="chat-header__info">
              <h2 class="chat-header__name">${data.name}</h2>
              <p class="chat-header__status"><span class="status-dot"></span>${data.status}</p>
            </div>
            <button type="button" class="btn-reset" id="btnResetChat" aria-label="Reiniciar conversación">
              ${ICON_RESET}
            </button>
            <a class="btn-close" href="/home" aria-label="Cerrar chat">
              ${ICON_CLOSE}
            </a>
          </header>

          <main class="chat-messages" id="chatMessages"></main>

          <form class="chat-composer" id="chatComposer">
            <input
              type="text"
              id="chatInput"
              placeholder="Escribí un pensamiento ..."
              autocomplete="off"
              aria-label="Escribir mensaje"
            />
            <button type="submit" class="btn-send" aria-label="Enviar mensaje">
              ${ICON_SEND}
            </button>
          </form>
        </section>
      </div>
    </div>
  `;

  initChat(key, data.greeting);
}
