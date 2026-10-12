import { getCatalog } from "@/content/catalog";
import { DesignPanel } from "@/components/cotizador/DesignPanel";
import { Section, SectionHead } from "@/components/ui/Section";

export function Configurator() {
  const { cotizador, telas } = getCatalog();
  return (
    <Section id="a-medida">
      <SectionHead
        eyebrow="A medida"
        title="Diseñá tu panel y cotizalo al instante."
        lead="Elegí forma, medidas, color y dónde va. Ves cómo queda y cuánto sale; lo sumás a tu consulta y te confirmamos por WhatsApp."
      />
      <DesignPanel tarifas={cotizador} telas={telas} />
    </Section>
  );
}
