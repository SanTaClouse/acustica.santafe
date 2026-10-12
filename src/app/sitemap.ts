import type { MetadataRoute } from "next";
import { getCatalog } from "@/content/catalog";
import { SITE_URL } from "@/content/site";

// Una sola página: se listan sus fotos de producto para Google Imágenes.
export default function sitemap(): MetadataRoute.Sitemap {
  const fotos = getCatalog()
    .productos.flatMap((p) =>
      typeof p.imagen === "string" ? [p.imagen] : Object.values(p.imagen ?? {}),
    )
    .map((src) => `${SITE_URL}${src}`);
  return [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
      images: [`${SITE_URL}/opengraph-image.jpg`, ...fotos],
    },
  ];
}
