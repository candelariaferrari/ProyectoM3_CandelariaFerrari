// Persistencia del historial de chat en localStorage: una clave por
// personaje, así cada charla se guarda y se carga de forma independiente.
// Todo envuelto en try/catch porque localStorage puede fallar y en el peor caso, simplemente no persiste.

const STORAGE_PREFIX = "chat-emociones:history:";

// Arma la clave completa de localStorage para un personaje.
function storageKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

// Devuelve el historial guardado de ese personaje, o null si no hay nada, o si algo salió mal leyéndolo.
export function loadConversation(key) {
  try {
    const raw = localStorage.getItem(storageKey(key));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error("[storage] No se pudo leer el historial guardado:", error);
    return null;
  }
}

// Guarda la conversación completa de ese personaje en localStorage.
export function saveConversation(key, conversation) {
  try {
    localStorage.setItem(storageKey(key), JSON.stringify(conversation));
  } catch (error) {
    console.error("[storage] No se pudo guardar el historial:", error);
  }
}

// Borra del localStorage la conversación guardada de ese personaje.
export function clearConversation(key) {
  try {
    localStorage.removeItem(storageKey(key));
  } catch (error) {
    console.error("[storage] No se pudo borrar el historial guardado:", error);
  }
}

// Hay "charla guardada" cuando existe más que el saludo inicial (length > 1),
export function hasSavedConversation(key) {
  const saved = loadConversation(key);
  return Array.isArray(saved) && saved.length > 1;
}
