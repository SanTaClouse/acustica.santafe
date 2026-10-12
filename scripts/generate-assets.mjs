// Genera los assets derivados a partir de scripts/source/ (marca, íconos y
// fuentes Manrope para la imagen Open Graph).
// Uso: npm run assets  (correr de nuevo si cambia alguna fuente)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ImageResponse } from "next/og.js";
import { createElement } from "react";
import sharp from "sharp";
import { optimize } from "svgo";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => join(root, "scripts/source", f);
const out = (f) => join(root, f);

// SVG de marca: los originales tienen miles de puntos con 2 decimales.
// Con 1 decimal pesan un 60 % menos sin diferencia visible.
const svg = async (from, to) => {
  const { data } = optimize(await readFile(src(from), "utf8"), {
    floatPrecision: 1,
  });
  await mkdir(dirname(out(to)), { recursive: true });
  await writeFile(out(to), data);
};
await svg(
  "logo-horizontal-currentColor.svg",
  "public/brand/logo-horizontal.svg",
);
await svg("favicon.svg", "src/app/icon.svg");

// Íconos de app: la fuente es un cuadrado grafito a sangre (1080×1080).
const icon = src("icon-512-fuente.png");
await sharp(icon).resize(180, 180).png().toFile(out("src/app/apple-icon.png"));
await sharp(icon).resize(192, 192).png().toFile(out("public/icon-192.png"));
await sharp(icon).resize(512, 512).png().toFile(out("public/icon-512.png"));

// Las fotos de src/assets/ y public/productos/ son renders que vienen ya listos
// para la web: no se generan acá.

// Open Graph 1200×630: titular en Manrope y logo a la izquierda, la foto de la
// hero (paneles y mesa) a la derecha. Se arma con el ImageResponse de Next y se
// pasa a JPG < 300 KB para que WhatsApp muestre la vista previa (el PNG pesa el
// doble). WhatsApp recorta en cuadrado al centro: queda el titular y un panel.
const W = 1200;
const H = 630;
const FOTO = 600;
const h = (type, style, ...children) =>
  createElement(type, { style }, ...children);
const dataUri = (mime, buf) => `data:${mime};base64,${buf.toString("base64")}`;

const fondo = await sharp(join(root, "src/assets/hero.jpg"))
  .extract({ left: 1300, top: 0, width: 1260, height: 1097 })
  .resize(FOTO, H, { fit: "cover" })
  .jpeg({ quality: 90 })
  .toBuffer();
const logoOg = (
  await readFile(src("logo-horizontal-currentColor.svg"), "utf8")
).replaceAll("currentColor", "#1D1F21");

const og = new ImageResponse(
  h(
    "div",
    {
      width: "100%",
      height: "100%",
      display: "flex",
      background: "#EFE9E0",
      color: "#1D1F21",
      fontFamily: "Manrope",
    },
    h(
      "div",
      {
        width: W - FOTO,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 0 52px 64px",
      },
      createElement("img", {
        src: dataUri("image/svg+xml", Buffer.from(logoOg)),
        width: 220,
        height: 60,
      }),
      h(
        "div",
        { display: "flex", flexDirection: "column" },
        h(
          "div",
          {
            fontSize: 76,
            fontWeight: 300,
            lineHeight: 1.02,
            letterSpacing: -2.5,
          },
          "Diseñamos cómo suena tu espacio.",
        ),
        h(
          "div",
          {
            marginTop: 28,
            fontSize: 27,
            fontWeight: 300,
            lineHeight: 1.35,
            color: "#4A4D50",
            maxWidth: 500,
          },
          "Paneles acústicos a medida para estudios, streaming y comercios.",
        ),
      ),
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontSize: 22,
          fontWeight: 600,
        },
        h("div", {
          width: 12,
          height: 12,
          borderRadius: 6,
          background: "#1F4E57",
        }),
        "acusticasantafe.com · Envíos a todo el país",
      ),
    ),
    createElement("img", {
      src: dataUri("image/jpeg", fondo),
      width: FOTO,
      height: H,
    }),
  ),
  {
    width: W,
    height: H,
    fonts: [
      {
        name: "Manrope",
        data: await readFile(src("Manrope-Light.ttf")),
        weight: 300,
        style: "normal",
      },
      {
        name: "Manrope",
        data: await readFile(src("Manrope-SemiBold.ttf")),
        weight: 600,
        style: "normal",
      },
    ],
  },
);
await sharp(Buffer.from(await og.arrayBuffer()))
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(out("src/app/opengraph-image.jpg"));
await writeFile(
  out("src/app/opengraph-image.alt.txt"),
  "Acústica Santa Fe: «Diseñamos cómo suena tu espacio». Paneles acústicos a medida, junto a una sala con paneles color petróleo",
);

console.log("Assets generados.");
