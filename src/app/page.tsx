import {
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WHATSAPP,
} from "@/content/site";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { Toast } from "@/components/cart/Toast";
import { FloatingActions, Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { About } from "@/components/sections/About";
import { Faq, StreamingBand } from "@/components/sections/Closing";
import { Hero, Promises } from "@/components/sections/Hero";
import { Process } from "@/components/sections/Process";
import { Products } from "@/components/sections/Products";
import { Services } from "@/components/sections/Services";
import { Spaces } from "@/components/sections/Spaces";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: `+${WHATSAPP}`,
  logo: `${SITE_URL}/icon-512.png`,
  image: `${SITE_URL}/icon-512.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santa Fe",
    addressRegion: "Santa Fe",
    addressCountry: "AR",
  },
  areaServed: { "@type": "Country", name: "Argentina" },
  sameAs: [INSTAGRAM_URL],
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
