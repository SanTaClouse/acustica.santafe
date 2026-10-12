// Oscurece un color #RRGGBB mezclándolo con negro (equivale a
// color-mix(in srgb, color factor, #000), que usaba el prototipo).
export function shade(hex: string, factor: number): string {
  const n = parseInt(hex.slice(1), 16);
  const canal = (desplazamiento: number) =>
    Math.round(((n >> desplazamiento) & 255) * factor)
      .toString(16)
      .padStart(2, "0");
  return `#${canal(16)}${canal(8)}${canal(0)}`;
}
