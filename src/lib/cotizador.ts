// Lógica pura del cotizador «Diseñá tu panel». Las tarifas vienen de
// products.json (copia de la pestaña «Tarifas cotizador» del Sheet).
import type { Cotizador } from "@/content/catalog";
import type { CartItem } from "./cart";

export type Forma = Cotizador["formas"][number]["id"];
export type Ubicacion = "pared" | "techo";

export type Diseno = {
  forma: Forma;
  ancho: number; // cm; en hexágonos y triángulos, el ancho total de la pieza
  alto: number; // cm; solo cuenta en la forma rectangular
  espesor: string;
  ubicacion: Ubicacion;
  tela: { id: string; nombre: string };
};

export type Cotizacion = {
  porPanel: number;
  kitPendiente: boolean; // va al techo y el kit todavía no tiene precio
};

// Área de la cara en m². Hexágono regular apoyado sobre un vértice (ancho =
// 2 × lado) y triángulo equilátero (ancho = lado).
export function areaM2(forma: Forma, ancho: number, alto: number): number {
  const cm2 =
    forma === "hex"
      ? ((3 * Math.sqrt(3)) / 8) * ancho ** 2
      : forma === "tri"
        ? (Math.sqrt(3) / 4) * ancho ** 2
        : ancho * alto;
  return cm2 / 10_000;
}

// Alto real de la pieza, para dibujarla: en hexágonos y triángulos sale del ancho.
export function altoDe(forma: Forma, ancho: number, alto: number): number {
  return forma === "rect" ? alto : (Math.sqrt(3) / 2) * ancho;
}

export function medidaValida(cm: number, c: Cotizador): boolean {
  return Number.isFinite(cm) && cm >= c.medidaMin && cm <= c.medidaMax;
}

export function disenoValido(d: Diseno, c: Cotizador): boolean {
  return (
    medidaValida(d.ancho, c) &&
    (d.forma !== "rect" || medidaValida(d.alto, c)) &&
    c.espesores.some((e) => e.nombre === d.espesor)
  );
}

const redondear = (n: number) => Math.round(n / 100) * 100;

export function cotizar(d: Diseno, c: Cotizador): Cotizacion | null {
  if (!disenoValido(d, c)) return null;
  const espesor = c.espesores.find((e) => e.nombre === d.espesor)!;
  const forma = c.formas.find((f) => f.id === d.forma);
  const tela = d.tela.id === "otro" ? 1 + c.recargoTelaPedido : 1;
  const techo = d.ubicacion === "techo";
  const kit = techo && c.kitTecho !== null ? c.kitTecho : 0;
  return {
    porPanel: redondear(
      areaM2(d.forma, d.ancho, d.alto) * espesor.precioM2 * tela +
        (forma?.recargo ?? 0) +
        kit,
    ),
    kitPendiente: techo && c.kitTecho === null,
  };
}

const ARS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// "$ 86.400", con espacio común (Intl usa uno de no separación).
export function formatARS(n: number): string {
  return ARS.format(n).replace(/\s/g, " ");
}

export function medidasTexto(d: Diseno): string {
  return d.forma === "rect"
    ? `${d.ancho} × ${d.alto} cm`
    : `${d.ancho} cm de ancho`;
}

function ubicacionTexto(d: Diseno, cot: Cotizacion): string {
  if (d.ubicacion === "techo")
    return cot.kitPendiente
      ? "Techo (kit a confirmar)"
      : "Techo, con kit de suspensión";
  if (d.forma !== "rect") return "Pared";
  return d.alto > d.ancho ? "Pared, vertical" : "Pared, horizontal";
}

// Ítem de «Mi consulta»: el detalle viaja tal cual en el mensaje de WhatsApp.
export function designItem(
  d: Diseno,
  c: Cotizador,
  qty: number,
): CartItem | null {
  const cot = cotizar(d, c);
  if (!cot) return null;
  const forma = c.formas.find((f) => f.id === d.forma)?.nombre ?? d.forma;
  const detalle = [
    forma,
    medidasTexto(d),
    d.espesor,
    `Tela ${d.tela.nombre.toLowerCase()}`,
    ubicacionTexto(d, cot),
    `${formatARS(cot.porPanel)} c/u estimado`,
  ].join(" · ");
  return { key: `diseno|${detalle}`, nombre: "Panel a medida", detalle, qty };
}
