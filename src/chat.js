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
function errorInfoFor(error) {
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

//  Llama a la serverless function /api/functions, que es la única que conoce la API key y habla con Gemini. 
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

//  Manda el mensaje a Gemini y actualiza la UI según lo que pase.
// Se llama tanto al enviar un mensaje nuevo como al apretar "Reintentar".
async function sendAndRender(key, conversation, messagesContainer) {
  renderMessages(messagesContainer, conversation, { isTyping: true });

  try {
    const reply = await requestReply(key, conversation);
    conversation.push(createMessage("char", reply));
    renderMessages(messagesContainer, conversation, {});
  } catch (error) {
    console.error("[chat] Error pidiendo respuesta:", error);
    renderMessages(messagesContainer, conversation, { error });
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

  if (!form || !input || !messagesContainer) return;

  const conversation = getConversation(key, greeting);
  renderMessages(messagesContainer, conversation, {});

  form.addEventListener("submit", (event) => {
    // Sin esto, el <form> recarga la página al enviar (comportamiento nativo del navegador) y perderíamos toda la SPA.
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    conversation.push(createMessage("user", text));
    input.value = "";
    sendAndRender(key, conversation, messagesContainer);
  });

  // El botón "Reintentar" se crea recién cuando hay un error
  messagesContainer.addEventListener("click", (event) => {
    if (event.target.closest(".btn-retry")) {
      sendAndRender(key, conversation, messagesContainer);
    }
  });
}
