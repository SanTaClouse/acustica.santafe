# Plan de implementación: acusticasantafe.com

**Fuente:** `../Acustica-Santa-Fe_Web-paquete/Web_paquete-para-agente/` (HANDOFF.md, prototipo, `products.json`, `tokens.css`, assets).
**Material complementario:** `C:\Users\Santi\Escritorio\Acustica Santa Fe\` (kit de logos, piezas de Instagram, portada de Facebook). Ver 1.4.
**Objetivo:** llevar el prototipo a producción **sin rediseñarlo**, con Next.js + TypeScript + Tailwind, sitio 100 % estático, deploy en Vercel (`santaclouses-projects`) y dominio `acusticasantafe.com`.
**Agregados aprobados respecto del prototipo:** botón flotante de WhatsApp (D4) y sección "Quiénes somos" (D8).
**Repo:** `front/` → `github.com/SanTaClouse/acustica.santafe` (rama `main`).

---

## 0. Estado (12/10/2026)

**Hecho: Fases 0 a 6.** El sitio está completo en local. Pendiente: Fase 7 (Vercel y dominio) y Fase 8 (contenido de Samuel).

| Verificación                                                     | Resultado                                                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Comparación con el prototipo (1440, 820, 390 px; claro y oscuro) | Sin diferencias, salvo los agregados aprobados                                                            |
| Tests unitarios (Vitest)                                         | 14/14                                                                                                     |
| E2E (Playwright, desktop 1440 y mobile 360)                      | 19/19 (+1 omitido: nav en mobile, que no tiene enlaces)                                                   |
| axe (página completa y panel, claro y oscuro)                    | 0 violaciones                                                                                             |
| Lighthouse mobile                                                | Rendimiento 97–98, Accesibilidad 100, Buenas prácticas 100, SEO 100                                       |
| LCP                                                              | 2,5–2,7 s simulado (4G lento + CPU ×4); 0,27 s observado en local. Confirmar en Vercel con Speed Insights |

**Cambios respecto de lo planeado:**

- **Next.js 16.4 con Cache Components** (viene activado): el layout exporta `ensureStatic = "navigation"`, así el build falla si algo requiere render por request. `new Date()` rompe el prerender, por eso el año del footer se fija en el build (`env.BUILD_YEAR` en `next.config.ts`). `next/image` usa `preload` (`priority` quedó deprecado).
- **Imagen OG:** JPG estático (`src/app/opengraph-image.jpg`, 26 KB) generado por `scripts/generate-assets.mjs`, en lugar de `opengraph-image.tsx`. El logo apilado va en blanco **centrado sobre el panel negro**, como una placa: sobre el degradé pisaba el borde del panel.
- **Logo:** archivo SVG optimizado con SVGO (`public/brand/logo-horizontal.svg`, 10 KB) pintado con `mask` + `currentColor`, en lugar de un componente con el SVG inline. Inline, sus 26 KB viajaban cuatro veces en el HTML (página + payload de React). El HTML bajó de 70 KB a 23 KB comprimido. El favicon también pasa por SVGO (17 → 6 KB). El apilado y el isotipo no se usan en la página.
- **Contraste:** `--color-muted` pasa de `#6E7174` a `#6D7073`. El valor del paquete daba 4,47:1 sobre Niebla (`#F4F4F2`), por debajo del 4,5:1 que exige el HANDOFF. Con el nuevo da 4,53:1 (y 4,98:1 sobre blanco).
- **Escala de texto:** los tamaños de Tailwind se redefinieron sin interlineado propio; todo hereda 1,65 como en el prototipo.
- **`products.json`:** los servicios tienen `etiqueta` ("Diagnóstico", "Proyecto completo") y `destacado`, que el prototipo resolvía por posición. El campo `imagen` de productos ya funciona (ver Fase 8).

## 1. Análisis del paquete

### 1.1 Inventario y destino de cada archivo

