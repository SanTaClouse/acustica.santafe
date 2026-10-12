import { getImageProps } from "next/image";
import heroMobile from "@/assets/hero-mobile.jpg";
import hero from "@/assets/hero.jpg";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";

// Render ilustrativo (no es una obra de un cliente). En mobile el texto va sobre
// el color de la pared y la foto vertical debajo; en desktop, la panorámica de
// fondo con el titular sobre la pared libre de la izquierda.
// La foto es clara en los dos temas, así que el texto va siempre en grafito.
const ALT =
  "Estudio de streaming con paneles acústicos color petróleo detrás de la mesa de grabación";

function HeroImage() {
  const comun = { alt: ALT, fill: true, preload: true, sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...comun, src: hero });
  const { props: mobile } = getImageProps({ ...comun, src: heroMobile });
  return (
    <div className="relative order-last aspect-[2/3] w-full lg:absolute lg:inset-0 lg:aspect-auto">
      <picture>
        <source media="(min-width: 1024px)" srcSet={desktop} />
        <img
          {...mobile}
          alt={ALT}
          className="object-cover object-bottom lg:object-[30%_50%]"
        />
      </picture>
      <div aria-hidden="true" className="absolute inset-0 hero-shade" />
    </div>
  );
}

export function Hero() {
  return (
    <div className="relative flex flex-col overflow-hidden bg-[#efe9e0] text-[#1d1f21] lg:min-h-[min(86vh,860px)] lg:flex-row lg:items-center">
      <HeroImage />
      <Container className="relative z-10 w-full pt-[clamp(40px,7vw,96px)] pb-8 lg:pb-[clamp(40px,7vw,96px)]">
        <div className="eyebrow text-[#1d1f21]/70">
          Acondicionamiento acústico · Todo el país
        </div>
        <h1 className="mt-5.5 mb-6.5 max-w-[12ch]">
          Diseñamos cómo suena tu espacio.
        </h1>
        <p className="max-w-[46ch] text-[clamp(18px,1.7vw,21px)] text-[#1d1f21]/80">
          Medimos, diseñamos y construimos soluciones acústicas para estudios de
          grabación, salas de streaming y comercios.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#productos" className={buttonClass({ variant: "ink" })}>
            Ver productos
          </a>
          <a
            href="#servicios"
            className={buttonClass({ variant: "ink-ghost" })}
          >
            Pedir asesoramiento
          </a>
        </div>
      </Container>
    </div>
  );
}

export function Promises() {
  const items = [
    ["Datos reales", "Medimos tu recinto antes de proponer nada."],
    ["Render 3D", "Ves cómo queda tu espacio antes de invertir."],
    ["Resultado verificado", "Medición final y documentación técnica."],
  ];
  return (
    <Container>
      <div className="grid border-b border-line md:grid-cols-3">
        {items.map(([titulo, texto]) => (
          <div
            key={titulo}
            className="min-w-0 border-t border-line py-4.5 text-small text-muted md:border-t-0 md:py-7 md:pr-(--gutter)"
          >
            <b className="mb-1 block font-medium text-fg">{titulo}</b>
            {texto}
          </div>
        ))}
      </div>
    </Container>
  );
}
