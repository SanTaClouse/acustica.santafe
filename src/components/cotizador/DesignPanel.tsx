"use client";

import { useId, useState } from "react";
import type { Cotizador, Tela } from "@/content/catalog";
import { TELA_POR_DEFECTO } from "@/content/site";
import { shade } from "@/lib/color";
import { cn } from "@/lib/cn";
import {
  altoDe,
  cotizar,
  designItem,
  formatARS,
  medidasTexto,
  medidaValida,
  type Diseno,
  type Forma,
  type Ubicacion,
} from "@/lib/cotizador";
import { buttonClass } from "@/components/ui/button";
import { controlClass, labelClass } from "@/components/ui/field";
import { QtyControl } from "@/components/ui/QtyControl";
import { cart } from "@/components/cart/cart-store";

const ARCOIRIS =
  "bg-[conic-gradient(#d9a0a0,#d8cf9b,#9fc4a1,#9db7d4,#c2a6d2,#d9a0a0)]";
const pillClass =
  "rounded-full border border-line px-4.5 py-2.75 text-sm leading-none font-medium text-muted aria-pressed:border-fg aria-pressed:text-fg";

const UBICACIONES: [Ubicacion, string][] = [
  ["pared", "Pared"],
  ["techo", "Techo"],
];

// Vista previa a escala: 300 cm ocupan 200 px. La silueta de 1,70 m da la
// referencia de tamaño.
const ESCALA = 200 / 300;
const PERSONA = 170 * ESCALA;

function Preview({
  forma,
  ancho,
  alto,
  ubicacion,
  color,
}: {
  forma: Forma;
  ancho: number;
  alto: number;
  ubicacion: Ubicacion;
  color: string;
}) {
  const w = ancho * ESCALA;
  const h = altoDe(forma, ancho, alto) * ESCALA;
  const cx = 245;
  const piso = 248;
  const techo = ubicacion === "techo";
  // En pared la pieza queda centrada a 1,50 m del piso (o apoyada si no entra);
  // en techo cuelga 30 cm debajo de la losa.
  const top = techo
    ? 44
    : Math.max(12, Math.min(piso - 150 * ESCALA - h / 2, piso - h));
  const x = cx - w / 2;
  const lateral = shade(color, 0.78);

  const puntos =
    forma === "hex"
      ? [
          [x, top + h / 2],
          [x + w / 4, top],
          [x + (3 * w) / 4, top],
          [x + w, top + h / 2],
          [x + (3 * w) / 4, top + h],
          [x + w / 4, top + h],
        ]
      : forma === "tri"
        ? [
            [cx, top],
            [x + w, top + h],
            [x, top + h],
          ]
        : [
            [x, top],
            [x + w, top],
            [x + w, top + h],
            [x, top + h],
          ];
  const poly = (dx: number) =>
    puntos
      .map(([px, py]) => `${(px + dx).toFixed(1)},${(py + dx).toFixed(1)}`)
      .join(" ");

  return (
    <svg viewBox="0 0 400 260" aria-hidden="true" className="h-auto w-full">
      {techo ? (
        <>
          <line
            x1="0"
            y1="14"
            x2="400"
            y2="14"
            stroke="var(--color-line)"
            strokeWidth="2"
          />
          <g stroke="var(--color-muted)" strokeWidth="1">
            <line
              x1={x + w * 0.2}
              y1="14"
              x2={x + w * 0.2}
              y2={top + (forma === "tri" ? h * 0.4 : 0)}
            />
            <line
              x1={x + w * 0.8}
              y1="14"
              x2={x + w * 0.8}
              y2={top + (forma === "tri" ? h * 0.4 : 0)}
            />
          </g>
        </>
      ) : null}
      <line
        x1="0"
        y1={piso}
        x2="400"
        y2={piso}
        stroke="var(--color-line)"
        strokeWidth="2"
      />
      <polygon points={poly(4)} fill={lateral} />
      <polygon points={poly(0)} fill={color} />
      <g fill="var(--color-line)">
        <circle cx="48" cy={piso - PERSONA + 9} r="9" />
        <rect
          x="38"
          y={piso - PERSONA + 20}
          width="20"
          height={PERSONA - 20}
          rx="10"
        />
      </g>
      <text
        x="48"
        y={piso + 10}
        textAnchor="middle"
        fontSize="9"
        fill="var(--color-muted)"
      >
        1,70 m
      </text>
    </svg>
  );
}