| Archivo del paquete                       | Qué aporta                                             | Destino en el repo                              |
| ----------------------------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| `HANDOFF.md`                              | Especificación funcional y de diseño                   | `docs/HANDOFF.md` (copia)                       |
| `prototipo/fuente-del-prototipo.html`     | CSS, JS y **textos definitivos** (396 líneas legibles) | `docs/prototipo/`: referencia para portar       |
| `prototipo/acustica-santafe-web.html`     | El mismo prototipo con imágenes embebidas (200 KB)     | No se copia; solo para comparar visualmente     |
| `data/products.json`                      | 6 telas, 5 categorías, 6 productos, 2 servicios        | `src/content/products.json`                     |
| `design/tokens.css`                       | Colores claro/oscuro, tipografía, espacios, radios     | `@theme` de Tailwind en `globals.css` (ver 3.2) |
| `assets/logo-horizontal-currentColor.svg` | Logo de nav (150 px) y footer (200 px)                 | Componente `LogoHorizontal.tsx`                 |
| `assets/logo-apilado-currentColor.svg`    | Logo para la imagen Open Graph                         | Imagen OG (`scripts/generate-assets.mjs`)       |
| `assets/isotipo-currentColor.svg`         | El prototipo no lo usa (queda de reserva)              | Componente `Isotipo.tsx`                        |
| `assets/favicon.svg`                      | Favicon (círculo grafito + isotipo)                    | `src/app/icon.svg`                              |
| `assets/icon-512-fuente.png`              | Fuente para íconos de app. **Mide 1080×1080**, no 512  | Fuente de `scripts/generate-icons.mjs`          |
| `assets/hero-provisoria.jpg`              | 2000×1500, 85 KB, panel negro sobre pared blanca       | `src/assets/hero.jpg` (vía `next/image`)        |

### 1.2 Comportamiento del prototipo a replicar que el HANDOFF no detalla

- La selección de cada tarjeta (medida, espesor, tela, cantidad) **se conserva al cambiar de filtro**: el prototipo la guarda en un objeto global `sel`.
- Tela por defecto: `"grafito"`, escrita directamente en el JS.
- Si un producto tiene **un solo espesor**, el selector no se muestra, pero el espesor **sí** entra en el detalle del ítem (`120 × 60 cm · 100 mm · Tela grafito`).
- La ilustración del difusor ignora la tela: usa madera fija (`#b98e62` / `#9a7450`).
- Contador = suma de cantidades de productos + 1 por cada servicio.
- El botón de la banda de productoras hace tres cosas: agrega `svc:streaming` ("Proyecto sala de streaming", detalle "Consulta para productora"), fija _Tipo de espacio = Sala de streaming_ y abre el panel.
- Toast "_X_ agregado a tu consulta" durante 2,2 s.
- Escape y clic en el fondo oscuro cierran el panel.
- El enlace de WhatsApp se recalcula con cada tecla que se escribe en el formulario.
- `data-theme="light|dark"` en `<html>` fuerza un tema (no hay botón en la UI).
- Breakpoints: **980 px** (grillas a 2 columnas) y **720 px** (1 columna, nav oculta, aparece el botón flotante "Mi consulta").

### 1.3 Inconsistencias y huecos detectados

1. **Tokens:** `tokens.css` y el prototipo usan nombres distintos (`--color-bg` frente a `--bg`). A `tokens.css` le faltan el override `[data-theme]`, `color-scheme: dark` y `--on-dark`. → Se usan los nombres de `tokens.css`, que además coinciden con el espacio `--color-*` de Tailwind, y se agrega lo que solo existe en el prototipo.
2. **`detalle` del producto** ("Lana de roca de alta densidad…") está en el JSON, pero el prototipo no lo muestra. Además choca con el `detalle` del ítem del carrito, que es otra cosa. → D3.
3. **Accesibilidad del panel:** no atrapa el foco, no lo devuelve al cerrar y no bloquea el scroll del fondo. El toast no tiene `aria-live`. → Se corrige con `<dialog>` nativo y `role="status"`, sin cambios visuales.
4. **Contacto directo:** el WhatsApp del footer es texto plano y "Escribinos →" (en "Consultá tu caso particular") lleva al footer. → Resuelto con D4: los dos usan el mismo enlace directo que el botón flotante.
5. El encabezado de la sección FAQ tiene un `<p class="lead">` vacío: se elimina.
6. El tono oscuro de las ilustraciones usa `color-mix()` dentro de `fill`. → Se calcula en TypeScript (`shade(hex, 0.78)`), así funciona igual en la imagen OG y en navegadores viejos.
7. `© 2026` está escrito a mano. → Usar el año del build.
8. **El JSON no se valida:** un error de tipeo (por ejemplo, una categoría inexistente) rompe la página en producción. → Validación con Zod durante el build.
9. **Imagen OG:** el HANDOFF pide "logo apilado sobre foto del hero", pero la foto es casi blanca. → Lo resuelve la regla del kit de logos (ver 1.4): versión blanca sobre la zona oscurecida por el degradé.
10. **Nav en tablet (estimado, verificar en la Fase 2):** logo (150 px) + 5 enlaces + botón suman unos 800 px y el contenedor entre 721 y ~880 px es más angosto. Con "Nosotros" (D8) son 6 enlaces. → Mostrar los enlaces recién desde 981 px; por debajo quedan logo y "Mi consulta", igual que en mobile.

