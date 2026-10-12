# Acústica Santa Fe — Web · Paquete para implementación

Documento para el agente/desarrollador que construya **acusticasantafe.com**.
El diseño ya está resuelto en `prototipo/acustica-santafe-web.html` (funciona abriéndolo en un navegador). La tarea es llevarlo a producción, no rediseñarlo.

## 1. Contenido del paquete

| Ruta                                  | Qué es                                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `prototipo/acustica-santafe-web.html` | Prototipo completo y funcional (un solo archivo, imágenes embebidas). **Referencia visual y de comportamiento.** |
| `prototipo/fuente-del-prototipo.html` | El mismo prototipo sin la imagen embebida: más fácil de leer el CSS/JS.                                          |
| `data/products.json`                  | Catálogo (telas, categorías, productos, servicios). Fuente única de datos.                                       |
| `design/tokens.css`                   | Colores, tipografía, espaciado y radios, con tema oscuro.                                                        |
| `assets/`                             | Logos SVG en `currentColor`, favicon, hero provisoria, fuente para íconos de app.                                |

## 2. Stack sugerido

- Next.js (App Router) + TypeScript. Sitio estático (SSG); no hace falta backend.
- Tipografía: `next/font/google` → **Manrope** 300/400/500/600.
- Estilos: CSS Modules o Tailwind mapeando exactamente `design/tokens.css`.
- Carrito: estado en cliente (Context o Zustand) persistido en `localStorage` (clave `asf-cart`).
- Deploy: Vercel. Dominio: `acusticasantafe.com`.

## 3. Estructura de la página (una sola página con anclas)

1. **Nav fija** — logo horizontal, links (Espacios, Servicios, Proceso, Productos, Contacto), botón **Mi consulta** con contador.
2. **Hero** — foto a todo ancho, eyebrow "Acondicionamiento acústico · Todo el país", H1 **"Diseñamos cómo suena tu espacio."**, bajada, CTAs "Ver productos" / "Pedir asesoramiento". Degradé oscuro a la izquierda para que el texto se lea.
3. **Promesas** — 3 columnas: Datos reales · Render 3D · Resultado verificado.
4. **Qué abarcamos** (`#espacios`) — 4 celdas: Salas de streaming (marcada "Nuestro foco"), Estudios de grabación, Comercios y oficinas, Consultá tu caso particular.
5. **Servicios** (`#servicios`) — Asesoramiento acústico y Proyecto llave en mano, cada uno con lista de lo que incluye y botón "Agregar a mi consulta".
6. **Cómo funciona** (`#proceso`) — 4 pasos + bloque "Lo que medimos" con gráfico de RT60 antes/después (SVG, ejemplo ilustrativo; reemplazar con datos reales cuando existan).
7. **Productos** (`#productos`) — filtros por categoría, grilla de tarjetas. Cada tarjeta: ilustración, categoría, nombre, resumen, selector de medida, de espesor (si hay más de uno), muestras de tela (la ilustración toma el color elegido), cantidad y "Agregar".
8. **Banda productoras** — fondo grafito, "¿Vas a armar una sala de streaming?", botón que agrega "Proyecto sala de streaming" a la consulta y abre el carrito.
9. **Preguntas frecuentes** — `<details>` nativos.
10. **Footer** (`#contacto`) — logo, frase de cierre, WhatsApp, Instagram, web, base.

Los textos definitivos están en el prototipo: copiarlos tal cual.

## 4. Carrito → WhatsApp (comportamiento clave)

- No hay precios ni pago. El carrito es una **consulta**.
- Ítems de producto: `{ key, nombre, detalle, qty }`, donde `key = id + "|" + detalle` para que la misma configuración sume cantidad.
- Servicios: `{ key: "svc:<id>", nombre, detalle: "Servicio", servicio: true }`, sin cantidad, no se duplican.
- Panel lateral con: lista editable (±, Quitar), campos Nombre, Ciudad, Tipo de espacio (select), Detalle (opcional).
- Botón **Pedir presupuesto por WhatsApp** → `https://wa.me/<NUMERO>?text=<mensaje urlencoded>`, en pestaña nueva.
- Formato del mensaje:

```
Hola, Acústica Santa Fe. Quiero pedir un presupuesto.
Nombre: …
Ciudad: …
Tipo de espacio: …

Mi consulta:
• 4 × Panel absorbente (120 × 60 cm · 100 mm · Tela grafito)
• Asesoramiento acústico

Detalle: …

Enviado desde acusticasantafe.com
```

- **Número**: constante `WHATSAPP = "5493424639480"` (se muestra como +54 9 342 463-9480). El 9 después del 54 es obligatorio para celulares argentinos en wa.me.
- En mobile hay un botón flotante "Mi consulta · N".

## 5. Catálogo (`data/products.json`)

- Es una **propuesta inicial**: las medidas, espesores y textos están por confirmar. El sitio debe leer todo de este JSON para que se pueda editar sin tocar código (o migrarlo luego a un CMS liviano, p. ej. un JSON en el repo o Sanity).
- `forma` define la ilustración SVG de la tarjeta (`rect`, `nube`, `trampa`, `hex`, `difusor`, `movil`); ver la función `shape()` del prototipo. Cuando haya **fotos reales**, agregar `imagen` por producto y por color de tela y mostrar la foto en lugar de la ilustración.
- `fabricado: false` muestra "Seleccionado" (reventa) en vez de "Fabricación propia".

## 6. Diseño — reglas que no se negocian

- Mucho aire: secciones separadas por `--section`, máximo ~65 caracteres por línea de texto.
- Una sola familia (Manrope). Títulos en Light 300 con tracking negativo; nunca negrita en títulos.
- El azul es acento puntual (contadores, viñetas, datos, focus). Botones principales en grafito.
- Bordes finos (`--color-line`), radios chicos (4 px) y botones en píldora. Sin sombras decorativas.
- Tema oscuro incluido (tokens). Contraste de texto ≥ 4.5:1 en ambos temas.
- `prefers-reduced-motion` respetado. Focus visible en todos los controles.

## 7. SEO y metadatos

- `<title>`: "Acústica Santa Fe · Acondicionamiento acústico para estudios, streaming y comercios"
- Description: "Medimos, diseñamos y construimos soluciones acústicas para estudios de grabación, salas de streaming y comercios. Trabajamos en todo el país."
- `lang="es-AR"`. Open Graph con imagen 1200×630 (logo apilado sobre foto del hero).
- Schema.org `LocalBusiness` (Santa Fe, AR; areaServed: Argentina).
- Favicon: `assets/favicon.svg` + PNG 512/192/180 generados desde `assets/icon-512-fuente.png`.

## 8. Pendientes de contenido (los define Samuel)

- [ ] Catálogo final: productos, medidas, espesores, colores de tela.
- [ ] Foto de hero definitiva (la actual es provisoria: panel sobre pared blanca).
- [ ] Fotos de productos y de proyectos terminados.
- [ ] Datos reales de mediciones (antes/después) para reemplazar el gráfico de ejemplo.
