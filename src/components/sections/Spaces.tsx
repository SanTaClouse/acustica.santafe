import type { ReactNode } from "react";
import { WA_DIRECT_URL } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { Section, SectionHead } from "@/components/ui/Section";

function Icono({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className="size-11 text-accent"
    >
      {children}
    </svg>
  );
}

function Celda({
  icono,
  titulo,
  texto,
  pie,
  consulta,
}: {
  icono: ReactNode;
  titulo: string;
  texto: string;
  pie?: ReactNode;
  consulta?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-4 px-7 pt-9 pb-8 md:min-h-[300px]",
        consulta ? "bg-surface" : "bg-bg",
      )}
    >
      {icono}
      <h3>{titulo}</h3>
      <p className="text-small text-muted">{texto}</p>
      {pie}
    </div>
  );
}

const tagClass = "mt-auto text-[13px] font-medium text-accent";

export function Spaces() {
  return (
    <Section id="espacios">
      <SectionHead
        eyebrow="Qué abarcamos"
        title="Soluciones para cada tipo de espacio."
        lead="Cada recinto tiene un problema distinto. Partimos del uso que le vas a dar y de lo que miden los equipos, no de un catálogo."
      />
      <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        <Celda
          icono={
            <Icono>
              <rect x="6" y="10" width="32" height="20" rx="2" />
              <path d="M16 36h12M22 30v6" />
              <circle cx="22" cy="20" r="4" />
            </Icono>
          }
          titulo="Salas de streaming"
          texto="Voz clara y sin eco, sin ruido de la calle, y una sala que se ve bien en cámara. Para productoras y canales."
          pie={<span className={tagClass}>Nuestro foco</span>}
        />
        <Celda
          icono={
            <Icono>
              <rect x="17" y="5" width="10" height="18" rx="5" />
              <path d="M11 19a11 11 0 0 0 22 0M22 30v8M15 38h14" />
            </Icono>
          }
          titulo="Estudios de grabación"
          texto="Control rooms y salas de toma con una respuesta medida, para mezclar y grabar con confianza."
        />
        <Celda
          icono={
            <Icono>
              <path d="M6 18 9 8h26l3 10M6 18h32v18H6zM6 18c0 3 3 5 5.5 5S16 21 16 18c0 3 3 5 6 5s6-2 6-5c0 3 2 5 4.5 5S38 21 38 18M18 36v-8h8v8" />
            </Icono>
          }
          titulo="Comercios y oficinas"
          texto="Restaurantes, locales y salas de reunión: menos ruido y conversaciones que se entienden."
        />
        <Celda
          consulta
          icono={
            <Icono>
              <path d="M6 10h32v20H20l-8 7v-7H6z" />
              <path d="M18 17a4 4 0 1 1 5 4v2M22 26v.5" />
            </Icono>
          }
          titulo="Consultá tu caso particular"
          texto="Sala de ensayo, home studio, aula, auditorio o un problema de ruido con el vecino."
          pie={
            <a
              href={WA_DIRECT_URL}
              target="_blank"
              rel="noopener"
              className={cn(tagClass, "underline")}
            >
              Escribinos →
            </a>
          }
        />
      </div>
    </Section>
  );
}
