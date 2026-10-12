import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
} from "@/content/site";
import { WA_DIRECT_URL } from "@/lib/whatsapp";
import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { WhatsAppGlyph } from "@/components/brand/WhatsAppGlyph";
import { CartFab } from "@/components/cart/CartButton";
import { Container } from "@/components/ui/Container";

const dtClass = "text-xs font-medium tracking-[0.2em] text-muted uppercase";

export function Footer() {
  return (
    // Abajo deja lugar para los botones flotantes.
    <footer
      id="contacto"
      className="mt-(--section) border-t border-line pt-18 pb-28"
    >
      <Container className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] [&>*]:min-w-0">
        <div>
          <LogoHorizontal className="w-[200px]" />
          <p className="mt-7 text-[clamp(28px,3vw,40px)] leading-[1.15] font-light tracking-[-0.02em]">
            Tu espacio tiene una acústica. Hagamos que trabaje a tu favor.
          </p>
        </div>
        <dl className="grid gap-4.5 text-small">
          <div>
            <dt className={dtClass}>WhatsApp</dt>
            <dd className="mt-1">
              <a
                href={WA_DIRECT_URL}
                target="_blank"
                rel="noopener"
                className="underline"
              >
                {WHATSAPP_DISPLAY}
              </a>
            </dd>
          </div>
          <div>
            <dt className={dtClass}>Instagram</dt>
            <dd className="mt-1">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener"
                className="underline"
              >
                {INSTAGRAM_HANDLE}
              </a>
            </dd>
          </div>
        </dl>
        <dl className="grid gap-4.5 text-small">
          <div>
            <dt className={dtClass}>Web</dt>
            <dd className="mt-1">acusticasantafe.com</dd>
          </div>
          <div>
            <dt className={dtClass}>Base</dt>
            <dd className="mt-1">
              Santa Fe, Argentina · Trabajamos en todo el país
            </dd>
          </div>
        </dl>
        <div className="col-span-full flex flex-wrap justify-between gap-4 border-t border-line pt-8 text-[13px] text-muted">
          <span>© {process.env.BUILD_YEAR} Acústica Santa Fe</span>
          <span>Diseñamos cómo suena tu espacio.</span>
        </div>
      </Container>
    </footer>
  );
}

export function FloatingActions() {
  return (
    <aside
      aria-label="Contacto rápido"
      className="fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom,0px))] z-30 flex items-center gap-2"
    >
      <CartFab />
      <a
        href={WA_DIRECT_URL}
        target="_blank"
        rel="noopener"
        aria-label="Escribinos por WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-fg text-bg shadow-[0_10px_30px_rgb(0_0_0/0.18)] transition-opacity duration-150 hover:opacity-88"
      >
        <WhatsAppGlyph className="size-6.5" />
      </a>
    </aside>
  );
}
