// Tests de las funciones puras que arman el pedido al SDK de Gemini y clasifican errores: no dependen del DOM ni de una llamada real a la API.
import { describe, it, expect } from "vitest";
import { toGeminiContents, isRateLimitError } from "../api/functions.js";
import { errorInfoFor } from "../src/chat.js";

describe("toGeminiContents (mapeo del historial interno al formato del SDK)", () => {
  it('convierte role "user" y "assistant" a "user" y "model"', () => {
    const messages = [
      { role: "user", text: "Hola" },
      { role: "assistant", text: "¡Hola! ¿Cómo estás?" },
    ];

    expect(toGeminiContents(messages)).toEqual([
      { role: "user", parts: [{ text: "Hola" }] },
      { role: "model", parts: [{ text: "¡Hola! ¿Cómo estás?" }] },
    ]);
  });

  it("ignora mensajes con un role que no sea user/assistant", () => {
    const messages = [{ role: "system", text: "no debería aparecer" }, { role: "user", text: "hola" }];

    expect(toGeminiContents(messages)).toEqual([{ role: "user", parts: [{ text: "hola" }] }]);
  });

  it("devuelve un array vacío si no hay mensajes", () => {
    expect(toGeminiContents([])).toEqual([]);
  });
});

describe("isRateLimitError (detección de error de cuota del SDK)", () => {
  it("detecta un error con status 429", () => {
    const error = new Error("Too many requests");
    error.status = 429;

    expect(isRateLimitError(error)).toBe(true);
  });

  it('detecta un error cuyo mensaje menciona "quota"', () => {
    expect(isRateLimitError(new Error("Quota exceeded for this project"))).toBe(true);
  });

  it("no marca como rate-limit un error de otro tipo", () => {
    expect(isRateLimitError(new Error("Internal error"))).toBe(false);
  });
});

describe("errorInfoFor (mapeo de errores a la tarjeta de error del chat)", () => {
  it("clasifica un status 429 como rate-limit", () => {
    const error = new Error("Too many requests");
    error.status = 429;

    expect(errorInfoFor(error).variant).toBe("rate-limit");
  });

  it("clasifica cualquier otro status HTTP como error de servidor", () => {
    const error = new Error("Internal error");
    error.status = 500;

    expect(errorInfoFor(error).variant).toBe("server");
  });

  it("clasifica un error sin status (fetch que nunca respondió) como error de red", () => {
    const error = new Error("Failed to fetch");

    expect(errorInfoFor(error).variant).toBe("network");
  });
});
