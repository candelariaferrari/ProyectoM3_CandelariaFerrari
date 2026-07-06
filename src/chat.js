// Lógica específica del chat: historial en memoria, envío de mensajes a la
// serverless function de Gemini, estado de "escribiendo...", errores y
// scroll automático.

import { escapeHtml, createMessage } from "./utils.js";

// Historial en memoria por personaje. Vive solo mientras la pestaña esté abierta -si se recarga la página se pierde
const conversations = new Map();

function getConversation(key, greeting) {
  if (!conversations.has(key)) {
    conversations.set(key, [createMessage("char", greeting)]);
  }
  return conversations.get(key);
}

// Reinicia la charla de un personaje: borra todo lo hablado y la deja como
// recién entrada (solo el saludo inicial). Muta el mismo array en vez de
// reemplazarlo, para que initChat (que ya tiene una referencia a ese array
// en sus listeners) vea el cambio sin tener que volver a conectar nada.
function resetHistory(key, greeting) {
  const conversation = getConversation(key, greeting);
  conversation.length = 0;
  conversation.push(createMessage("char", greeting));
  return conversation;
}

function messageBubbleHtml(message) {
  const roleClass = message.role === "user" ? "message--user" : "message--char";
  return `<div class="message ${roleClass}"><p>${escapeHtml(message.text)}</p></div>`;
}

function typingBubbleHtml() {
  return `
    <div class="message message--char message--typing">
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
// seguido dispara el error de rate-limit enseguida. En vez de solo mostrar
// el error después de que pasa, prevenimos que pase deshabilitando el
// composer unos segundos luego de cada respuesta (éxito o error).
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

function errorCardHtml(error) {
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

//  Manda el mensaje a Gemini y actualiza la UI según lo que pase. Se llama tanto al enviar un mensaje nuevo como al apretar "Reintentar".
async function sendAndRender(key, conversation, messagesContainer, input, sendButton) {
  renderMessages(messagesContainer, conversation, { isTyping: true });
  // Deshabilitado también mientras se espera la respuesta (no solo después):
  // sin esto, alcanzaba a mandar un segundo mensaje antes de que llegara el
  // primero y se pisaban las respuestas.
  setComposerDisabled(input, sendButton, true);

  try {
    const reply = await requestReply(key, conversation);
    conversation.push(createMessage("char", reply));
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
    input.value = "";
    sendAndRender(key, conversation, messagesContainer, input, sendButton);
  });

  // El botón "Reintentar" se crea recién cuando hay un error
  messagesContainer.addEventListener("click", (event) => {
    if (event.target.closest(".btn-retry")) {
      sendAndRender(key, conversation, messagesContainer, input, sendButton);
    }
  });

  resetButton?.addEventListener("click", () => {
    resetHistory(key, greeting);
    renderMessages(messagesContainer, conversation, {});
  });
}