export function DesignPanel({
  tarifas,
  telas,
}: {
  tarifas: Cotizador;
  telas: Tela[];
}) {
  const uid = useId();
  const [forma, setForma] = useState<Forma>("rect");
  const [ancho, setAncho] = useState("120");
  const [alto, setAlto] = useState("60");
  const [espesor, setEspesor] = useState(
    (tarifas.espesores.find((e) => e.porDefecto) ?? tarifas.espesores[0])
      .nombre,
  );
  const [ubicacion, setUbicacion] = useState<Ubicacion>("pared");
  const [telaId, setTelaId] = useState(TELA_POR_DEFECTO);
  const [qty, setQty] = useState(1);

  const tela = telas.find((t) => t.id === telaId) ?? telas[0];
  const diseno: Diseno = {
    forma,
    ancho: Number(ancho),
    alto: Number(alto),
    espesor,
    ubicacion,
    tela,
  };
  const cot = cotizar(diseno, tarifas);
  const rango = `Entre ${tarifas.medidaMin} y ${tarifas.medidaMax} cm.`;
  const anchoMal = !medidaValida(diseno.ancho, tarifas);
  const altoMal = forma === "rect" && !medidaValida(diseno.alto, tarifas);
  const color = tela.id === "otro" ? "#B9BBBC" : tela.hex;

  const medida = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    mal: boolean,
  ) => (
    <div className="min-w-0">
      <label htmlFor={`${uid}-${id}`} className={labelClass}>
        {label}
      </label>
      <input
        id={`${uid}-${id}`}
        type="number"
        inputMode="numeric"
        min={tarifas.medidaMin}
        max={tarifas.medidaMax}
        step={1}
        value={value}
        onChange={(e) => set(e.target.value)}
        aria-invalid={mal}
        aria-describedby={`${uid}-rango`}
        className={cn(controlClass, mal && "border-[#b3261e]")}
      />
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] [&>*]:min-w-0">
      <div className="rounded-card bg-surface p-[clamp(16px,3vw,32px)] lg:sticky lg:top-24 lg:self-start">
        <Preview
          forma={forma}
          ancho={anchoMal ? 120 : diseno.ancho}
          alto={altoMal ? 60 : diseno.alto}
          ubicacion={ubicacion}
          color={color}
        />
        <p className="mt-4 text-center text-small text-muted">
          {cot
            ? `${tarifas.formas.find((f) => f.id === forma)?.nombre} · ${medidasTexto(diseno)} · ${tela.nombre}`
            : "Revisá las medidas para ver tu panel."}
        </p>
      </div>

      <div className="grid gap-6">
        <div role="group" aria-labelledby={`${uid}-forma`}>
          <span id={`${uid}-forma`} className={labelClass}>
            Forma
          </span>
          <div className="flex flex-wrap gap-2">
            {tarifas.formas.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={f.id === forma}
                onClick={() => setForma(f.id)}
                className={pillClass}
              >
                {f.nombre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
            {medida("ancho", "Ancho (cm)", ancho, setAncho, anchoMal)}
            {forma === "rect" ? (
              <>
                {medida("alto", "Alto (cm)", alto, setAlto, altoMal)}
                <button
                  type="button"
                  onClick={() => {
                    setAncho(alto);
                    setAlto(ancho);
                  }}
                  className={buttonClass({ variant: "ghost", size: "sm" })}
                >
                  Girar
                </button>
              </>
            ) : null}
          </div>
          <p
            id={`${uid}-rango`}
            className={cn(
              "mt-2 text-xs",
              anchoMal || altoMal ? "text-[#b3261e]" : "text-muted",
            )}
          >
            {forma === "rect"
              ? `${rango} Se cuelga vertical u horizontal: «Girar» cambia la orientación.`
              : `${rango} Es el ancho total de la pieza.`}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="min-w-0">
            <label htmlFor={`${uid}-espesor`} className={labelClass}>
              Espesor
            </label>
            <select
              id={`${uid}-espesor`}
              value={espesor}
              onChange={(e) => setEspesor(e.target.value)}
              className={controlClass}
            >
              {tarifas.espesores.map((e) => (
                <option key={e.nombre}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div
            role="group"
            aria-labelledby={`${uid}-ubicacion`}
            className="min-w-0"
          >
            <span id={`${uid}-ubicacion`} className={labelClass}>
              Ubicación
            </span>
            <div className="flex gap-2">
              {UBICACIONES.map(([id, nombre]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={id === ubicacion}
                  onClick={() => setUbicacion(id)}
                  className={pillClass}
                >
                  {nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div role="group" aria-labelledby={`${uid}-tela`}>
          <span id={`${uid}-tela`} className={labelClass}>
            Tela · {tela.nombre}
          </span>
          <div className="flex flex-wrap gap-2">
            {telas.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-label={t.nombre}
                aria-pressed={t.id === telaId}
                onClick={() => setTelaId(t.id)}
                style={t.id === "otro" ? undefined : { background: t.hex }}
                className={cn(
                  "size-7.5 rounded-full border border-line aria-pressed:shadow-[0_0_0_2px_var(--color-bg),0_0_0_4px_var(--color-fg)]",
                  t.id === "otro" && ARCOIRIS,
                )}
              />
            ))}
          </div>
        </div>

        <div className="rounded-card border border-line p-5" aria-live="polite">
          <div className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
            Precio estimado
          </div>
          {cot ? (
            <>
              <div className="mt-2 text-[34px] font-light tracking-[-0.02em] tabular-nums">
                {formatARS(cot.porPanel * qty)}
              </div>
              <p className="mt-1 text-small text-muted">
                {qty > 1
                  ? `${qty} paneles de ${formatARS(cot.porPanel)}. `
                  : ""}
                {ubicacion === "techo"
                  ? cot.kitPendiente
                    ? "El kit de suspensión para techo se suma aparte: te lo confirmamos. "
                    : "Incluye el kit de suspensión; te recomendamos que lo instale un profesional. "
                  : ""}
                No incluye envío ni instalación. Te confirmamos el precio final
                por WhatsApp.
              </p>
            </>
          ) : (
            <p className="mt-2 text-small text-muted">
              Completá medidas válidas para ver el precio.
            </p>
          )}
          <div className="mt-5 flex items-center gap-2.5">
            <QtyControl
              value={qty}
              onChange={(d) => setQty((q) => Math.max(1, q + d))}
            />
            <button
              type="button"
              disabled={!cot}
              onClick={() => {
                const item = designItem(diseno, tarifas, qty);
                if (item) cart.add(item);
              }}
              className={buttonClass({
                className: "flex-1 justify-center disabled:opacity-40",
              })}
            >
              Agregar a mi consulta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
