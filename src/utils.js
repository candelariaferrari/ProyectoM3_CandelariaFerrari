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

// Crea un objeto de mensaje con una forma consistente ({ id, role, text, timestamp }).
export function createMessage(role, text) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    timestamp: Date.now(),
  };
}

// Formatea un timestamp (ms desde epoch) como "HH:MM" para mostrar en cada burbuja de mensaje.
export function formatTime(timestamp) {
  if (!timestamp) return "";
  // hour12: false para forzar formato 24hs (HH:MM); sin esto, algunos
  // entornos devuelven "02:05 p. m." en vez de "14:05".
  return new Date(timestamp).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
}