### 1.4 Material complementario (Escritorio/Acustica Santa Fe)

| Material                                                                                         | Qué aporta a la web                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Acustica-Santa-Fe_Logos/` (horizontal, apilada, isotipo en SVG/PDF/PNG; grafito, blanco y azul) | Los trazados son **idénticos** a los SVG `currentColor` del paquete (verificado), así que alcanza con los del paquete. Los del kit traen `<title>`, útil si un logo se usa fuera de un enlace con `aria-label`                                                                          |
| `LEEME.txt` del kit de logos                                                                     | **Reglas de uso** que la web debe respetar: aire alrededor ≥ altura de la "a"; mínimo 120 px de ancho para el horizontal (la nav usa 150 px, cumple) y 24 px para el isotipo; **blanco sobre zonas oscuras de fotos, grafito sobre claras**; sin sombras ni deformaciones               |
| `00_presentacion-identidad.png`                                                                  | Confirma paleta, Manrope (Light títulos, Regular texto, Semibold datos) y el concepto de la onda. Indica "Semibold para botones", pero el prototipo usa 500. **Se respeta el prototipo** (es la referencia de la web)                                                                   |
| `04_Perfil-redes/` (1080×1080)                                                                   | Fuente alternativa para los íconos de app si `icon-512-fuente.png` no alcanza                                                                                                                                                                                                           |
| Carrusel "Quiénes somos" (5 placas)                                                              | **Textos de la nueva sección** (D8). Ver 4, Fase 2                                                                                                                                                                                                                                      |
| Carruseles "Llave en mano" y "Asesoramiento"                                                     | Repiten los textos de la web: no hay contradicciones. El gráfico RT60 es el mismo ejemplo ilustrativo; cuando haya mediciones reales hay que cambiar **web y carruseles** a la vez                                                                                                      |
| `Fondo-producto/_ejemplo`                                                                        | Dato de catálogo que el JSON no tiene: **"Lana de roca 100 kg/m³ · marco de pino · tela a elección"**, categoría "Absorción · Pared". Hay que confirmarlo con Samuel y pasarlo a `products.json`                                                                                        |
| Fotos reales (taller con paneles en construcción, primer plano de lana de roca, panel en ángulo) | Están **compuestas** dentro de las piezas de Instagram, con texto y marcos encima. Única excepción: la mitad superior de la placa 03 de "Quiénes somos" (lana de roca, 1080×560) es foto limpia y sirve como imagen **provisoria** de la sección. Hay que pedir los originales (Fase 8) |
| `portada-facebook_slogan.png`                                                                    | Usa la onda como línea de fondo. El prototipo no la usa: no se agrega (no rediseñar)                                                                                                                                                                                                    |

---

## 2. Decisiones técnicas

| Tema               | Decisión                                                                                                                                                                                                                 | Por qué                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js (última estable), App Router, TypeScript, carpeta `src/`                                                                                                                                                         | Lo pide el HANDOFF                                                                                                                |
| Render             | Todo prerenderizado (SSG). **Sin** `output: 'export'`                                                                                                                                                                    | En Vercel mantiene la optimización de `next/image` y la imagen OG generada. No quedan funciones en runtime                        |
| Estilos            | **Tailwind CSS v4** (D1). Tokens en `@theme`, componentes React para las piezas repetidas (Button, Eyebrow, SectionHead), `clsx` + `tailwind-merge` para combinar clases y `prettier-plugin-tailwindcss` para ordenarlas | Decisión del proyecto. Los nombres de `tokens.css` ya siguen el espacio `--color-*` de Tailwind                                   |
| Tipografía         | `next/font/google`: Manrope 300/400/500/600, `display: swap`, conectada a `--font-sans`                                                                                                                                  | Se sirve desde el propio dominio y no provoca saltos de layout (CLS)                                                              |
| Carrito            | Store propio con `useSyncExternalStore` sobre `localStorage["asf-cart"]`. Guarda un array plano, **mismo formato que el prototipo**                                                                                      | Sin dependencias. El servidor ve `[]`, así que no hay errores de hidratación. Las pestañas se sincronizan con el evento `storage` |
| Panel de consulta  | `<dialog>` + `showModal()`                                                                                                                                                                                               | Foco atrapado, Escape y fondo inerte vienen incluidos                                                                             |
| WhatsApp           | Dos enlaces: **consulta** (mensaje armado desde el panel) y **directo** ("Hola, vengo de la web.") para el botón flotante, el footer y "Escribinos →"                                                                    | D4                                                                                                                                |
| Datos              | `import` estático de `products.json` + esquema Zod + capa `getCatalog()`                                                                                                                                                 | Se edita el JSON sin tocar código. Migrar a Sanity solo cambiaría esa capa                                                        |
| Íconos / SEO       | Convenciones de archivo del App Router (`icon.svg`, `apple-icon.png`, `opengraph-image.jpg`, `manifest.ts`, `sitemap.ts`, `robots.ts`)                                                                                   | Next genera las etiquetas solo                                                                                                    |
| Tests              | Vitest (lógica pura) + Playwright (flujo completo)                                                                                                                                                                       |                                                                                                                                   |
| Gestor de paquetes | npm (Node 22, el único instalado)                                                                                                                                                                                        |                                                                                                                                   |
| Hosting            | Vercel, equipo `santaclouses-projects` (D6)                                                                                                                                                                              |                                                                                                                                   |

---

## 3. Arquitectura

### 3.1 Estructura

```
front/
├─ docs/                      PLAN, HANDOFF, prototipo de referencia
├─ scripts/generate-icons.mjs sharp: icon-512-fuente.png → 512 / 192 / 180
├─ public/                    icon-192.png, icon-512.png (y fotos de productos a futuro)
└─ src/
   ├─ app/
   │  ├─ layout.tsx           <html lang="es-AR">, Manrope, metadata, JSON-LD
   │  ├─ page.tsx             compone las secciones en orden
   │  ├─ globals.css          @import "tailwindcss" + @theme (tokens) + tema oscuro + base
   │  ├─ icon.svg  apple-icon.png  opengraph-image.jpg
   │  └─ manifest.ts  sitemap.ts  robots.ts
   ├─ assets/                 hero.jpg, nosotros.jpg (provisoria)
   ├─ content/
   │  ├─ products.json        ← lo edita Samuel
   │  ├─ catalog.ts           esquema Zod, tipos, getCatalog()
   │  └─ site.ts              WHATSAPP, WA_DIRECT_MESSAGE, URL, Instagram, textos SEO
   ├─ lib/
   │  ├─ cart.ts              funciones puras (ver 3.5)
   │  ├─ whatsapp.ts          buildMessage(), buildWaUrl(), WA_DIRECT_URL
   │  ├─ color.ts             shade(hex, factor)
   │  └─ cn.ts                clsx + tailwind-merge
   └─ components/
      ├─ ui/                  Container, Button, Eyebrow, SectionHead
      ├─ brand/               LogoHorizontal (mask sobre public/brand/), WhatsAppGlyph
      ├─ layout/              Nav, Footer, FloatingActions
      ├─ sections/            Hero, Promises, Spaces, Services, Process, DecayChart,
      │                       About, Products, StreamingBand, Faq
      ├─ products/            ProductCatalog, ProductCard, ProductShape, FilterChips
      └─ cart/                cart-store.ts, CartButton, CartFab, CartDrawer, Toast,
                              AddServiceButton, StreamingCta
