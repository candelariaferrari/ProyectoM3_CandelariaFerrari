export const EMOTIONS = {
  joy: {
    name: "Alegría",
    status: "En línea, lista para ayudarte",
    tagline: "Siempre veo el lado positivo de las cosas.",
    helps: ["Motivación", "Ver lo positivo", "Ánimo", "Ideas y energía"],
    greeting: "¡Hola! ¿En qué te puedo ayudar hoy? ✨",
  },
  anger: {
    name: "Furia",
    status: "En línea · directa y sin vueltas",
    tagline: "Digo las cosas como son, sin filtro.",
    helps: [
      "Poner límites",
      "Decir lo que pensás",
      "Encarar un conflicto",
      "No quedarte callado/a",
    ],
    greeting: "¿Qué querés? Soy todo oídos. 🔥",
  },
  sadness: {
    name: "Tristeza",
    status: "En línea · acá para escucharte",
    tagline: "Escucho y valido lo que sentís, sin apurar nada.",
    helps: [
      "Hablar de lo que te pasa",
      "Sentirte acompañado/a",
      "Procesar una emoción",
      "Bajar el ritmo",
    ],
    greeting: "Hola... estoy acá si me necesitás 💙",
  },
  anxiety: {
    name: "Ansiedad",
    status: "En línea · siempre alerta",
    tagline: "Pienso en todos los escenarios posibles, por las dudas.",
    helps: [
      "Organizar pendientes",
      "Anticipar problemas",
      "Prepararte para algo",
      "Calmar los nervios",
    ],
    greeting: "¿Pasa algo? ¡Contame todo, necesito saber! 😰",
  },
};

const ORDER = ["joy", "anger", "sadness", "anxiety"];

const ICON_CLOSE = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

const ICON_SEND = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>`;

const ICON_BACK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;

function dotsTemplate(activeKey) {
  return ORDER.map((key) => {
    const isActive = key === activeKey ? "is-active" : "";
    return `<button class="emotion-dot ${key} ${isActive}" type="button" data-link href="/chat" data-emotion="${key}" aria-label="Chatear con ${EMOTIONS[key].name}"></button>`;
  }).join("");
}

export function renderChatbox(params = {}) {
  const key = ORDER.includes(params.emotion) ? params.emotion : "joy";
  const data = EMOTIONS[key];
  const helps = data.helps.map((h) => `<li>${h}</li>`).join("");

  return `
      <div id="chatbox" class="${key}">
        <div class="chatbox__topbar">
          <h1 class="chatbox__title">Chat con tus <span>EMOCIONES</span></h1>
          <div class="chatbox__dots">${dotsTemplate(key)}</div>
        </div>
  
        <div class="chatbox__body">
          <!-- Sidebar: oculto en mobile, visible en desktop (ver mediaquery en styles.css) -->
          <aside class="chat-sidebar">
            <button class="btn-back" type="button" data-link href="/home" aria-label="Volver a home">
              ${ICON_BACK}
            </button>
            <img class="chat-sidebar__avatar" src="./assets/img/${key}.png" alt="${
    data.name
  }" />
            <h2 class="chat-sidebar__name">${data.name}</h2>
            <p class="chat-sidebar__tagline">${data.tagline}</p>
            <p class="chat-sidebar__label">Puedo ayudarte con:</p>
            <ul class="chat-sidebar__list">${helps}</ul>
          </aside>
  
          <section class="chat-main">
            <header class="chat-header">
              <button class="btn-back chat-header__back" type="button" data-link href="/home" aria-label="Volver a home">
                ${ICON_BACK}
              </button>
              <img class="chat-header__avatar" src="/assets/img/${key}.png" alt="${
    data.name
  }" />
              <div class="chat-header__info">
                <h2 class="chat-header__name">${data.name}</h2>
                <p class="chat-header__status"><span class="status-dot"></span>${
                  data.status
                }</p>
              </div>
              <button class="btn-close" type="button" data-link href="/home" aria-label="Cerrar chat">
                ${ICON_CLOSE}
              </button>
            </header>
  
            <main class="chat-messages" id="chatMessages">
              <div class="message message--char">
                <p>${data.greeting}</p>
              </div>
            </main>
  
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
}
