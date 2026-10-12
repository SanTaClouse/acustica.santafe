import { getCatalog } from "@/content/catalog";
import { cn } from "@/lib/cn";
import { AddServiceButton } from "@/components/cart/AddToCart";
import { Section, SectionHead } from "@/components/ui/Section";

export function Services() {
  const { servicios } = getCatalog();
  return (
    <Section id="servicios">
      <SectionHead
        eyebrow="Servicios"
        title="Desde un diagnóstico hasta la obra completa."
        lead="Podés contratar solo las mediciones y el informe, o delegarnos todo el proyecto. Agregalo a tu consulta y lo vemos juntos."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {servicios.map((s) => (
          <article
            key={s.id}
            className={cn(
              "flex min-w-0 flex-col gap-5 rounded-card border p-[clamp(28px,4vw,48px)]",
              s.destacado ? "border-surface bg-surface" : "border-line",
            )}
          >
            <div className="eyebrow">{s.etiqueta}</div>
            <h3 className="text-[32px] font-light tracking-[-0.02em]">
              {s.nombre}
            </h3>
            <p className="text-muted">{s.resumen}</p>
            <ul className="mt-2">
              {s.incluye.map((x) => (
                <li
                  key={x}
                  className="flex gap-3.5 border-t border-line py-3 text-small before:mt-2.5 before:size-1.5 before:flex-none before:rounded-full before:bg-accent"
                >
                  {x}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
              <AddServiceButton id={s.id} nombre={s.nombre} />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