```

### 3.2 Tokens en Tailwind v4

`tokens.css` se traslada a `globals.css`. En Tailwind v4, las variables de `@theme` se emiten como variables CSS y las utilidades las referencian, así que el tema oscuro solo redefine las variables:

```css
@import "tailwindcss";

@theme {
  --color-bg: #ffffff;
  --color-surface: #f4f4f2;
  --color-line: #e4e4e0;
  --color-muted: #6e7174;
  --color-fg: #1d1f21;
  --color-accent: #3f5e78;
  --color-accent-soft: #e3eaf0;
  --color-band: #1d1f21;
  --font-sans:
    var(--font-manrope), ui-sans-serif, system-ui, -apple-system, "Segoe UI",
    sans-serif;
  --text-display: clamp(44px, 7.2vw, 96px);
  --text-display--line-height: 1.08;
  --text-display--letter-spacing: -0.025em;
  --text-h2: clamp(34px, 4.6vw, 60px);
  --text-h3: 24px;
  --text-lead: clamp(18px, 1.6vw, 21px);
  --text-body: 17px;
  --text-small: 15px;
  --text-eyebrow: 12px;
  --radius-card: 4px;
  --container-site: 1200px;
  --breakpoint-md: 721px; /* el prototipo cambia a ≤720 */
  --breakpoint-lg: 981px; /* el prototipo cambia a ≤980 */
}

