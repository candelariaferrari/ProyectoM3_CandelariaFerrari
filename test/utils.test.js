// Tests de las funciones utilitarias puras (escapeHtml, createMessage) que se reutilizan en toda la app.
import { describe, it, expect } from "vitest";
import { escapeHtml, createMessage } from "../src/utils.js";

describe("escapeHtml", () => {
  it("escapa los 5 caracteres especiales de HTML", () => {
    const input = `<script>alert("hola" & 'chau')</script>`;
    const result = escapeHtml(input);

    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
    expect(result).toBe(
      "&lt;script&gt;alert(&quot;hola&quot; &amp; &#39;chau&#39;)&lt;/script&gt;"
    );
  });

  it("no modifica un texto que no tiene caracteres especiales", () => {
    expect(escapeHtml("hola, como estas?")).toBe("hola, como estas?");
  });

  it("convierte a string cualquier valor que no sea string (ej: number)", () => {
    expect(escapeHtml(123)).toBe("123");
  });
});

describe("createMessage", () => {
  it("crea un mensaje con la forma { id, role, text }", () => {
    const message = createMessage("user", "hola");

    expect(message).toHaveProperty("id");
    expect(message.role).toBe("user");
    expect(message.text).toBe("hola");
  });

  it("genera un id distinto en cada llamada, incluso con el mismo texto", () => {
    const a = createMessage("assistant", "hola");
    const b = createMessage("assistant", "hola");

    expect(a.id).not.toBe(b.id);
  });
});
