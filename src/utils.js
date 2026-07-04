// Funciones de transformación / utilitarias puras: no tocan el DOM ni
// dependen del navegador. Por eso viven separadas de chat.js -son las
// más fáciles (y más importantes) de testear con Vitest, ya que no hace
// falta simular un navegador para probarlas.

/**
 * Escapa caracteres HTML especiales antes de insertar texto con innerHTML.
 * Por qué importa: los mensajes vienen de lo que escribe el usuario (y más
 * adelante de la respuesta de Gemini). Si los insertamos tal cual con
 * innerHTML, alguien podría escribir algo como "<img src=x onerror=...>"
 * y ejecutar código en la página en vez de mostrarse como texto plano.
 */
export function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(text).replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Crea un objeto de mensaje con una forma consistente ({ id, role, text }).
 * Centralizarlo acá evita que cada lugar del código arme el objeto a mano
 * y se olvide algún campo - por ejemplo el id, que sirve para llevar
 * cuenta de mensajes sin depender del índice del array.
 */
export function createMessage(role, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
  };
}
