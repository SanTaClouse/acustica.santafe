"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { Producto, Tela } from "@/content/catalog";
import { TELA_POR_DEFECTO } from "@/content/site";
import { productItem } from "@/lib/cart";
import { cn } from "@/lib/cn";
import { buttonClass } from "@/components/ui/button";
import { controlClass, labelClass } from "@/components/ui/field";
import { QtyControl } from "@/components/ui/QtyControl";
import { cart } from "@/components/cart/cart-store";
import { COLOR_SIN_TELA, ProductShape } from "./ProductShape";

const ARCOIRIS =
  "bg-[conic-gradient(#d9a0a0,#d8cf9b,#9fc4a1,#9db7d4,#c2a6d2,#d9a0a0)]";

export function ProductCard({
  producto: p,
  categoria,
  telas,
  hidden,
}: {
  producto: Producto;
  categoria: string;
  telas: Tela[];
  hidden: boolean;
}) {
  const uid = useId();
  const [medida, setMedida] = useState(p.medidas[0]);
  const [espesor, setEspesor] = useState(p.espesores[0] ?? "");
  const [telaId, setTelaId] = useState(TELA_POR_DEFECTO);
  const [qty, setQty] = useState(1);

  const tela = p.tela ? (telas.find((t) => t.id === telaId) ?? null) : null;
  // Foto real si existe (una general o una por tela); si no, la ilustración.
  const foto = typeof p.imagen === "string" ? p.imagen : p.imagen?.[telaId];

  return (
    <article hidden={hidden} className="flex min-w-0 flex-col gap-3.5">
      <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-card bg-surface">
        {foto ? (
          <>
            <Image
              src={foto}
              alt={p.nombre}
              fill
              sizes="(min-width: 981px) 368px, (min-width: 721px) 50vw, 100vw"
              className="object-cover"
            />
            {/* La foto muestra un color de ejemplo; la pastilla, la tela elegida. */}
            {tela && (
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/90 py-1.5 pr-3 pl-1.5 text-xs font-medium text-[#1d1f21] backdrop-blur-sm"
              >
                <span
                  className={cn(
                    "size-5 rounded-full border border-black/10",
                    tela.id === "otro" && ARCOIRIS,
                  )}
                  style={
                    tela.id === "otro" ? undefined : { background: tela.hex }
                  }
                />
                {tela.nombre}
              </span>
            )}
          </>
        ) : (
          <ProductShape
            forma={p.forma}
            color={tela?.hex ?? COLOR_SIN_TELA}
            className="h-auto w-[72%] overflow-visible"
          />
        )}
      </div>
      <div className="flex justify-between gap-3 text-xs font-medium tracking-[0.18em] text-muted uppercase">
        <span>{categoria}</span>
        <span>{p.fabricado ? "Fabricación propia" : "Seleccionado"}</span>
      </div>
      <h3>{p.nombre}</h3>
      <p className="text-small text-muted">{p.resumen}</p>

      <div className="mt-1 grid gap-2.5">
        <div>
          <label htmlFor={`${uid}-medida`} className={labelClass}>
            Medida
          </label>
          <select
            id={`${uid}-medida`}
            value={medida}
            onChange={(e) => setMedida(e.target.value)}
            className={controlClass}
          >
            {p.medidas.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        {p.espesores.length > 1 && (
          <div>
            <label htmlFor={`${uid}-espesor`} className={labelClass}>
              Espesor
            </label>
            <select
              id={`${uid}-espesor`}
              value={espesor}
              onChange={(e) => setEspesor(e.target.value)}
              className={controlClass}
            >
              {p.espesores.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        )}
        {tela && (
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
        )}
      </div>

      <div className="mt-1.5 flex items-center gap-2.5">
        <QtyControl
          value={qty}
          onChange={(d) => setQty((q) => Math.max(1, q + d))}
        />
        <button
          type="button"
          aria-label={`Agregar ${p.nombre}`}
          onClick={() =>
            cart.add(productItem(p, { medida, espesor, tela }, qty))
          }
          className={buttonClass({
            size: "sm",
            className: "flex-1 justify-center",
          })}
        >
          Agregar
        </button>
      </div>
    </article>
  );
}
