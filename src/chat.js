// Lógica específica del chat: historial en memoria, envío de mensajes a la
// serverless function de Gemini, estado de "escribiendo...", errores y
// scroll automático.

import { escapeHtml, createMessage } from "./utils.js";
import { loadConversation, saveConversation, clearConversation } from "./storage.js";

// Historial en memoria por personaje (caché de lo que hay en localStorage)
const conversations = new Map();

// Si ya está en memoria, se usa tal cual. Si no, se intenta traer de
// localStorage (charla de una sesión anterior); si tampoco hay nada
// guardado, arranca de cero con el saludo del personaje.
function getConversation(key, greeting) {
  if (!conversations.has(key)) {
    const saved = loadConversation(key);
    conversations.set(key, saved && saved.length > 0 ? saved : [createMessage("assistant", greeting)]);
  }
  return conversations.get(key);
}

// Reinicia la charla de un personaje
function resetHistory(key, greeting) {
  const conversation = getConversation(key, greeting);
  conversation.length = 0;
  conversation.push(createMessage("assistant", greeting));
  clearConversation(key);
  return conversation;
}

const ICON_COPY = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

const ICON_CHECK = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

function messageBubbleHtml(message) {
  const roleClass = message.role === "user" ? "message--user" : "message--assistant";
  // El botón de copiar solo tiene sentido en las respuestas del personaje.
  const copyButton =
    message.role === "user"
      ? ""
      : `<button type="button" class="btn-copy" aria-label="Copiar respuesta">${ICON_COPY}</button>`;
  return `<div class="message ${roleClass}"><p>${escapeHtml(message.text)}</p>${copyButton}</div>`;
}

// Copia el texto de una burbuja al portapapeles.
async function copyMessageText(button) {
  const text = button.closest(".message")?.querySelector("p")?.textContent ?? "";
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const originalHtml = button.innerHTML;
    button.innerHTML = ICON_CHECK;
    button.classList.add("btn-copy--copied");
    setTimeout(() => {
      button.innerHTML = originalHtml;
      button.classList.remove("btn-copy--copied");
    }, 1500);
  } catch (error) {
    console.error("[chat] No se pudo copiar al portapapeles:", error);
  }
}

function typingBubbleHtml() {
  return `
    <div class="message message--assistant message--typing">
      <span></span><span></span><span></span>
    </div>
  `;
}

// Traduce un error (de red o de la API) a lo que necesita la tarjeta de error
export function errorInfoFor(error) {
  if (error.status === 429) {
    return {
      variant: "rate-limit",
      title: "Muchos mensajes seguidos",
      message: error.message || "Esperá unos segundos antes de volver a escribir.",
    };
  }
  if (error.status) {
    return {
      variant: "server",
      title: "Algo salió mal",
      message: error.message || "El personaje no pudo responder. Probá de nuevo.",
    };
  }
  // Sin "status" quiere decir que el fetch nunca llegó a responder lo tratamos como error de red.
  return {
    variant: "network",
    title: "Sin conexión",
    message: "No pudimos conectarnos. Revisá tu internet e intentá de nuevo.",
  };
}

// Cooldown después de cada respuesta: el tier gratuito de Gemini tiene un
// límite de peticiones por minuto muy bajo, así que mandar mensajes muy
// seguido dispara el error de rate-limit enseguida.
const SEND_COOLDOWN_MS = 4000;

function setComposerDisabled(input, button, disabled) {
  input.disabled = disabled;
  button.disabled = disabled;
}

function startCooldown(input, button) {
  setComposerDisabled(input, button, true);
  const originalPlaceholder = input.placeholder;
  let remainingSeconds = Math.ceil(SEND_COOLDOWN_MS / 1000);
  input.placeholder = `Esperá ${remainingSeconds}s antes de escribir de nuevo...`;

  const intervalId = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      input.placeholder = originalPlaceholder;
      setComposerDisabled(input, button, false);
      return;
    }
    input.placeholder = `Esperá ${remainingSeconds}s antes de escribir de nuevo...`;
  }, 1000);
}

function errorCardHtml(error) { //tarjeta de error
  const { variant, title, message } = errorInfoFor(error);
  return `
    <div class="error">
      <div class="error-card error--${variant}">
        <h4>${escapeHtml(title)}</h4>
        <p>${escapeHtml(message)}</p>
        <button type="button" class="btn-retry">Reintentar</button>
      </div>
    </div>
  `;
}

function renderMessages(container, conversation, { isTyping = false, error = null } = {}) {
  const bubbles = conversation.map(messageBubbleHtml).join("");
  const extra = error ? errorCardHtml(error) : isTyping ? typingBubbleHtml() : "";
  container.innerHTML = bubbles + extra;
  // Scroll automático al último mensaje
  container.scrollTop = container.scrollHeight;
}

//  Llama a la serverless function que es la única que conoce la API key 
async function requestReply(key, conversation) {
  const response = await fetch("/api/functions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ character: key, messages: conversation }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || "Error desconocido");
    error.status = response.status;
    throw error;
  }

  return data.text;
}

//  Manda el mensaje a Gemini y actualiza la UI según lo que pase. Se llama al enviar o Reintentar.
async function sendAndRender(key, conversation, messagesContainer, input, sendButton) {
  renderMessages(messagesContainer, conversation, { isTyping: true });
  // Deshabilitado también mientras se espera la respuesta
  setComposerDisabled(input, sendButton, true);

  try {
    const reply = await requestReply(key, conversation);
    conversation.push(createMessage("assistant", reply));
    saveConversation(key, conversation);
    renderMessages(messagesContainer, conversation, {});
  } catch (error) {
    console.error("[chat] Error pidiendo respuesta:", error);
    renderMessages(messagesContainer, conversation, { error });
  } finally {
    // Se ejecuta tanto si salió bien como si hubo error (incluyendo el 429):
    // así "Reintentar" tampoco puede spamear la API mientras dura el cooldown.
    startCooldown(input, sendButton);
  }
}

/**
 * @param {string} key - clave del personaje (joy, anger, sadness, anxiety)
 * @param {string} greeting - saludo inicial de ese personaje
 */
export function initChat(key, greeting) {
  const form = document.getElementById("chatComposer");
  const input = document.getElementById("chatInput");
  const messagesContainer = document.getElementById("chatMessages");
  const sendButton = form?.querySelector(".btn-send");
  const resetButton = document.getElementById("btnResetChat");

  if (!form || !input || !messagesContainer || !sendButton) return;

  const conversation = getConversation(key, greeting);
  renderMessages(messagesContainer, conversation, {});

  form.addEventListener("submit", (event) => {
    // Sin esto, el <form> recarga la página al enviar (comportamiento nativo del navegador) y perderíamos toda la SPA.
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    conversation.push(createMessage("user", text));
    saveConversation(key, conversation);
    input.value = "";
    sendAndRender(key, conversation, messagesContainer, input, sendButton);
  });

  // El botón "Reintentar" se crea recién cuando hay un error; el de copiar
  // vive en cada burbuja de respuesta del personaje.
  messagesContainer.addEventListener("click", (event) => {
    const copyBtn = event.target.closest(".btn-copy");
    if (copyBtn) {
      copyMessageText(copyBtn);
      return;
    }
    if (event.target.closest(".btn-retry")) {
      sendAndRender(key, conversation, messagesContainer, input, sendButton);
    }
  });

  resetButton?.addEventListener("click", () => {
    resetHistory(key, greeting);
    renderMessages(messagesContainer, conversation, {});
  });
}
