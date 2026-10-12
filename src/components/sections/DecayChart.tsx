// Caída de 60 dB antes y después del tratamiento (RT60), en segundos.
// Eje x: 0 a ~1,6 s; eje y: 0 a −60 dB. Mismo dibujo que el prototipo.
const X0 = 56;
const X_MAX = 540;
const PX_POR_SEG = (510 - X0) / 1.5;
const Y_TOP = 20;
const Y_BASE = 250;

const x = (seg: number) => Math.min(X_MAX, X0 + seg * PX_POR_SEG);
const fmt = (seg: number) =>
  seg.toLocaleString("es-AR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });

export function DecayChart({
  antes,
  despues,
}: {
  antes: number;
  despues: number;
}) {
  return (
    <svg
      viewBox="0 0 560 300"
      role="img"
      aria-label={`Gráfico: el decaimiento del sonido pasa de ${fmt(antes)} segundos a ${fmt(despues)} segundos`}
      className="block h-auto w-full"
    >
      <g stroke="var(--color-line)" strokeWidth="1">
        <line x1={X0} y1={Y_TOP} x2={X0} y2={Y_BASE} />
        <line x1={X0} y1={Y_BASE} x2={X_MAX} y2={Y_BASE} />
        <line x1={X0} y1="77.5" x2={X_MAX} y2="77.5" />
        <line x1={X0} y1="135" x2={X_MAX} y2="135" />
        <line x1={X0} y1="192.5" x2={X_MAX} y2="192.5" />
      </g>
      <g fontSize="12" fill="var(--color-muted)">
        <text x="48" y="24" textAnchor="end">
          0 dB
        </text>
        <text x="48" y="139" textAnchor="end">
          −30
        </text>
        <text x="48" y="254" textAnchor="end">
          −60
        </text>
        <text x={X0} y="274">
          0 s
        </text>
        <text x={x(0.5)} y="274" textAnchor="middle">
          0,5 s
        </text>
        <text x={x(1)} y="274" textAnchor="middle">
          1,0 s
        </text>
        <text x={x(1.5)} y="274" textAnchor="middle">
          1,5 s
        </text>
      </g>
      <path
        d={`M${X0} ${Y_TOP} L${x(antes)} ${Y_BASE}`}
        stroke="var(--color-muted)"
        strokeWidth="2"
        strokeDasharray="2 7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${X0} ${Y_TOP} L${x(despues)} ${Y_BASE} L${X_MAX} ${Y_BASE}`}
        stroke="var(--color-accent)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <g fontSize="13">
        <text x={x(antes) - 80} y="160" fill="var(--color-muted)">
          Antes · {fmt(antes)} s
        </text>
        <text
          x={x(despues) + 13}
          y="236"
          fill="var(--color-accent)"
          fontWeight="600"
        >
          Después · {fmt(despues)} s
        </text>
      </g>
    </svg>
  );
}
