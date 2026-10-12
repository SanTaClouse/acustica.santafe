import { preload } from "react-dom";
import { cn } from "@/lib/cn";

const SRC = "/brand/logo-horizontal.svg";

// El logo es un archivo aparte (cacheable) pintado con `mask` + currentColor:
// toma el color del texto, así que sigue al tema claro u oscuro. Inline, sus
// 26 KB de trazado viajaban dos veces por uso (HTML y payload de React).
export function LogoHorizontal({ className }: { className?: string }) {
  preload(SRC, { as: "image", type: "image/svg+xml" });
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block aspect-[395.33/108] bg-current mask-contain mask-center mask-no-repeat forced-color-adjust-none",
        className,
      )}
      style={{ maskImage: `url(${SRC})`, WebkitMaskImage: `url(${SRC})` }}
    />
  );
}
