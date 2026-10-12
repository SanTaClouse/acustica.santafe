import { describe, expect, it } from "vitest";
import { serviceItem, type CartItem } from "./cart";
import { buildMessage, buildWaUrl, WA_DIRECT_URL } from "./whatsapp";

const cart: CartItem[] = [
  {
    key: "panel|x",
    nombre: "Panel absorbente",
    detalle: "120 × 60 cm · 100 mm · Tela grafito",
    qty: 4,
  },
  serviceItem("asesoramiento", "Asesoramiento acústico"),
];

describe("buildMessage", () => {
  it("respeta el formato del HANDOFF carácter por carácter", () => {
    const msg = buildMessage(cart, {
      nombre: "Ana",
      ciudad: "Rosario",
      espacio: "Sala de streaming",
      nota: "Sala de 4 × 5 m",
    });
    expect(msg).toBe(
      [
        "Hola, Acústica Santa Fe. Quiero pedir un presupuesto.",
        "Nombre: Ana",
        "Ciudad: Rosario",
        "Tipo de espacio: Sala de streaming",
        "",
        "Mi consulta:",
        "• 4 × Panel absorbente (120 × 60 cm · 100 mm · Tela grafito)",
        "• Asesoramiento acústico",
        "",
        "Detalle: Sala de 4 × 5 m",
        "",
        "Enviado desde acusticasantafe.com",
      ].join("\n"),
    );
  });

  it("omite nombre, ciudad, consulta y detalle vacíos", () => {
    const msg = buildMessage([], {
      nombre: "  ",
      ciudad: "",
      espacio: "Otro",
      nota: "",
    });
    expect(msg).toBe(
      [
        "Hola, Acústica Santa Fe. Quiero pedir un presupuesto.",
        "Tipo de espacio: Otro",
        "",
        "Enviado desde acusticasantafe.com",
      ].join("\n"),
    );
  });
});

describe("enlaces de WhatsApp", () => {
  it("usa el número con el 9 y codifica el texto", () => {
    expect(buildWaUrl("Hola & chau")).toBe(
      "https://wa.me/5493424639480?text=Hola%20%26%20chau",
    );
  });

  it("el enlace directo lleva el mensaje predefinido", () => {
    expect(WA_DIRECT_URL).toBe(
      "https://wa.me/5493424639480?text=Hola%2C%20vengo%20de%20la%20web.",
    );
  });
});
