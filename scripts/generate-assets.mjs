// Genera los assets derivados a partir de scripts/source/.
// Uso: npm run assets  (correr de nuevo si cambia alguna fuente)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
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

// Quiénes somos (provisoria): la mitad superior de la placa 03 es foto limpia.
await sharp(src("quienes-somos-03.png"))
  .extract({ left: 0, top: 0, width: 1080, height: 552 })
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(out("src/assets/nosotros.jpg"));

// Open Graph 1200×630: el logo apilado en blanco, centrado sobre el panel negro
// de la hero, como una placa (regla del kit: blanco sobre zonas oscuras).
// JPG < 300 KB para que WhatsApp muestre la vista previa.
// Si cambia la foto de la hero, revisar PANEL (centro del panel en el recorte).
const W = 1200;
const H = 630;
const PANEL = { x: 617, y: 321 };
const hero = await sharp(join(root, "src/assets/hero.jpg"))
  .resize(W, H, { fit: "cover", position: "right" })
  .toBuffer();
const logoSvg = (
  await readFile(src("logo-apilado-currentColor.svg"), "utf8")
).replaceAll("currentColor", "#FFFFFF");
const LOGO_W = 280;
const logo = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: LOGO_W })
  .png()
  .toBuffer();
const { height: logoH } = await sharp(logo).metadata();
await sharp(hero)
  .composite([
    {
      input: logo,
      left: Math.round(PANEL.x - LOGO_W / 2),
      top: Math.round(PANEL.y - logoH / 2),
    },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(out("src/app/opengraph-image.jpg"));
await writeFile(
  out("src/app/opengraph-image.alt.txt"),
  "Acústica Santa Fe: logo sobre un panel acústico instalado en una pared blanca",
);

console.log("Assets generados.");
