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
      <ProductCatalog
        productos={productos}
        categorias={categorias}
        telas={telas}
      />
    </Section>
  );
}
