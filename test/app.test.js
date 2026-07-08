// Tests de las funciones puras que procesan la respuesta de Gemini y clasifican errores: no dependen del DOM ni de una llamada real a la API.
import { describe, it, expect } from "vitest";
import { extractText } from "../api/functions.js";
import { errorInfoFor } from "../src/chat.js";

describe("extractText (parseo de la respuesta de Gemini)", () => {
  // Forma real que devuelve la Interactions API de Gemini cuando todo sale bien: steps[] con un model_output que contiene un bloque de texto.
  it("extrae el texto de una respuesta válida de Gemini", () => {
    const data = {
      steps: [
        {
          type: "model_output",
          content: [{ type: "text", text: "  ¡Hola! ¿Cómo estás?  " }],
        },
      ],
    };

    // si se recorta el espacio en blanco (.trim()).
    expect(extractText(data)).toBe("¡Hola! ¿Cómo estás?");
  });

  it('devuelve "" si la respuesta no trae ningún step de tipo model_output', () => {
    const data = { steps: [{ type: "thought", content: [] }] };
    expect(extractText(data)).toBe("");
  });

  it('devuelve "" si "steps" directamente no viene en la respuesta', () => {
    // Cubre el caso de una respuesta inesperada/rota de la API.
    expect(extractText({})).toBe("");
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
