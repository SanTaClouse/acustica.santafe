import type { SVGProps } from "react";
import type { Producto } from "@/content/catalog";
import { shade } from "@/lib/color";

const MADERA = "#b98e62";
const MADERA_OSCURA = "#9a7450";

function hexagono(cx: number, cy: number, r: number) {
  return [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");
}

// Ilustración de cada producto (port de shape() del prototipo). La cara toma el
// color de la tela elegida; los laterales, el mismo color oscurecido.
export function ProductShape({
  forma,
  color,
  ...props
}: { forma: Producto["forma"]; color: string } & SVGProps<SVGSVGElement>) {
  const c = color;
  const e = shade(color, 0.78);
  return (
    <svg viewBox="0 0 320 200" aria-hidden="true" {...props}>
      {forma === "rect" && (
        <>
          <rect
            x="40"
            y="150"
            width="240"
            height="12"
            rx="6"
            fill="#000"
            opacity=".06"
          />
          <rect x="34" y="36" width="252" height="118" fill={e} />
          <rect x="28" y="30" width="252" height="118" fill={c} />
        </>
      )}
      {forma === "nube" && (
        <>
          <g stroke="var(--color-muted)" strokeWidth="1.2">
            <line x1="70" y1="0" x2="80" y2="74" />
            <line x1="250" y1="0" x2="240" y2="74" />
          </g>
          <path d="M40 92 L120 64 L290 72 L210 104 Z" fill={c} />
          <path d="M40 92 L210 104 L210 118 L40 106 Z" fill={e} />
          <path
            d="M210 104 L290 72 L290 86 L210 118 Z"
            fill={e}
            opacity=".85"
          />
        </>
      )}
      {forma === "trampa" && (
        <>
          <path
            d="M110 20 L210 20 L250 50 L250 190 L210 160 L110 160 Z"
            fill={e}
          />
          <path d="M110 20 L210 20 L210 160 L110 160 Z" fill={c} />
        </>
      )}
      {forma === "hex" && (
        <>
          <polygon points={hexagono(110, 72, 52)} fill={c} />
          <polygon points={hexagono(200, 72, 52)} fill={e} />
          <polygon points={hexagono(155, 150, 52)} fill={c} />
          <polygon points={hexagono(245, 150, 52)} fill={c} />
        </>
      )}
      {forma === "difusor" && (
        // Madera natural: no lleva tela.
        <>
          <rect x="60" y="20" width="200" height="160" fill={MADERA_OSCURA} />
          {[1, 4, 2, 2, 4, 1, 0].map((q, i) => (
            <rect
              key={i}
              x={64 + i * 28}
              y={24 + q * 7}
              width="24"
              height={152 - q * 7}
              fill={MADERA}
            />
          ))}
        </>
      )}
      {forma === "movil" && (
        <>
          <rect x="100" y="10" width="120" height="160" fill={c} />
          <rect x="220" y="14" width="8" height="156" fill={e} />
          <g stroke="var(--color-muted)" strokeWidth="3" strokeLinecap="round">
            <path d="M120 170 L106 192 M120 170 L140 192 M200 170 L186 192 M200 170 L220 192" />
          </g>
        </>
      )}
    </svg>
  );
}

export const COLOR_SIN_TELA = MADERA;
