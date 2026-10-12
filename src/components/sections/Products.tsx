import Image from "next/image";
import banner from "@/assets/productos.jpg";
import { getCatalog } from "@/content/catalog";
import { ProductCatalog } from "@/components/products/ProductCatalog";
import { Section, SectionHead } from "@/components/ui/Section";

export function Products() {
  const { productos, categorias, telas } = getCatalog();
  return (
    <Section id="productos">
      <SectionHead
        eyebrow="Productos"
        title="Fabricados a medida."
        lead="Elegí producto, medida y color de tela, y sumalo a tu consulta. Te respondemos por WhatsApp con el presupuesto."
      />
      <Image
        src={banner}
        alt="Línea Textil de Acústica Santa Fe: paneles rectangulares, slim, hexagonal y triangular"
        sizes="(min-width: 1200px) 1200px, 100vw"
        placeholder="blur"
        className="mb-12 aspect-[16/9] w-full rounded-card object-cover object-[75%_50%] md:aspect-[21/9]"
      />
      <ProductCatalog
        productos={productos}
        categorias={categorias}
        telas={telas}
      />
    </Section>
  );
}