:root {
  --gutter: clamp(16px, 4vw, 48px);
  --section: clamp(96px, 12vw, 168px);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --color-bg: #141516; /* … resto del tema oscuro */
    color-scheme: dark;
  }
}
:root[data-theme="dark"] {
  --color-bg: #141516; /* … */
  color-scheme: dark;
}
```

- Uso: `bg-bg text-fg border-line`, `text-display font-light`, `rounded-card`, `max-w-site`, `px-(--gutter)`, `pt-(--section)`.
- El prototipo es _desktop-first_ (`max-width`) y Tailwind es _mobile-first_ (`min-width`): las clases base corresponden a mobile y `md:` / `lg:` reproducen los dos saltos del prototipo.
- `.eb` y `.lead` pasan a `@utility eyebrow` y `@utility lead`. Los botones son un componente `Button` con un mapa de variantes (primary, ghost, light, light-ghost; tamaño `sm`).

### 3.3 Servidor y cliente

- **Componentes de servidor** (HTML estático, sin JS): Nav (salvo el botón), Hero, Promesas, Espacios, Proceso y gráfico RT60, Quiénes somos, FAQ, Footer, la estructura de Servicios y de la banda, y el **botón flotante de WhatsApp** (es un enlace fijo).
- **Islas de cliente:** `CartButton`, `AddServiceButton`, `ProductCatalog`, `StreamingCta`, `CartDrawer`, `CartFab`, `Toast`.
- **Filtros:** se renderizan todas las tarjetas y las que no coinciden se ocultan con `hidden`. Así la selección de cada tarjeta se conserva al filtrar (como en el prototipo) y todos los productos quedan en el HTML para SEO.
- **Tipo de espacio** vive en el store (no solo en el formulario), para que la banda de productoras pueda fijarlo.

### 3.4 Tipos

```ts
type Forma = "rect" | "nube" | "trampa" | "hex" | "difusor" | "movil";
type Tela = { id: string; nombre: string; hex: string };
type Categoria = { id: string; nombre: string };
type Producto = {
  id: string;
  nombre: string;
  categoria: string;
  forma: Forma;
  resumen: string;
  detalle: string;
  medidas: string[];
  espesores: string[];
  tela: boolean;
  fabricado: boolean;
  imagen?: string | Record<string, string>; // futuro: foto general o una por tela
};
type Servicio = {
  id: string;
  nombre: string;
  resumen: string;
  incluye: string[];
};
type CartItem = {
  key: string;
  nombre: string;
  detalle: string;
  qty: number;
  servicio?: true;
};
```

Validaciones adicionales durante el build: IDs únicos, `categoria` existente, al menos una medida y existencia de la tela por defecto (`grafito`).

### 3.5 Lógica de la consulta y de WhatsApp (`lib/cart.ts`, `lib/whatsapp.ts`)

| Función / constante           | Regla                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------- |
| `productDetail(p, sel)`       | `[medida, espesor, "Tela " + tela.toLowerCase()]` sin vacíos, unido con `·`      |
| `addItem(cart, item)`         | Si ya existe la misma `key`, suma `qty`. Un servicio nunca se duplica            |
| `changeQty(cart, key, delta)` | Mínimo 1. Opera por `key`, no por índice como el prototipo                       |
| `removeItem(cart, key)`       |                                                                                  |
| `countItems(cart)`            | Cantidades de productos + 1 por servicio                                         |
| `buildMessage(cart, form)`    | Texto **exacto** del §4 del HANDOFF. Omite Nombre/Ciudad/Detalle si están vacíos |
| `buildWaUrl(msg)`             | `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`                      |
| `WA_DIRECT_URL`               | `buildWaUrl("Hola, vengo de la web.")`, calculada en build                       |
| `parseStoredCart(raw)`        | Valida lo leído de `localStorage`. Si está corrupto, devuelve `[]`               |

**Número:** `WHATSAPP = "5493424639480"`. Es la misma línea que +54 342 463-9480; en los enlaces `wa.me` los celulares argentinos llevan el **9** después del 54, como indica el HANDOFF. En pantalla se muestra `+54 9 342 463-9480`.

---

## 4. Fases

### Fase 0: Setup

- Mover `README.md` temporalmente (`create-next-app` rechaza carpetas con archivos que no reconoce; `.git` y `docs/` sí los acepta) y ejecutar:
  `npx create-next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --yes`. Después, restaurar el README.
- Copiar del paquete: JSON, assets, HANDOFF y `fuente-del-prototipo.html`.
- Agregar Prettier + `prettier-plugin-tailwindcss`, `clsx`, `tailwind-merge`, `zod`, y los scripts `lint`, `typecheck`, `test` y `e2e`.
- Instalar la CLI (`npm i -g vercel`) e importar el repo de GitHub en el equipo `santaclouses-projects`, para tener una URL de preview desde el primer push.

**Listo cuando:** `npm run build` pasa y existe una URL de preview.

### Fase 1: Fundaciones de diseño

- `globals.css`: `@theme` con los tokens (ver 3.2), tema oscuro, base (`body`, `h1`–`h3` en Light 300 con tracking −0.025em, `:focus-visible`, `prefers-reduced-motion`) y las utilidades `eyebrow` y `lead`.
- Manrope con `next/font`, conectada a `--font-sans`.
- Componentes base: `Container`, `Button`, `Eyebrow`, `SectionHead`.
- Logos y glifo de WhatsApp como componentes TSX (`currentColor`, `aria-hidden`, ancho por prop).

**Listo cuando:** tipografía y botones coinciden con el prototipo en tema claro y oscuro.

### Fase 2: Secciones estáticas

- En el orden del §3 del HANDOFF, con los textos **copiados literal** del prototipo, más **Quiénes somos** entre Proceso y Productos.
- **Nav:** enlaces Espacios, Servicios, Proceso, **Nosotros**, Productos, Contacto. Visibles desde `lg` (981 px), ver 1.3 punto 10.
- **Hero:** `next/image` con `preload`, `sizes="100vw"`, `placeholder="blur"`, `object-position: 78% 46%`, el degradé de escritorio y la versión mobile.
- **Gráfico RT60** (`DecayChart`): SVG con los valores antes/después por props, listo para cargar mediciones reales.
- **Quiénes somos** (`#nosotros`, componente `About`). Arma la sección con patrones que ya existen en el prototipo, sin estilos nuevos. Los textos vienen del carrusel de Instagram:
  - Encabezado (mismo patrón que las demás secciones): eyebrow "Quiénes somos", H2 "Acústica a medida para cada espacio.", bajada "En Acústica Santa Fe no partimos de un producto: partimos de tu recinto y de lo que vas a hacer en él."
  - Dos columnas (una en mobile): a la izquierda la foto, 4:3 con radio de 4 px (provisoria: la lana de roca recortada de la placa 03). A la derecha un H3 "Combinamos conocimiento técnico, análisis y selección de materiales.", el texto "Para mejorar el comportamiento del sonido, optimizar la calidad acústica y reducir la transmisión de ruido." y el párrafo "Cada proyecto, personalizado. Buscamos el equilibrio entre lo que se mide, lo que se usa y lo que se ve."
  - Tres ejes con el estilo de los pasos de "Cómo funciona" (borde superior grafito, número en azul): 01 Rendimiento acústico · 02 Funcionalidad · 03 Estética.
