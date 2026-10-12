# acustica.santafe

Sitio de [acusticasantafe.com](https://acusticasantafe.com): una sola página con catálogo y
"Mi consulta", que arma un pedido de presupuesto y lo envía por WhatsApp. No hay precios ni pago.

Next.js 16 (App Router, Cache Components) + Tailwind CSS 4. Todo el sitio se prerenderiza en el
build (`ensureStatic = "navigation"` en el layout): no hay render por request.

## Comandos

| Comando             | Qué hace                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                                                    |
| `npm run build`     | Build de producción (también valida `products.json`)                                      |
| `npm test`          | Tests unitarios (Vitest): carrito y mensaje de WhatsApp                                   |
| `npm run e2e`       | Tests de punta a punta y accesibilidad (Playwright + axe). Requiere `npm run build` antes |
| `npm run typecheck` | TypeScript                                                                                |
| `npm run lint`      | ESLint                                                                                    |
| `npm run format`    | Prettier (ordena también las clases de Tailwind)                                          |
| `npm run assets`    | Regenera íconos, imagen OG, logo y foto de "Quiénes somos" desde `scripts/source/`        |

La primera vez que se corren los E2E: `npx playwright install chromium`.

## Editar contenido

- **Catálogo** (telas, categorías, productos, servicios): [`src/content/products.json`](src/content/products.json).
  Se valida en el build: si algo está mal (una categoría que no existe, un color mal escrito),
  el build falla con el detalle y el error nunca llega a producción.
- **Fotos de productos:** agregar `"imagen": "/productos/archivo.jpg"` al producto (o un objeto por
  id de tela) y el archivo en `public/productos/`. La tarjeta muestra la foto en lugar de la
  ilustración. Ideal: el producto recortado con fondo transparente.
- **WhatsApp, Instagram, textos de SEO, tipos de espacio:** [`src/content/site.ts`](src/content/site.ts).
- **Gráfico RT60:** valores en [`src/components/sections/Process.tsx`](src/components/sections/Process.tsx)
  (`MEDICION`). Con datos reales, pasar `ejemplo: false`.
- **Foto de la hero / "Quiénes somos":** reemplazar `src/assets/hero.jpg` o `src/assets/nosotros.jpg`
  con el mismo nombre. Si cambia la hero, correr `npm run assets` (la imagen OG se arma con ella) y
  revisar `PANEL` en `scripts/generate-assets.mjs`.
- Los textos de cada sección están en `src/components/sections/`.

## Estructura

```
src/
  app/          layout (metadata, fuente), página, íconos, OG, manifest, sitemap, robots, estilos
  content/      products.json + validación (catalog.ts) y constantes del sitio (site.ts)
  lib/          lógica pura: carrito, mensaje de WhatsApp, color
  components/   ui/ (base), layout/, sections/, products/, cart/ (store e islas de cliente), brand/
scripts/        generate-assets.mjs y las fuentes de marca (scripts/source/)
e2e/            tests de Playwright
docs/           plan de implementación, HANDOFF y prototipo de referencia
```

Diseño: los tokens del paquete están en el `@theme` de [`src/app/globals.css`](src/app/globals.css),
con tema oscuro automático. El prototipo original está en [`docs/prototipo/`](docs/prototipo/) y el
plan con las decisiones en [`docs/PLAN-IMPLEMENTACION.md`](docs/PLAN-IMPLEMENTACION.md).

## Deploy

Vercel, equipo `santaclouses-projects`. Cada push genera un preview; `main` va a producción.
