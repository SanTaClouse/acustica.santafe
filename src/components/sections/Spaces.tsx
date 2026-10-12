import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import aula from "@/assets/espacio-aula.jpg";
import comercio from "@/assets/espacio-comercio.jpg";
import estudio from "@/assets/espacio-estudio.jpg";
import streaming from "@/assets/espacio-streaming.jpg";
import { WA_DIRECT_URL } from "@/lib/whatsapp";
import { cn } from "@/lib/cn";
import { Section, SectionHead } from "@/components/ui/Section";

// Las imágenes son renders ilustrativos, no obras de clientes.
function Celda({
  foto,
  alt,
  encuadre,
  titulo,
  texto,
  pie,
  consulta,
}: {
  foto: StaticImageData;
  alt: string;
  encuadre: string;
  titulo: string;
  texto: string;
  pie?: ReactNode;
  consulta?: boolean;
}) {
  return (
    <div
      className={cn("flex min-w-0 flex-col", consulta ? "bg-surface" : "bg-bg")}
    >
      <Image
        src={foto}
        alt={alt}
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
        placeholder="blur"
        className={cn("aspect-[4/3] w-full object-cover", encuadre)}
      />
      <div className="flex flex-1 flex-col gap-4 px-7 pt-7 pb-8">
        <h3>{titulo}</h3>
        <p className="text-small text-muted">{texto}</p>
        {pie}
      </div>
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
          foto={streaming}
          alt="Sala de streaming con paneles petróleo y arena detrás del escritorio, vista desde atrás de la cámara"
          encuadre="object-[40%_50%]"
          titulo="Salas de streaming"
          texto="Voz clara y sin eco, sin ruido de la calle, y una sala que se ve bien en cámara. Para productoras y canales."
          pie={<span className={tagClass}>Nuestro foco</span>}
        />
        <Celda
          foto={estudio}
          alt="Control room con paneles grafito detrás de los monitores, nube acústica en el techo y trampas de graves en las esquinas"
          encuadre="object-[50%_50%]"
          titulo="Estudios de grabación"
          texto="Control rooms y salas de toma con una respuesta medida, para mezclar y grabar con confianza."
        />
        <Celda
          foto={comercio}
          alt="Restaurante con paneles acústicos beige para reducir el ruido"
          encuadre="object-[70%_50%]"
          titulo="Comercios y oficinas"
          texto="Restaurantes, locales y salas de reunión: menos ruido y conversaciones que se entienden."
        />
        <Celda
          consulta
          foto={aula}
          alt="Aula de música con paneles triangulares petróleo y beige, un atril y una guitarra"
          encuadre="object-[50%_40%]"
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