- **Footer:** el número de WhatsApp pasa a ser un enlace a `WA_DIRECT_URL`. "Escribinos →" de "Consultá tu caso particular" también.

**Listo cuando:** la comparación lado a lado con el prototipo a 1440, 1024, 768 y 390 px no muestra diferencias, la nav no se desborda en ningún ancho entre 320 y 1440 px, y Quiénes somos se ve como parte del mismo sistema.

### Fase 3: Catálogo

- `catalog.ts` con el esquema Zod y `getCatalog()`.
- `ProductShape`: port de `shape()` usando `shade()`.
- `ProductCard`: selects, muestras de tela (`aria-pressed`, `aria-label`; "otro" con `conic-gradient`), cantidad y botón Agregar.
- `FilterChips`: `role="group"` y `aria-pressed`.

**Listo cuando:** se ven los 6 productos, filtrar conserva la selección y elegir una tela cambia el color de la ilustración.

### Fase 4: Consulta, WhatsApp y botones flotantes

- `cart-store` + funciones puras.
- `CartButton` en la nav, `Toast` con `role="status"`.
- `CartDrawer` (`<dialog>`): lista editable, formulario (Nombre, Ciudad, Tipo de espacio, Detalle opcional), botón a wa.me en pestaña nueva y la aclaración debajo.
- `AddServiceButton` y `StreamingCta`.
- Bloquear el scroll del fondo con `html:has(dialog[open]) { overflow: hidden }`.
- **`FloatingActions`**, grupo fijo abajo a la derecha que respeta `safe-area-inset-bottom`:
  - **Botón de WhatsApp** en todos los anchos: círculo de 56 px en grafito con el glifo de WhatsApp en blanco. En tema oscuro se invierte, como el resto de los botones. Lleva `aria-label="Escribinos por WhatsApp"` y abre `WA_DIRECT_URL` en pestaña nueva. Se usa grafito y no el verde de WhatsApp para respetar la paleta (azul solo como acento); el glifo alcanza para reconocerlo.
  - **"Mi consulta · N"** (el botón flotante del prototipo) solo en mobile (< 721 px), a la izquierda del de WhatsApp en la misma fila. A 360 px de ancho entran los dos.
  - En mobile el toast sube por encima de esa fila, para no tapar los botones.
  - El panel abierto (`<dialog>` modal) queda por encima de los botones flotantes.

