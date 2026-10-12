import { WA_DIRECT_MESSAGE, WHATSAPP } from "@/content/site";
import type { CartItem } from "./cart";

export type ConsultaForm = {
  nombre: string;
  ciudad: string;
  espacio: string;
  nota: string;
};

// Formato acordado en el HANDOFF (§4). Nombre, ciudad y detalle se omiten si están vacíos.
export function buildMessage(cart: CartItem[], form: ConsultaForm): string {
  const nombre = form.nombre.trim();
  const ciudad = form.ciudad.trim();
  const nota = form.nota.trim();
  const lineas = ["Hola, Acústica Santa Fe. Quiero pedir un presupuesto."];
  if (nombre) lineas.push(`Nombre: ${nombre}`);
  if (ciudad) lineas.push(`Ciudad: ${ciudad}`);
  lineas.push(`Tipo de espacio: ${form.espacio}`);
  if (cart.length) {
    lineas.push("", "Mi consulta:");
    for (const it of cart) {
      lineas.push(
        `• ${it.servicio ? it.nombre : `${it.qty} × ${it.nombre} (${it.detalle})`}`,
      );
    }
  }
  if (nota) lineas.push("", `Detalle: ${nota}`);
  lineas.push("", "Enviado desde acusticasantafe.com");
  return lineas.join("\n");
}

export function buildWaUrl(text: string): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}

export const WA_DIRECT_URL = buildWaUrl(WA_DIRECT_MESSAGE);
