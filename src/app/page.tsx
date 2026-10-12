import {
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WHATSAPP,
} from "@/content/site";
import { getCatalog } from "@/content/catalog";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/cart/Toast";
import { FloatingActions, Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { About } from "@/components/sections/About";
import { Faq, PREGUNTAS, StreamingBand } from "@/components/sections/Closing";
import { Configurator } from "@/components/sections/Configurator";
import { Hero, Promises } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { Spaces } from "@/components/sections/Spaces";

// Datos estructurados para Google: el negocio, el sitio, el catálogo (sin
// precios: se cotiza por WhatsApp) y las preguntas frecuentes.
const NEGOCIO = `${SITE_URL}/#negocio`;
const { productos, servicios } = getCatalog();
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": NEGOCIO,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      telephone: `+${WHATSAPP}`,
      logo: `${SITE_URL}/icon-512.png`,
      image: `${SITE_URL}/opengraph-image.jpg`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Santa Fe",
        addressRegion: "Santa Fe",
        addressCountry: "AR",
      },
      areaServed: { "@type": "Country", name: "Argentina" },
      sameAs: [INSTAGRAM_URL],
      knowsAbout: [
        "Acondicionamiento acústico",
        "Paneles acústicos",
        "Medición acústica",
        "Tiempo de reverberación",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Productos y servicios",
        itemListElement: [
          ...productos.map((p) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Product",
              name: p.nombre,
              description: p.resumen,
              ...(typeof p.imagen === "string" && {
                image: `${SITE_URL}${p.imagen}`,
              }),
              brand: { "@id": NEGOCIO },
            },
          })),
          ...servicios.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.nombre,
              description: s.resumen,
              provider: { "@id": NEGOCIO },
            },
          })),
        ],
      },
    },
    {
      "@type": "WebSite",
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-AR",
      publisher: { "@id": NEGOCIO },
    },
    {
      "@type": "FAQPage",
      mainEntity: PREGUNTAS.map(([pregunta, respuesta]) => ({
        "@type": "Question",
        name: pregunta,
        acceptedAnswer: { "@type": "Answer", text: respuesta },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <a
        href="#inicio"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
      >
        Saltar al contenido
      </a>
      <Nav />
      <main id="inicio">
        <Hero />
        <Promises />
        <Spaces />
        <Services />
        <Process />
        <About />
        <Products />
        <Configurator />
        <StreamingBand />
        <Faq />
      </main>
      <Footer />
      <FloatingActions />
      <CartDrawer />
      <Toast />
    </>
  );
}