**Listo cuando:** el mensaje de consulta coincide carácter por carácter con el formato del HANDOFF (con test), la consulta sobrevive a una recarga, todo el flujo funciona solo con teclado y a 360 px los botones flotantes no se superponen entre sí ni con el toast.

### Fase 5: SEO, metadatos e íconos

- `metadata` en el layout: title y description del HANDOFF, `metadataBase: https://acusticasantafe.com`, Open Graph (`locale: es_AR`) y tarjeta de Twitter.
- JSON-LD `LocalBusiness`: nombre, URL, teléfono `+54 9 342 463-9480`, dirección (`addressLocality`/`addressRegion` Santa Fe, `addressCountry` AR), `areaServed: Argentina`, `sameAs` con Instagram y logo.
- Íconos: `icon.svg` (favicon), `apple-icon.png` de 180 y `manifest.ts` con 192/512, generados por `scripts/generate-icons.mjs` (sharp).
- `opengraph-image.jpg` de 1200×630, generada por script: logo apilado **en blanco** centrado sobre el panel negro de la hero (regla del kit). **Peso < 300 KB**, para que WhatsApp muestre la vista previa (es el canal principal del negocio).
- `sitemap.ts` y `robots.ts`.

**Listo cuando:** el Rich Results Test no da errores y al pegar el link en WhatsApp aparece la vista previa con imagen.

### Fase 6: QA

- **Unitarios (Vitest):** `buildMessage` con y sin nombre, ciudad, nota y servicios; `addItem` (suma y no duplica servicios); `countItems`; `productDetail` (un solo espesor, sin tela); `parseStoredCart` con datos corruptos; `WA_DIRECT_URL` = `https://wa.me/5493424639480?text=Hola%2C%20vengo%20de%20la%20web.`
- **E2E (Playwright):** agregar 2 paneles de 100 mm en tela azul, abrir la consulta, completar el formulario y verificar el `href` de wa.me decodificado; recargar y comprobar que persiste; probar la banda de streaming; botones flotantes en 360 px y 1440 px; el enlace "Nosotros" lleva a la sección.
- **Accesibilidad:** axe sin violaciones; recorrido completo con teclado; foco visible; contraste ≥ 4.5:1 en ambos temas (incluido el texto blanco sobre la hero, el contador azul y el botón de WhatsApp); `prefers-reduced-motion`.
- **Rendimiento:** Lighthouse mobile ≥ 95 en las cuatro categorías; LCP de la hero < 2,5 s.
- **Dispositivos reales:** abrir los dos tipos de enlace de WhatsApp en Android, iOS y WhatsApp Web, y confirmar que el chat abre con el número correcto y el texto precargado.

### Fase 7: Producción

- Proyecto en el equipo de Vercel `santaclouses-projects`, conectado a `main`.
- Dominio `acusticasantafe.com`: el apex como principal y `www` redirigiendo al apex. HTTPS automático. Hay que cargar los registros DNS donde esté registrado el dominio (pendiente en D6).
- Vercel Web Analytics + Speed Insights (D7).
- Merge a `main` → deploy a producción.

### Fase 8: Después del lanzamiento (contenido que define Samuel)

