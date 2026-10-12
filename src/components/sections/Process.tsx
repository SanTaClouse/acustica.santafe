import { Section, SectionHead } from "@/components/ui/Section";
import { DecayChart } from "./DecayChart";

const PASOS = [
  [
    "Analizamos tu espacio",
    "Visitamos el recinto, medimos sus condiciones actuales y definimos objetivos según la actividad.",
  ],
  [
    "Diseñamos antes de construir",
    "Te presentamos el render 3D, la solución acústica y un presupuesto detallado.",
  ],
  [
    "Planificamos y ejecutamos",
    "Acordamos plazos, etapas y pagos. Fabricamos, instalamos y coordinamos cada etapa.",
  ],
  [
    "Verificamos los resultados",
    "Medimos de nuevo, ajustamos y te entregamos la documentación técnica.",
  ],
];

// Cuando haya una medición real: cargar sus valores y pasar ejemplo={false}.
const MEDICION = { antes: 1.4, despues: 0.4, ejemplo: true };

export function Process() {
  return (
    <Section id="proceso">
      <SectionHead
        eyebrow="Cómo funciona"
        title="De la primera medición a la entrega final."
        lead="Un proyecto llave en mano en cuatro pasos. Sabés qué vas a recibir, cuánto cuesta y cuándo, antes de empezar la obra."
      />
      <ol className="grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {PASOS.map(([titulo, texto], i) => (
          <li key={titulo} className="min-w-0 border-t border-fg pt-6">
            <div className="text-[13px] font-semibold tracking-[0.1em] text-accent tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="mt-3.5 mb-3">{titulo}</h3>
            <p className="text-small text-muted">{texto}</p>
          </li>
        ))}
      </ol>
      <div className="mt-18 grid items-center gap-12 rounded-card bg-surface p-[clamp(24px,4vw,48px)] lg:grid-cols-[1fr_1.4fr] [&>*]:min-w-0">
        <div>
          <div className="eyebrow">Lo que medimos</div>
          <h3 className="mt-4 mb-3 text-[28px] font-light">
            Tiempo de reverberación, antes y después.
          </h3>
          <p className="text-small text-muted">
            El RT60 indica cuánto tarda el sonido en caer 60 dB. Una sala de voz
            o de grabación pide valores bajos y parejos.{" "}
            {MEDICION.ejemplo
              ? "Así se ve una mejora típica (ejemplo ilustrativo)."
              : "Así cambió en uno de nuestros proyectos."}
          </p>
        </div>
        <DecayChart antes={MEDICION.antes} despues={MEDICION.despues} />
      </div>
    </Section>
  );
}
