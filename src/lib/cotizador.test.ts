import { describe, expect, it } from "vitest";
import type { Cotizador } from "@/content/catalog";
import {
  areaM2,
  cotizar,
  designItem,
  formatARS,
  type Diseno,
} from "./cotizador";

const tarifas: Cotizador = {
  espesores: [{ nombre: "50 mm", precioM2: 120000 }],
  formas: [
    { id: "rect", nombre: "Rectangular", recargo: 0 },
    { id: "hex", nombre: "Hexagonal", recargo: 15000 },
    { id: "tri", nombre: "Triangular", recargo: 15000 },
  ],
  kitTecho: null,
  recargoTelaPedido: 0,
  medidaMin: 40,
  medidaMax: 300,
};

const base: Diseno = {
  forma: "rect",
  ancho: 120,
  alto: 60,
  espesor: "50 mm",
  ubicacion: "pared",
  tela: { id: "petroleo", nombre: "Petróleo" },
};

describe("cotizador", () => {
  it("cotiza un rectangular por m² (igual que el Sheet)", () => {
    expect(cotizar(base, tarifas)).toEqual({
      porPanel: 86400,
      kitPendiente: false,
    });
  });

  it("calcula el área de hexágonos y triángulos desde el ancho", () => {
    expect(areaM2("hex", 100, 0)).toBeCloseTo(0.6495, 4);
    expect(areaM2("tri", 100, 0)).toBeCloseTo(0.433, 3);
  });

  it("suma el recargo fijo de forma y redondea a $ 100", () => {
    // 0,6495 m² × 120.000 = 77.942 + 15.000 = 92.942 → 92.900
    expect(cotizar({ ...base, forma: "hex", ancho: 100 }, tarifas)).toEqual({
      porPanel: 92900,
      kitPendiente: false,
    });
  });

  it("rechaza medidas fuera de rango", () => {
    expect(cotizar({ ...base, ancho: 39 }, tarifas)).toBeNull();
    expect(cotizar({ ...base, alto: 301 }, tarifas)).toBeNull();
    expect(cotizar({ ...base, ancho: Number.NaN }, tarifas)).toBeNull();
    // En hexágonos el alto no se usa.
    expect(cotizar({ ...base, forma: "hex", alto: 0 }, tarifas)).not.toBeNull();
  });

  it("marca el kit de techo como pendiente mientras no tenga precio", () => {
    const techo = { ...base, ubicacion: "techo" as const };
    expect(cotizar(techo, tarifas)).toEqual({
      porPanel: 86400,
      kitPendiente: true,
    });
    expect(cotizar(techo, { ...tarifas, kitTecho: 20000 })).toEqual({
      porPanel: 106400,
      kitPendiente: false,
    });
  });

  it("arma el ítem de la consulta con el detalle y el precio estimado", () => {
    expect(designItem({ ...base, ancho: 60, alto: 120 }, tarifas, 3)).toEqual({
      key: "diseno|Rectangular · 60 × 120 cm · 50 mm · Tela petróleo · Pared, vertical · $ 86.400 c/u estimado",
      nombre: "Panel a medida",
      detalle:
        "Rectangular · 60 × 120 cm · 50 mm · Tela petróleo · Pared, vertical · $ 86.400 c/u estimado",
      qty: 3,
    });
    expect(designItem({ ...base, ancho: 10 }, tarifas, 1)).toBeNull();
  });

  it("formatea pesos argentinos sin decimales", () => {
    expect(formatARS(1234567)).toBe("$ 1.234.567");
  });
});
