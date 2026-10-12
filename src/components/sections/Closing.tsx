import Image from "next/image";
import foto from "@/assets/streaming-band.jpg";
import { StreamingCta } from "@/components/cart/AddToCart";
import { Container } from "@/components/ui/Container";
import { Section, SectionHead } from "@/components/ui/Section";

export function StreamingBand() {
  return (
    <div className="mt-(--section) bg-band py-[clamp(72px,10vw,140px)] text-white">
      <Container className="grid items-end gap-16 lg:grid-cols-[1.2fr_1fr] [&>*]:min-w-0">
        <div>
          <div className="eyebrow text-white/60">Para productoras</div>
          <h2 className="mt-5">¿Vas a armar una sala de streaming?</h2>
          <Image
            src={foto}
            alt="Estudio de productora audiovisual con paneles acústicos grafito, cámara y luz LED"
            sizes="(min-width: 1024px) 50vw, 100vw"
            placeholder="blur"
            className="mt-10 aspect-[4/3] w-full rounded-card object-cover object-[88%_50%]"
          />
        </div>
        <div>
          <p className="text-lg text-white/72">
            Tratamos la sala para que la voz suene limpia en el micrófono,
            aislamos el ruido que entra y diseñamos una estética que suma en
            cámara.
          </p>
          <ul className="mt-6 mb-8 grid gap-2.5 text-white/86">
            {[
              "Diagnóstico del local antes de la obra",
              "Coordinación con tu constructor o el nuestro",
              "Medición final con informe",
            ].map((x) => (
              <li
                key={x}
                className="flex gap-3 before:text-white/40 before:content-['—']"
              >
                {x}
              </li>
            ))}
          </ul>
          <StreamingCta />
        </div>
      </Container>
    </div>
  );
}

export const PREGUNTAS = [
  [
    "¿Trabajan fuera de Santa Fe?",
    "Sí, trabajamos en todo el país. Los productos se envían, y el asesoramiento y los proyectos se coordinan según el lugar y la escala de la obra.",
  ],
  [
    "¿Puedo comprar solo paneles, sin contratar un proyecto?",
    "Sí. Armá tu consulta con los productos que necesitás. Si no sabés cuántos ni dónde ponerlos, te recomendamos empezar por el asesoramiento: evita comprar de más o en el lugar equivocado.",
  ],
  [
    "¿Acondicionar es lo mismo que insonorizar?",
    "No. Acondicionar mejora cómo suena el sonido dentro de la sala (eco, reverberación, graves). Insonorizar evita que el sonido entre o salga, y requiere intervenir paredes, puertas y ventanas. Los paneles no aíslan.",
  ],
  [
    "¿Cuánto cuesta?",
    "Depende del volumen del recinto, su geometría, los materiales, el objetivo acústico y la complejidad de la obra. Por eso no publicamos precios fijos: con tu consulta te pasamos un presupuesto concreto.",
  ],
];

export function Faq() {
  return (
    <Section id="faq">
      <SectionHead
        eyebrow="Preguntas frecuentes"
        title="Antes de escribirnos."
      />
      <div className="border-t border-line">
        {PREGUNTAS.map(([pregunta, respuesta]) => (
          <details key={pregunta} className="group border-b border-line">
            <summary className="flex list-none justify-between gap-6 py-6.5 text-xl after:text-[26px] after:leading-none after:font-light after:text-muted after:content-['+'] group-open:after:content-['−'] [&::-webkit-details-marker]:hidden">
              {pregunta}
            </summary>
            <p className="max-w-[68ch] pb-7 text-muted">{respuesta}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
