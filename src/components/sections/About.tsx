import Image from "next/image";
import foto from "@/assets/nosotros.jpg";
import { Section, SectionHead } from "@/components/ui/Section";

const EJES = ["Rendimiento acústico", "Funcionalidad", "Estética"];

// Textos del carrusel "Quiénes somos" de Instagram. La imagen es un render del
// taller: reemplazar src/assets/nosotros.jpg por una foto real cuando la haya.
export function About() {
  return (
    <Section id="nosotros">
      <SectionHead
        eyebrow="Quiénes somos"
        title="Acústica a medida para cada espacio."
        lead="En Acústica Santa Fe no partimos de un producto: partimos de tu recinto y de lo que vas a hacer en él."
      />
      <div className="grid items-center gap-12 lg:grid-cols-2 [&>*]:min-w-0">
        <Image
          src={foto}
          alt="Fabricación de paneles acústicos con bastidor de pino y lana de roca"
          sizes="(min-width: 981px) 528px, 100vw"
          placeholder="blur"
          className="aspect-[3/2] w-full rounded-card object-cover"
        />
        <div>
          <h3 className="text-[28px] font-light tracking-[-0.02em]">
            Combinamos conocimiento técnico, análisis y selección de materiales.
          </h3>
          <p className="mt-3 max-w-[60ch] text-muted">
            Para mejorar el comportamiento del sonido, optimizar la calidad
            acústica y reducir la transmisión de ruido.
          </p>
          <p className="mt-6 max-w-[60ch] text-muted">
            <b className="font-medium text-fg">Cada proyecto, personalizado.</b>{" "}
            Buscamos el equilibrio entre lo que se mide, lo que se usa y lo que
            se ve.
          </p>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {EJES.map((eje, i) => (
              <li key={eje} className="min-w-0 border-t border-fg pt-5">
                <div className="text-[13px] font-semibold tracking-[0.1em] text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 font-medium">{eje}</div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
