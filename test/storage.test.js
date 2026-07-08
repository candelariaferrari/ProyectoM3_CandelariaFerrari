// Tests de storage.js (persistencia del historial en localStorage), con un mock de localStorage ya que el entorno de test es Node.
import { describe, it, expect, beforeEach, vi } from "vitest";
import { loadConversation, saveConversation, clearConversation, hasSavedConversation } from "../src/storage.js";

//depende de localStorage, lo mockeamos: armamos un objeto
// falso con las mismas 3 funciones que usa storage.js guardando todo 
// en un Map en memoria en vez de en un navegador real. 
function createLocalStorageMock() {
  let store = new Map();
  return {
    getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
    setItem: vi.fn((key, value) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key) => {
      store.delete(key);
    }),
  };
}

describe("storage.js (persistencia del historial en localStorage)", () => {
  // vi.stubGlobal reemplaza el global.localStorage real por nuestro mock, antes de cada test, para que cada test arranque limpio.
  beforeEach(() => {
    vi.stubGlobal("localStorage", createLocalStorageMock());
  });

  it("guarda una conversación y después la lee igual", () => {
    const conversation = [{ id: "1", role: "char", text: "Hola" }];
    saveConversation("joy", conversation);

    expect(loadConversation("joy")).toEqual(conversation);
  });

  it("devuelve null si no hay nada guardado para ese personaje", () => {
    expect(loadConversation("anger")).toBeNull();
  });

  it("borra la conversación guardada", () => {
    saveConversation("sadness", [{ id: "1", role: "char", text: "Hola" }]);
    clearConversation("sadness");

    expect(loadConversation("sadness")).toBeNull();
  });

  it('hasSavedConversation es false cuando solo está el saludo inicial (1 mensaje)', () => {
    saveConversation("anxiety", [{ id: "1", role: "char", text: "saludo" }]);

    expect(hasSavedConversation("anxiety")).toBe(false);
  });

  it("hasSavedConversation es true si ya se habló más allá del saludo", () => {
    saveConversation("anxiety", [
      { id: "1", role: "char", text: "saludo" },
      { id: "2", role: "user", text: "hola" },
    ]);

    expect(hasSavedConversation("anxiety")).toBe(true);
  });

  it("guarda con la clave con el prefijo correcto (mismo prefijo que usa chat.js)", () => {
    saveConversation("joy", []);

    expect(localStorage.setItem).toHaveBeenCalledWith("chat-emociones:history:joy", "[]");
  });

  it("no rompe si localStorage.getItem tira un error (ej: modo privado)", () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(() => {
        throw new Error("localStorage deshabilitado");
      }),
    });

    expect(() => loadConversation("joy")).not.toThrow();
    expect(loadConversation("joy")).toBeNull();
  });
});
