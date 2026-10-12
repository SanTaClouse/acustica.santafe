import Image from "next/image";
import hero from "@/assets/hero.jpg";
import { buttonClass } from "@/components/ui/button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <div className="relative flex min-h-[min(86vh,860px)] items-end overflow-hidden bg-[#d9dadb] text-white">
      <Image
        src={hero}
        alt="Panel acústico negro instalado sobre una pared blanca"
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="object-cover object-[78%_46%]"
      />
      <div aria-hidden="true" className="absolute inset-0 hero-shade" />
      <Container className="relative z-10 w-full pb-[clamp(48px,7vw,96px)]">
        <div className="eyebrow text-white/80">
          Acondicionamiento acústico · Todo el país
        </div>
        <h1 className="mt-5.5 mb-6.5 max-w-[12ch]">
          Diseñamos cómo suena tu espacio.
        </h1>
        <p className="max-w-[46ch] text-[clamp(18px,1.7vw,21px)] text-white/86">
          Medimos, diseñamos y construimos soluciones acústicas para estudios de
          grabación, salas de streaming y comercios.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="#productos" className={buttonClass({ variant: "light" })}>
            Ver productos
          </a>
          <a
            href="#servicios"
            className={buttonClass({ variant: "light-ghost" })}
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
