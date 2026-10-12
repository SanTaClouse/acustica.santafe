import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Acústica SF",
    description: SITE_DESCRIPTION,
    lang: "es-AR",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#1d1f21",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // El ícono es grafito a sangre con la onda centrada: sirve como maskable.
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
