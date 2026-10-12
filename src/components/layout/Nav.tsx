import { LogoHorizontal } from "@/components/brand/LogoHorizontal";
import { CartButton } from "@/components/cart/CartButton";
import { Container } from "@/components/ui/Container";

const LINKS = [
  ["#espacios", "Espacios"],
  ["#servicios", "Servicios"],
  ["#proceso", "Proceso"],
  ["#nosotros", "Nosotros"],
  ["#productos", "Productos"],
  ["#a-medida", "A medida"],
  ["#contacto", "Contacto"],
] as const;

export function Nav() {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-20 border-b border-line bg-bg/88 backdrop-blur-[10px]">
      <Container className="flex h-18 items-center justify-between gap-6">
        <a
          href="#inicio"
          aria-label="Acústica Santa Fe, inicio"
          className="text-fg"
        >
          <LogoHorizontal className="w-[150px]" />
        </a>
        {/* Los enlaces aparecen desde 981 px: por debajo no entran junto al logo y el botón. */}
        <nav
          aria-label="Secciones"
          className="hidden gap-5 text-sm font-medium whitespace-nowrap lg:flex min-[1200px]:gap-8"
        >
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="text-muted hover:text-fg">
              {label}
            </a>
          ))}
        </nav>
        <CartButton />
      </Container>
    </header>
  );
}
