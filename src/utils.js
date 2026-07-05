// Funciones de transformación / utilitarias puras: no tocan el DOM ni dependen del navegador. 

// Escapa caracteres HTML especiales antes de insertar texto con innerHTML.
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

// Crea un objeto de mensaje con una forma consistente ({ id, role, text }).
export function createMessage(role, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
  };
}
