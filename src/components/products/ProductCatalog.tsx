"use client";

import { useState } from "react";
import type { Categoria, Producto, Tela } from "@/content/catalog";
import { ProductCard } from "./ProductCard";

// Las tarjetas filtradas se ocultan en lugar de desmontarse: así cada una
// conserva la medida, tela y cantidad elegidas, y todas quedan en el HTML.
export function ProductCatalog({
  productos,
  categorias,
  telas,
}: {
  productos: Producto[];
  categorias: Categoria[];
  telas: Tela[];
}) {
  const [filtro, setFiltro] = useState("todos");
  const nombreDe = new Map(categorias.map((c) => [c.id, c.nombre]));

  return (
    <>
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="mb-10 flex flex-wrap gap-2"
      >
        {[{ id: "todos", nombre: "Todos" }, ...categorias].map((c) => (
          <button
            key={c.id}
            type="button"
            aria-pressed={c.id === filtro}
            onClick={() => setFiltro(c.id)}
            className="rounded-full border border-line px-4.5 py-2.75 text-sm leading-none font-medium text-muted aria-pressed:border-fg aria-pressed:text-fg"
          >
            {c.nombre}
          </button>
        ))}
      </div>
      <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {productos.map((p) => (
          <ProductCard
            key={p.id}
            producto={p}
            categoria={nombreDe.get(p.categoria) ?? ""}
            telas={telas}
            hidden={filtro !== "todos" && p.categoria !== filtro}
          />
        ))}
      </div>
    </>
  );
}
