// Preferencia de modo claro/oscuro para el "chrome" neutro de Home y About
// (la vista de Chat no cambia: sus colores son de cada personaje, no
// neutros. Se guarda en localStorage
// para que la elección se mantenga entre visitas.

const THEME_KEY = "chat-emociones:theme";
export function applyBodyTheme() {
  try {
    document.body.dataset.theme = getTheme();
  } catch (error) {
    console.error("[theme] No se pudo aplicar el tema al body:", error);
  }
}



export function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch (error) {
    console.error("[theme] No se pudo leer el modo guardado:", error);
    return "dark";
  }
}

function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("[theme] No se pudo guardar el modo:", error);
  }
}

// Cambia el modo, lo persiste, y devuelve el nuevo valor.
export function toggleTheme() {
  const next = getTheme() === "light" ? "dark" : "light";
  setTheme(next);
  document.body.dataset.theme = next;
  return next;
}
