// Lógica específica del chat: historial en memoria, envío de mensajes,
// estado de "escribiendo..." y scroll automático. Separado de chatbox.js
// (que solo arma el HTML de la vista) y de router.js (que solo decide qué
// vista mostrar), siguiendo la recomendación de la consigna de separar la
// lógica de chat del routing.

import { escapeHtml, createMessage } from "./utils.js";

// Historial en memoria por personaje. Vive solo mientras la pestaña esté
// abierta -si se recarga la página se pierde-, tal como pide la consigna
// para el alcance mínimo. La key es el "key" del personaje (joy, anger...).
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

function renderMessages(container, conversation, isTyping) {
  const bubbles = conversation.map(messageBubbleHtml).join("");
  container.innerHTML = bubbles + (isTyping ? typingBubbleHtml() : "");
  // Scroll automático al último mensaje: sin esto, en conversaciones largas
  // el usuario tendría que bajar manualmente cada vez que llega una respuesta.
  container.scrollTop = container.scrollHeight;
}

// Respuestas de relleno SOLO para probar la interfaz sin depender todavía
// de Gemini (paso 4 de la consigna). Esto se reemplaza por un fetch real a
// /api/functions en el paso 5-7, sin tocar el resto de esta lógica.
const FAKE_REPLIES = {
  joy: "¡Eso que contás también tiene su lado bueno! 🌟",
  anger: "¡Tenés todo el derecho a sentirte así! Decilo sin miedo.",
  sadness: "Está bien sentir eso. Estoy acá, tomate tu tiempo.",
  anxiety: "Ok, respiremos. Pensemos juntos un paso a la vez.",
};

function fakeReplyFor(key) {
  return FAKE_REPLIES[key] || "Gracias por contarme.";
}

/**
 * Engancha el formulario de chat ya montado en el DOM para un personaje.
 * Se llama una vez, después de que chatbox.js insertó el HTML en #app.
 *
 * @param {string} key - clave del personaje (joy, anger, sadness, anxiety)
 * @param {string} greeting - saludo inicial de ese personaje
 */
export function initChat(key, greeting) {
  const form = document.getElementById("chatComposer");
  const input = document.getElementById("chatInput");
  const messagesContainer = document.getElementById("chatMessages");

  if (!form || !input || !messagesContainer) return;

  const conversation = getConversation(key, greeting);
  renderMessages(messagesContainer, conversation, false);

  form.addEventListener("submit", (event) => {
    // Sin esto, el <form> recarga la página al enviar (comportamiento
    // nativo del navegador) y perderíamos toda la SPA.
    event.preventDefault();

    const text = input.value.trim();
    if (!text) return;

    conversation.push(createMessage("user", text));
    input.value = "";
    renderMessages(messagesContainer, conversation, true);

    // TODO(paso 5-7): reemplazar este setTimeout por un fetch a
    // /api/functions que llame a Gemini con el historial completo.
    window.setTimeout(() => {
      conversation.push(createMessage("char", fakeReplyFor(key)));
      renderMessages(messagesContainer, conversation, false);
    }, 900);
  });
}