| Pendiente                                                         | Dónde se cambia                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Catálogo final (incluida la densidad de la lana de roca, ver 1.4) | `src/content/products.json`. Si tiene errores, falla el build del preview y nunca llega a producción                                                                                                                                                                                                                                                               |
| Hero definitiva                                                   | Reemplazar `src/assets/hero.jpg` con el mismo nombre; ajustar `object-position` si cambia el encuadre. Candidata: la foto original del panel en ángulo usada en `Marcos-feed/_vista-previa`                                                                                                                                                                        |
| Fotos de Quiénes somos                                            | Reemplazar `src/assets/nosotros.jpg` por el original del taller (placa 01) o de la lana de roca (placa 03), sin texto encima                                                                                                                                                                                                                                       |
| Fotos de productos y proyectos                                    | Campo `imagen` en el JSON + archivos en `public/productos/`. La tarjeta muestra la foto en lugar de la ilustración. **Formato a pedir:** el producto recortado en PNG con fondo transparente (el mismo que Samuel prepara para el `Fondo-producto` de Instagram), así la web lo apoya sobre `--color-surface` en 4:3 sin sumar el texto ni el logo de la plantilla |
| Mediciones RT60 reales                                            | Props de `DecayChart` y quitar "(ejemplo ilustrativo)". Actualizar también los carruseles de Instagram                                                                                                                                                                                                                                                             |
| CMS (opcional)                                                    | Reemplazar `getCatalog()` por una consulta a Sanity                                                                                                                                                                                                                                                                                                                |

---

## 5. Decisiones

| #   | Tema                                 | Estado                | Definición                                                                                                                                                                                                                                                            |
| --- | ------------------------------------ | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Estilos                              | **Resuelta**          | Tailwind CSS v4                                                                                                                                                                                                                                                       |
| D2  | ¿Botón visible para cambiar de tema? | Por defecto           | No: sigue al sistema, como dice el HANDOFF. Se mantiene el soporte de `data-theme`                                                                                                                                                                                    |
| D3  | ¿Mostrar el `detalle` del producto?  | Por defecto           | No por ahora (igual que el prototipo). Puede sumarse después como línea extra, al estilo de la pieza de Instagram                                                                                                                                                     |
| D4  | Contacto directo por WhatsApp        | **Resuelta**          | Botón flotante en todos los anchos con el mensaje "Hola, vengo de la web." El mismo enlace se usa en el footer y en "Escribinos →"                                                                                                                                    |
| D5  | Imagen OG                            | **Resuelta**          | Logo apilado en blanco sobre la hero oscurecida (regla del kit)                                                                                                                                                                                                       |
| D6  | Hosting y dominio                    | **Resuelta en parte** | Cuenta: `vercel.com/santaclouses-projects`. **Falta:** dónde está registrado `acusticasantafe.com` (para cargar el DNS) y en qué plan está la cuenta. Los términos de Vercel limitan el plan Hobby a uso personal no comercial; un sitio de negocio corresponde a Pro |
| D7  | Analítica                            | Por defecto           | Vercel Web Analytics. Medir por separado "WhatsApp directo" y "WhatsApp consulta" requiere eventos personalizados (plan Pro)                                                                                                                                          |
| D8  | Sección "Quiénes somos"              | **Resuelta**          | Se suma al lanzamiento, entre Proceso y Productos, con enlace "Nosotros" en la nav                                                                                                                                                                                    |

## 6. Riesgos

| Riesgo                                                                            | Mitigación                                                                                                       |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Diferencias visuales al traducir el CSS del prototipo a clases de Tailwind        | La comparación lado a lado es el criterio de aceptación de la Fase 2. Los tokens usan los mismos valores exactos |
| Quiénes somos queda con una foto provisoria de baja resolución (1080 px de ancho) | Se muestra a media columna; reemplazar por el original en cuanto esté (Fase 8)                                   |
| Error de hidratación en el contador                                               | `useSyncExternalStore` con snapshot vacío en el servidor                                                         |
| JSON editado con errores                                                          | La validación Zod hace fallar el build del preview, no producción                                                |
| Productos renombrados o eliminados con consultas ya guardadas en navegadores      | Los ítems guardan nombre y detalle como texto, así que siguen sirviendo para el mensaje                          |
| Número de WhatsApp mal formado                                                    | Constante única en `site.ts` (con el 9) y test del URL                                                           |
| Dos botones flotantes tapan contenido en mobile                                   | Se agrupan en una sola fila abajo a la derecha y el toast sube por encima (Fase 4)                               |
